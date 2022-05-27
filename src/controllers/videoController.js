let fakeVideos = [
  {
    id: 1,
    title: "first Video",
    rating: 4,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 1,
  },
  {
    id: 2,
    title: "second Video",
    rating: 4,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
  },
  {
    id: 3,
    title: "third Video",
    rating: 4,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
  },
];

// In Home Router
const handleHome = (req, res) => {
  return res.render("videos/home", {
    pageTitle: "Home",
    fakeVideos,
  });
};
const handleSearch = (req, res) => {
  res.send("search");
};

// In Video Rotuer
const handleWatch = (req, res) => {
  const { id } = req.params; // const id = req.params.id와 같음
  const video = fakeVideos[id - 1];
  return res.render("videos/watch", {
    pageTitle: `Watching: ${video.title}`,
    video,
  });
};
const handleGetEdit = (req, res) => {
  const { id } = req.params; // const id = req.params.id와 같음
  const video = fakeVideos[id - 1];
  return res.render("videos/edit", {
    pageTitle: `Editing: ${video.title}`,
    video,
  });
};
const handlePostEdit = (req, res) => {
  const { id } = req.params; // const id = req.params.id와 같음
  const { title } = req.body; // form으로부터 받아온 값
  fakeVideos[id - 1].title = title;
  return res.redirect(`/videos/${id}`);
};

const handleGetUpload = (req, res) => {
  return res.render("videos/upload", {
    pageTitle: "Upload Video",
  });
};
const handlePostUpload = (req, res) => {
  const newVideo = {
    id: 4,
    title: req.body.title,
    rating: 3,
    comments: 1,
    createdAt: "5 minutes ago",
    views: 12,
  };
  fakeVideos.push(newVideo);
  return res.redirect(`/videos/${newVideo.id}`);
};

const handleDel = (req, res) => res.send(`/videos/${req.params}/del!`);

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
