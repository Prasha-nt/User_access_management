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

// require("dotenv").config(); // Keep this for local development

// const express = require("express");
// const cors = require("cors");
// const { AppDataSource } = require("./config/ormconfig");

// // Import your routes
// const authRoutes = require("./routes/auth.routes");
// const softwareRoutes = require("./routes/software.routes");
// const requestRoutes = require("./routes/request.routes");

// const app = express();

// // ✅ Allow both local and Vercel frontend
// const allowedOrigins = [
//   'http://localhost:5173',
//   'https://user-access-management-sand.vercel.app', // Vercel deployed frontend
// ];

// // ✅ Configure CORS
// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like Postman or curl)
//     if (!origin) return callback(null, true);

//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('❌ Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// }));

// // ✅ Middleware to parse incoming JSON
// app.use(express.json());

// // ✅ Initialize database connection using TypeORM
// AppDataSource.initialize()
//   .then(() => {
//     console.log("✅ Connected to PostgreSQL and initialized data source");

//     // ✅ Mount API routes
//     app.use("/api/auth", authRoutes);
//     app.use("/api/software", softwareRoutes);
//     app.use("/api/requests", requestRoutes);
//     app.use("/api/my-requests", requestRoutes); // Optional alias

//     // ✅ Start the server
//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running at http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ Error initializing Data Source:", err);
//     // Do NOT call process.exit here; let Render see the server attempt
//   });

// module.exports = { app, AppDataSource };









require("dotenv").config(); // Load environment variables

const express = require("express");
const cors = require("cors");
const { AppDataSource } = require("./config/ormconfig");

// Import routes
const authRoutes = require("./routes/auth.routes");
const softwareRoutes = require("./routes/software.routes");
const requestRoutes = require("./routes/request.routes");

const app = express();

// ✅ Allowed origins from env + localhost for dev
const allowedOrigins = [
  process.env.CLIENT_ORIGIN, // e.g., https://user-access-management-sand.vercel.app
  'http://localhost:5173',   // for local dev
];

// ✅ CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow tools like Postman or curl
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error(`❌ Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
}));

// ✅ Middleware to parse JSON
app.use(express.json());

// ✅ Initialize DB and start server
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Connected to PostgreSQL and initialized data source");

    // Mount routes
    app.use("/api/auth", authRoutes);
    app.use("/api/software", softwareRoutes);
    app.use("/api/requests", requestRoutes);
    app.use("/api/my-requests", requestRoutes); // alias for user requests

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`🌐 Allowed origins: ${allowedOrigins.join(', ')}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error initializing Data Source:", err);
    // Don't exit, let Render retry health check
  });

module.exports = { app, AppDataSource };

