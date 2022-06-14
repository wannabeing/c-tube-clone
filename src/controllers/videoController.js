import Video from "../models/Video";
import User from "../models/User";

// In Home Router
const handleHome = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("publisher");
  return res.render("videos/home", {
    pageTitle: "C-Tube",
    videos,
  });
};
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

// In Video Rotuer
const handleWatch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("publisher");
  // NOT Found Video(Model)
  if (!video) {
    return res.status(404).render("404", {
      pageTitle: "Video not Found.",
    });
  }
  return res.render("videos/watch", {
    pageTitle: video.title,
    video,
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
  console.log("Update Video!");
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

  // Create New Video
  try {
    const newVideo = await Video.create({
      path: video[0].path,
      thumbPath: thumb[0].path,
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
const handleCreate = (req, res) => {
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
  handleCreate,
};
