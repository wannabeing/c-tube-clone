// In Home Routers
const handleJoin = (req, res) => res.send("/join!");
const handleLogin = (req, res) => res.send("/login!");

// In User Routers
const handleUserProfile = (req, res) => res.send("/users/:id!");
const handleLogout = (req, res) => res.send("/users/logout!");
const handleEdit = (req, res) => res.send("/user/edit!");
const handleDel = (req, res) => res.send("/user/del!");

export {
  handleLogin,
  handleJoin,
  handleUserProfile,
  handleLogout,
  handleDel,
  handleEdit,
};
