// // config/ormconfig.js
// const { DataSource } = require("typeorm");
// const User = require("../entities/User");
// const Software = require("../entities/Software");
// const Request = require("../entities/Request");

// const AppDataSource = new DataSource({
//   type: "postgres",
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT, 10),
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   synchronize: true,
//   logging: false,
//   entities: [User, Software, Request],
//   migrations: [],
//   subscribers: [],
// });

// module.exports = { AppDataSource };



// // config/ormconfig.js
// const { DataSource } = require("typeorm");
// const User = require("../entities/User");
// const Software = require("../entities/Software");
// const Request = require("../entities/Request");

// const AppDataSource = new DataSource({
//   type: "postgres",
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT, 10),
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   synchronize: true,
//   logging: false,
//   entities: [User, Software, Request],
//   migrations: [],
//   subscribers: [],
// });

// module.exports = { AppDataSource };


// const { DataSource } = require("typeorm");
// require("dotenv").config(); // Load env variables

// const User = require("../entities/User");
// const Software = require("../entities/Software");
// const Request = require("../entities/Request");

// const AppDataSource = new DataSource({
//   type: "postgres",
//   url: process.env.DATABASE_URL, // 👈 Using full Supabase URL
//   synchronize: true,              // Keep true for development only
//   logging: false,
//   entities: [User, Software, Request],
//   migrations: [],
//   subscribers: [],
// });

// module.exports = { AppDataSource };



// config/ormconfig.js

const { DataSource } = require("typeorm");
require("dotenv").config(); // Load env variables (Good for local dev, Render handles its own)

// Import your entities
const User = require("../entities/User");
const Software = require("../entities/Software");
const Request = require("../entities/Request");

const AppDataSource = new DataSource({
  type: "postgres", // Specifies PostgreSQL database
  url: process.env.DATABASE_URL, // Uses the DATABASE_URL environment variable
  
  // synchronize: true is fine for development, but for production,
  // it should typically be 'false' and you should use migrations.
  synchronize: true, 
  
  logging: false, // Set to true if you want to see SQL queries in logs (useful for debugging)
  
  entities: [User, Software, Request], // Correctly importing your entity classes
  migrations: [], // Keep this empty if you're not using TypeORM migrations yet, otherwise list your migration paths
  subscribers: [],
  
  // --- START OF CRUCIAL ADDITIONS FOR SUPABASE & RENDER ---
  // 1. SSL configuration: Essential for connecting to Supabase
  ssl: {
    // This tells the client to accept self-signed certificates from the server.
    // Supabase connections are typically SSL-encrypted.
    // For strict production environments, you might provide a CA certificate and set this to `true`.
    rejectUnauthorized: false 
  },
  
  // 2. 'extra' options: Passed directly to the underlying 'pg' (node-postgres) driver
  extra: {
    // This is the direct fix for the ENETUNREACH IPv6 error.
    // It forces the connection to use IPv4 for DNS resolution and the network connection itself.
    family: 4, 
  },
  // --- END OF CRUCIAL ADDITIONS ---
});

module.exports = { AppDataSource };