// Import dotenv Module
import "dotenv/config";

// Import MongoDB & DB Model
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";

// Import Express Server
import app from "./server";
// heroku PORT || 4000
const PORT = process.env.PORT || 4000;

// Init Server
app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${process.env.SERVER}${PORT}`);
});
