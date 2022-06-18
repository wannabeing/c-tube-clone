import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

// 서버가 heroku인지, 로컬호스트인지
const heroku = process.env.NODE_ENV === "production";

const localsMiddleware = (req, res, next) => {
  // Session INFO -> locals INFO
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.user = req.session.user || {};
  res.locals.heroku = heroku;
  res.locals.siteName = "C-Tube";
  res.locals.basicProfile =
    "https://ctubee.s3.ap-northeast-2.amazonaws.com/images/basic_profile.png";
  res.locals.blueBadge =
    "https://ctubee.s3.ap-northeast-2.amazonaws.com/images/blue_badge.png";
  res.locals.kakaoLogo =
    "https://ctubee.s3.ap-northeast-2.amazonaws.com/images/kakao_logo.png";
  next();
};
// Need Session INFO
const redirectLogin = (req, res, next) => {
  if (req.session.user) {
    return next();
  } else {
    req.flash("error", "로그인을 해주세요 🥲");
    return res.redirect("/login");
  }
};
// Not Needed Session INFO
const redirectHome = (req, res, next) => {
  if (!req.session.user) {
    return next();
  } else {
    req.flash("error", "접근할 수 없습니다 🥲");
    return res.redirect("/");
  }
};

// Amazon S3 Uploader Settings
const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});
const s3ImgUploader = multerS3({
  s3: s3,
  bucket: "ctubee/profileImgs",
  acl: "public-read",
  contentType: multerS3.AUTO_CONTENT_TYPE,
});
const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "ctubee/videos",
  acl: "public-read",
  contentType: multerS3.AUTO_CONTENT_TYPE,
});

// User Avatar Image Multer Middleware
const multerAvatars = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000,
  },
  storage: heroku ? s3ImgUploader : undefined,
});
// Video File Multer Middleware
const multerVideos = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 10000000,
  },
  storage: heroku ? s3VideoUploader : undefined,
});

export {
  localsMiddleware,
  redirectLogin,
  redirectHome,
  multerAvatars,
  multerVideos,
};
