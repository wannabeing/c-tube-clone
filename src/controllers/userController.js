import { redirect, render } from "express/lib/response";
import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

// In Home Routers
const handleGetJoin = (req, res) => {
  return res.render("users/join", {
    pageTitle: "Join",
  });
};
const handlePostJoin = async (req, res) => {
  // POST form
  const { email, password, password2, name, gender, birth, hobby } = req.body;
  const pageTitle = "Join";

  // password check
  if (password !== password2) {
    return res.status(400).render("users/join", {
      pageTitle,
      errorMsg: "패스워드를 다시 입력해주세요.",
    });
  }

  // email check
  const exists = await User.exists({ email });
  if (exists) {
    return res.status(400).render("users/join", {
      pageTitle,
      errorMsg: "이메일이 이미 존재합니다.",
    });
  }
  // create User
  try {
    await User.create({
      email,
      password,
      name,
      gender,
      birth,
      hobby,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).render("users/join", {
      pageTitle: "Join",
      errorMsg: "다시 입력헤주세요.",
    });
  }
  return res.redirect("/login");
};
const handleGetLogin = (req, res) => {
  return res.render("users/login", {
    pageTitle: "Login",
  });
};
const handlePostLogin = async (req, res) => {
  // POST form
  const { email, password } = req.body;

  // Find User in DB
  const user = await User.findOne({ email, socialLogin: false });

  // Check email
  if (!user) {
    return res.status(400).render("users/login", {
      pageTitle: "Login",
      errorMsg: "존재하지 않는 계정입니다.",
    });
  }
  // Check password
  const pwCheck = await bcrypt.compare(password, user.password);
  if (!pwCheck) {
    return res.status(400).render("users/login", {
      pageTitle: "Login",
      errorMsg: "존재하지 않는 계정입니다.",
    });
  }
  // Save Session INFO
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

// In Kakao Routers
const handleKakaoLogin = (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/authorize";
  const config = {
    client_id: process.env.KK_CLIENT,
    redirect_uri: "http://localhost:4000/users/kakao/callback",
    response_type: "code",
  };
  const params = new URLSearchParams(config).toString();
  const redirectUrl = `${baseUrl}?${params}`;
  return res.redirect(redirectUrl);
};
const handleKakaoCallback = async (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/token";
  const config = {
    client_id: process.env.KK_CLIENT,
    grant_type: "authorization_code",
    redirect_uri: "http://localhost:4000/users/kakao/callback",
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const redirectUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(redirectUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://kapi.kakao.com/v2/user/me";
    const userData = await (
      await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();
    let user = await User.findOne({ email: userData.kakao_account.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.kakao_account.profile.profile_image_url,
        password: "",
        email: userData.kakao_account.email,
        name: userData.kakao_account.profile.nickname,
        gender: userData.kakao_account.gender,
        birth: userData.kakao_account.birthday
          ? userData.kakao_account.birthday
          : null,
        socialLogin: true,
      });
      console.log(user);
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    res.redirect("/login");
  }
};
// In Github Routers
const handleGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const redirectUrl = `${baseUrl}?${params}`;
  return res.redirect(redirectUrl);
};
const handleGithubCallback = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const redirectUrl = `${baseUrl}?${params}`;
  // Find Access Token
  const tokenRequest = await (
    await fetch(redirectUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  // Existing Access Token
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    // Find Github User data
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    // Find Github Email data
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    // Find Email (verified & primary)
    const emailObj = emailData.find(
      (email) => email.verified === true && email.primary === true
    );
    // Email Not Found
    if (!emailObj) {
      res.redirect("/login");
    }
    // DB User Email === Github User Email
    let user = await User.findOne({ email: emailObj.email });
    // Create New User
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        password: "",
        email: emailObj.email,
        name: userData.name ? userData.name : "Unknown",
        socialLogin: true,
      });
      console.log(user);
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  }
  // Access Token Not Found
  else {
    res.redirect("/login");
  }
};

// In User Routers
const handleLogout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

const handleUserProfile = (req, res) => res.send("/users/:id!");
const handleEdit = (req, res) => res.send("/user/edit!");
const handleDel = (req, res) => res.send("/user/del!");

export {
  handleGetLogin,
  handlePostLogin,
  handleGetJoin,
  handlePostJoin,
  handleUserProfile,
  handleLogout,
  handleDel,
  handleEdit,
  handleGithubLogin,
  handleGithubCallback,
  handleKakaoLogin,
  handleKakaoCallback,
};
