import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

// In Home Router ("/")
const handleHome = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("publisher");
  return res.render("videos/home", {
    pageTitle: "Home",
    videos,
  });
};
// In Home Router ("/search/*")
const handleSearch = async (req, res) => {
  const { search } = req.query;
  if (search) {
    const videos = await Video.find({
      $or: [
        { title: { $regex: new RegExp(search, "i") } },
        { description: { $regex: new RegExp(search, "i") } },
      ],
    }).populate("publisher");
    return res.render("videos/search", {
      pageTitle: "Search Video",
      videos,
      search,
    });
  }
  return redirect("/");
};

// In Video Rotuer ("/videos/:id")
const handleWatch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id)
    .populate("publisher")
    .populate("comments");
  // 비디오의 댓글모음 변수 arrs 생성
  let arrs = [];
  for (let i = 0; i < video.comments.length; i++) {
    arrs.push(await Comment.findById(video.comments[i]._id).populate("writer"));
  }
  // NOT Found Video(Model)
  if (!video) {
    return res.status(404).render("404", {
      pageTitle: "Video not Found.",
    });
  }
  return res.render("videos/watch", {
    pageTitle: video.title,
    video,
    arrs,
  });
};
const handleGetEdit = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.session.user;
  const video = await Video.findById(id);
  // NOT Found Edit Video
  if (!video) {
    return res.status(404).render("404", {
      pageTitle: "Video not Found.",
    });
  }
  // Edit Video Publisher ID !== Login User ID
  if (String(video.publisher) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  return res.render("videos/edit", {
    pageTitle: `Edit ${video.title}`,
    video,
  });
};
const handlePostEdit = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.session.user;
  const { title, description, hashtags, category } = req.body; // form으로부터 받아온 값
  // const video = await Video.exists({ _id: id });
  const video = await Video.findById(id);
  // NOT Found Edit Video
  if (!video) {
    return res.render("404", {
      pageTitle: "Video not Found.",
    });
  }
  // Edit Video Publisher ID !== Login User ID
  if (String(video.publisher) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  const updateVideo = await Video.findByIdAndUpdate(id, {
    title,
    description,
    category,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("info", "비디오를 수정했습니다! 😎");
  return res.redirect(`/videos/${id}`);
};
const handleGetUpload = (req, res) => {
  return res.render("videos/upload", {
    pageTitle: "Upload Video",
  });
};
const handlePostUpload = async (req, res) => {
  // POST Request Form Data
  const {
    session: {
      user: { _id },
    },
    body: { title, description, hashtags, category },
    files: { video, thumb },
  } = req;
  // 서버가 heroku인지, 로컬호스트인지
  const heroku = process.env.NODE_ENV === "production";
  // Create New Video
  try {
    const newVideo = await Video.create({
      path: heroku ? video[0].location : video[0].path,
      thumbPath: heroku ? thumb[0].location : thumb[0].path,
      title,
      description,
      category,
      hashtags: Video.formatHashtags(hashtags),
      publisher: _id,
    });
    // Add New Video ID -> User's Videos Array
    const user = await User.findById(_id);
    user.myVideos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    req.flash("error", "다시 시도해주세요! 😳");
    return res.status(400).render("videos/upload", {
      pageTitle: "Upload Video",
    });
  }
};
const handleCreateVideo = (req, res) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  return res.render("videos/create", {
    pageTitle: "Video Create",
  });
};
const handleDelVideo = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.session.user;

  const video = await Video.findById(id);
  const user = await User.findById(_id);
  // NOT Found Delete Video
  if (!video) {
    return res.status(404).render("404", {
      pageTitle: "Video is Not Found",
    });
  }
  // Delete Video Publisher ID !== Login User ID
  if (String(video.publisher) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  // Delete Video & Delete User's myVideos Array
  await Video.findByIdAndDelete(id);
  user.myVideos.splice(user.myVideos.indexOf(id), 1);
  user.save();
  return res.redirect("/");
};
const handleCreateViews = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views += 1;
  await video.save();
  return res.sendStatus(200);
};
const handleCreateComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
    session: { user },
  } = req;

  const video = await Video.findById(id);
  const dbUser = await User.findById(user._id);
  if (!video) {
    return res.sendStatus(404);
  }

  const commentModel = await Comment.create({
    text: comment,
    writer: user._id,
    video: id,
  });
  video.comments.push(commentModel._id);
  dbUser.comments.push(commentModel._id);
  dbUser.save();
  video.save();
  req.flash("info", "댓글을 작성하였습니다! 😎");
  return res.sendStatus(201);
};
const handleDelComment = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.session.user;

  const comment = await Comment.findById(id);
  const user = await User.findById(_id);
  const video = await Video.findById(comment.video);

  // NOT Found Delete Comment
  if (!comment) {
    return res.status(404).render("404", {
      pageTitle: "Comment is Not Found",
    });
  }
  // Delete Comment Writer ID !== Login User ID
  if (String(comment.writer) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  // Delete Video & Delete User's myVideos Array
  await Comment.findByIdAndDelete(id);
  user.comments.splice(user.comments.indexOf(id), 1);
  video.comments.splice(video.comments.indexOf(id), 1);
  user.save();
  video.save();
  req.flash("info", "댓글을 삭제하였습니다! 😎");
  return res.redirect(`/videos/${video._id}`);
};
const handleVideoLikes = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.likes += 1;
  await video.save();
  return res.sendStatus(200);
};
export {
  handleHome,
  handleSearch,
  handleWatch,
  handleGetEdit,
  handlePostEdit,
  handleDelVideo,
  handleGetUpload,
  handlePostUpload,
  handleCreateViews,
  handleCreateVideo,
  handleCreateComment,
  handleDelComment,
  handleVideoLikes,
};
