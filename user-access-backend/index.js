// // index.js or app.js
// require("dotenv").config();
// const express = require("express");
// const { AppDataSource } = require("./config/ormconfig");
// const authRoutes = require("./routes/auth.routes");
// const softwareRoutes = require("./routes/software.routes");
// const requestRoutes = require("./routes/request.routes");
// const cors = require('cors');

// const app = express();

// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true
// }));
// app.use(express.json());

// AppDataSource.initialize()
//   .then(() => {
//     console.log("Data Source has been initialized!");

//     app.use("/api/auth", authRoutes);
//     app.use("/api/software", softwareRoutes);
//     app.use("/api/requests", requestRoutes);
//     app.use("/api/my-requests", requestRoutes);
    

//     app.listen(3000, () => {
//       console.log("Server running on http://localhost:3000");
//     });
//   })
//   .catch((err) => {
//     console.error("Error during Data Source initialization:", err);
//   });

// module.exports = { app, AppDataSource }; // export for use in controllers if needed

require("dotenv").config(); // Load .env variables

const express = require("express");
const cors = require("cors");
const { AppDataSource } = require("./config/ormconfig");

// Routes
const authRoutes = require("./routes/auth.routes");
const softwareRoutes = require("./routes/software.routes");
const requestRoutes = require("./routes/request.routes");

const app = express();

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Middleware to parse JSON requests
app.use(express.json());

// Initialize TypeORM Data Source
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Data Source initialized");

    // Mount API routes
    app.use("/api/auth", authRoutes);
    app.use("/api/software", softwareRoutes);
    app.use("/api/requests", requestRoutes);
    app.use("/api/my-requests", requestRoutes); // Optional alias

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error initializing Data Source:", err);
  });

module.exports = { app, AppDataSource };
