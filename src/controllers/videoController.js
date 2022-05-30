import { redirect } from "express/lib/response";
import Video from "../models/Video";

// In Home Router
const handleHome = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" });
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
    });
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
  const video = await Video.findById(id);
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
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", {
      pageTitle: "Video not Found.",
    });
  }
  return res.render("videos/edit", {
    pageTitle: `Edit ${video.title}`,
    video,
  });
};
const handlePostEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags, category } = req.body; // form으로부터 받아온 값
  const video = await Video.exists({ _id: id }); // exits()는 filter를 argument로 받음
  if (!video) {
    return res.render("404", {
      pageTitle: "Video not Found.",
    });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    category,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

const handleGetUpload = (req, res) => {
  return res.render("videos/upload", {
    pageTitle: "Upload Video",
  });
};
const handlePostUpload = async (req, res) => {
  // POST Request Form Data
  const { title, description, hashtags, category } = req.body;

  // create Video
  try {
    await Video.create({
      title,
      description,
      category,
      hashtags: Video.formatHashtags(hashtags),
    });
  } catch (error) {
    console.log(error);
    return res.status(400).render("videos/upload", {
      pageTitle: "Upload Video",
      errorMsg: true,
    });
  }
  return res.redirect("/");
};

const handleDel = async (req, res) => {
  const { id } = req.params;
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export {
  handleHome,
  handleSearch,
  handleWatch,
  handleGetEdit,
  handlePostEdit,
  handleDel,
  handleGetUpload,
  handlePostUpload,
};
