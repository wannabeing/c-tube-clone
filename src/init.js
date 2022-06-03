// Import dotenv Module
import "dotenv/config";

// Import MongoDB & DB Model
import "./db";
import "./models/Video";
import "./models/User";

// Import Express Server
import app from "./server";

// Init Server
app.listen(4000, () => {
  console.log(`✅ Server listening on port ${process.env.SERVER_PORT}`);
});
