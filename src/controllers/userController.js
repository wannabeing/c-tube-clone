import { redirect, render } from "express/lib/response";
import User from "../models/User";
import bcrypt from "bcrypt";

// In Home Routers
const handleGetJoin = (req, res) => {
  return res.render("users/join", {
    pageTitle: "Join",
  });
};
const handlePostJoin = async (req, res) => {
  // POST form
  const { email, password, password2, username, name, gender, birth, hobby } =
    req.body;
  const pageTitle = "Join";

  // password check
  if (password !== password2) {
    return res.status(400).render("users/join", {
      pageTitle,
      errorMsg: "패스워드를 다시 입력해주세요.",
    });
  }

  // email, username check
  const exists = await User.exists({ $or: [{ email }, { username }] });
  if (exists) {
    return res.status(400).render("users/join", {
      pageTitle,
      errorMsg: "이메일 혹은 아이디가 이미 존재합니다.",
    });
  }

  // create User
  try {
    await User.create({
      email,
      password,
      username,
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
  const { username, password } = req.body;

  // check username
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("users/login", {
      pageTitle: "Login",
      errorMsg: "존재하지 않는 계정입니다.",
    });
  }

  // check password
  const pwCheck = await bcrypt.compare(password, user.password);
  if (!pwCheck) {
    return res.status(400).render("users/login", {
      pageTitle: "Login",
      errorMsg: "존재하지 않는 계정입니다.",
    });
  }
  return res.end();
};

// In User Routers
const handleUserProfile = (req, res) => res.send("/users/:id!");
const handleLogout = (req, res) => res.send("/users/logout!");
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
};
