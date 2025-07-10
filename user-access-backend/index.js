// require("dotenv").config(); // Load .env variables

// const express = require("express");
// const cors = require("cors");
// const { AppDataSource } = require("./config/ormconfig");

// // Routes
// const authRoutes = require("./routes/auth.routes");
// const softwareRoutes = require("./routes/software.routes");
// const requestRoutes = require("./routes/request.routes");

// const app = express();

// // Enable CORS
// app.use(cors({
//   origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
//   credentials: true
// }));

// // Middleware to parse JSON requests
// app.use(express.json());

// // Initialize TypeORM Data Source
// AppDataSource.initialize()
//   .then(() => {
//     console.log("✅ Data Source initialized");

//     // Mount API routes
//     app.use("/api/auth", authRoutes);
//     app.use("/api/software", softwareRoutes);
//     app.use("/api/requests", requestRoutes);
//     app.use("/api/my-requests", requestRoutes); // Optional alias

//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running at http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ Error initializing Data Source:", err);
//   });

// module.exports = { app, AppDataSource };




// require("dotenv").config(); // Load environment variables

// const express = require("express");
// const cors = require("cors");
// const { AppDataSource } = require("./config/ormconfig");

// // Routes
// const authRoutes = require("./routes/auth.routes");
// const softwareRoutes = require("./routes/software.routes");
// const requestRoutes = require("./routes/request.routes");

// const app = express();

// // Enable CORS
// app.use(cors({
//   origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
//   credentials: true
// }));

// // Middleware to parse JSON
// app.use(express.json());

// // Initialize database (Supabase PostgreSQL)
// AppDataSource.initialize()
//   .then(() => {
//     console.log("✅ Connected to Supabase PostgreSQL");

//     // API Routes
//     app.use("/api/auth", authRoutes);
//     app.use("/api/software", softwareRoutes);
//     app.use("/api/requests", requestRoutes);
//     app.use("/api/my-requests", requestRoutes); // optional alias

//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ Error connecting to Supabase:", err);
//   });

// module.exports = { app, AppDataSource };





// index.js

// This line loads environment variables from a .env file.
// It's typically used for local development. On Render, environment variables
// are automatically available via process.env, so you can comment this out
// or keep it for local development purposes.
// require("dotenv").config();

const express = require("express");
const cors = require("cors");
// Import AppDataSource from your TypeORM config file
const { AppDataSource } = require("./config/ormconfig");

// Import your API routes
const authRoutes = require("./routes/auth.routes");
const softwareRoutes = require("./routes/software.routes");
const requestRoutes = require("./routes/request.routes");

const app = express();

// Enable CORS middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', // Your frontend's URL
  credentials: true
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Initialize TypeORM Data Source (connecting to the database)
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Connected to railway PostgreSQL (via IPv4 preference). Data Source initialized.");

    // Mount your API routes after successful database connection
    app.use("/api/auth", authRoutes);
    app.use("/api/software", softwareRoutes);
    app.use("/api/requests", requestRoutes);
    app.use("/api/my-requests", requestRoutes); // Optional alias for requests

    // Get the port from environment variables (provided by Render) or default to 3000
    const PORT = process.env.PORT || 3000;
    
    // Start the Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`CORS enabled for origin: ${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error connecting to railway or initializing Data Source:", err);
    // IMPORTANT: Do NOT use process.exit(1) here in a web server.
    // If the database connection fails, log the error but allow the process to continue.
    // This helps Render's health checks to see the server trying to bind to a port,
    // even if the database isn't available yet. Your routes will need to handle
    // cases where the database connection might be temporarily down.
  });

// Export app and AppDataSource for testing or other modules if needed
module.exports = { app, AppDataSource };