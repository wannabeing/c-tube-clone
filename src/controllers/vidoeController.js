const fakeUser = {
  username: "hyuk",
  isLogin: true,
};

// In Home Router
const handleHome = (req, res) => {
  const fakeVideos = [
    {
      id: 1,
      title: "first Video",
      rating: 4,
      comments: 2,
      createdAt: "2 minutes ago",
      views: 59,
    },
    {
      id: 1,
      title: "second Video",
      rating: 4,
      comments: 2,
      createdAt: "2 minutes ago",
      views: 59,
    },
    {
      id: 1,
      title: "third  Video",
      rating: 4,
      comments: 2,
      createdAt: "2 minutes ago",
      views: 59,
    },
  ];
  return res.render("videos/home", {
    pageTitle: "Home",
    fakeUser,
    fakeVideos,
  });
};
const handleSearch = (req, res) => {
  res.send("search");
};

// In Video Rotuer
const handleWatch = (req, res) => {
  console.log(req.params);
  res.render("videos/watch");
};
const handleEdit = (req, res) => res.render("videos/edit");
const handleDel = (req, res) => res.send(`/videos/${req.params}/del!`);
const handleUpload = (req, res) => res.send("/videos/upload");

export {
  handleHome,
  handleSearch,
  handleWatch,
  handleEdit,
  handleDel,
  handleUpload,
};
