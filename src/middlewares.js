import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const localsMiddleware = (req, res, next) => {
  // Session INFO -> locals INFO
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.user = req.session.user || {};

  res.locals.siteName = "C-Tube";
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

// Amazon S3 Settings
const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});
const multerUploader = multerS3({
  s3: s3,
  bucket: "ctubee",
  acl: "public-read",
});

// User Avatar Image Multer Middleware
const multerAvatars = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000,
  },
  storage: multerUploader,
});
// Video File Multer Middleware
const multerVideos = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 10000000,
  },
  storage: multerUploader,
});

export {
  localsMiddleware,
  redirectLogin,
  redirectHome,
  multerAvatars,
  multerVideos,
};
