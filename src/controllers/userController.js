import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import "dotenv/config";

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
    req.flash("error", "패스워드를 다시 입력해주세요. 🫢");
    return res.status(400).render("users/join", {
      pageTitle,
    });
  }
  // email check
  const exists = await User.exists({ email });
  if (exists) {
    req.flash("error", "이메일이 이미 존재합니다. 😳");
    return res.status(400).render("users/join", {
      pageTitle,
    });
  }
  // heroku || 4000
  const PORT = process.env.PORT || 4000;
  // create User
  try {
    await User.create({
      email,
      password,
      name,
      gender,
      birth,
      hobby,
      avatarUrl: `${process.env.SERVER}${PORT}/images/basic_profile.png`,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "다시 입력헤주세요. 😅");
    return res.status(400).render("users/join", {
      pageTitle,
    });
  }

  req.flash("info", `${name}님 가입을 환영합니다! 🤩`);
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
    req.flash("error", "이메일을 다시 입력해주세요!");
    return res.status(400).render("users/login", {
      pageTitle: "Login",
    });
  }
  // Check password
  const pwCheck = await bcrypt.compare(password, user.password);
  if (!pwCheck) {
    req.flash("error", "비밀번호를 다시 입력해주세요!");
    return res.status(400).render("users/login", {
      pageTitle: "Login",
    });
  }
  // Save Session INFO
  req.session.loggedIn = true;
  req.session.user = user;
  req.flash("info", `환영합니다! ${user.name}님! 🤩`);
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
    redirect_uri: `http://localhost:${process.env.PORT}/users/kakao/callback`,
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
const handleGetEdit = (req, res) => {
  res.render("users/edit", {
    pageTitle: "Edit",
  });
};
const handlePostEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, gender, birth },
    file,
  } = req;
  const updateUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.location : avatarUrl,
      name,
      gender,
      birth,
    },
    {
      new: true,
    }
  );
  if (!updateUser) {
    req.flash("error", "존재하지 않는 유저입니다! 😳");
    res.status(404).render("404", {
      pageTitle: "updateUser is NULL",
    });
  }
  req.session.user = updateUser;
  return res.redirect(`/users/${updateUser._id}`);
};
const handleGetChangePw = (req, res) => {
  return res.render("users/change-pw", {
    pageTitle: "Change Password",
  });
};
const handlePostChangePw = async (req, res) => {
  // POST data & Session INFO
  const {
    session: {
      user: { password, _id },
    },
    body: { oldPw, newPw, newPw2 },
  } = req;
  // Check Password
  const pwCheck = await bcrypt.compare(oldPw, password);
  if (!pwCheck) {
    req.flash("error", "기존 비밀번호가 맞지 않아요.. 😳");
    return res.status(400).render("users/change-pw", {
      pageTitle: "Change Password",
    });
  }
  // Check New Password
  if (newPw !== newPw2) {
    req.flash("error", "새로운 비밀번호가 일치하지 않아요.. 😳");
    return res.status(400).render("users/change-pw", {
      pageTitle: "Change Password",
    });
  }
  // Check Same Password
  if (oldPw === newPw) {
    req.flash("error", "새로운 비밀번호와 기존 비밀번호가 같아요.. 😳");
    return res.status(400).render("users/change-pw", {
      pageTitle: "Change Password",
    });
  }
  // Change New Password
  const user = await User.findById(_id);
  user.password = newPw;
  await user.save();
  // // Logout & RE Login
  req.flash("info", "새로운 비밀번호로 로그인해주세요 😎");
  req.session.destroy();
  return res.redirect("/login");
};

const handleUserProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "myVideos",
    populate: {
      path: "publisher",
      model: "User",
    },
  });
  // NOT Found User
  if (!user) {
    console.log("여기");
    return res.status(404).render("404", {
      pageTitle: "User Not Found",
    });
  }
  // Sort Videos
  const myVideos = user.myVideos;
  const descVideos = myVideos.sort((a, b) => b.createdAt - a.createdAt);
  return res.render("users/profile", {
    pageTitle: `${user.name}'s Profile`,
    profileUser: user,
    descVideos,
  });
};
const handleResetAvatar = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const user = await User.findById(_id);

  // Reset AvatarUrl
  if (user.avatarUrl) {
    user.avatarUrl = null;
  } else {
    req.flash("error", "이미 기본 프로필입니다. 😳");
    return res.status(404).redirect("edit");
  }
  // Save Avatar Url
  await user.save();
  req.session.user = user;
  // Redirect Page
  return res.redirect(`/users/${_id}`);
};

export {
  handleGetLogin,
  handlePostLogin,
  handleGetJoin,
  handlePostJoin,
  handleUserProfile,
  handleLogout,
  handleGetChangePw,
  handlePostChangePw,
  handleGetEdit,
  handlePostEdit,
  handleGithubLogin,
  handleGithubCallback,
  handleKakaoLogin,
  handleKakaoCallback,
  handleResetAvatar,
};
