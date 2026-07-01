const { DataSource } = require("typeorm");
require("dotenv").config();

const User = require("../entities/User");
const Software = require("../entities/Software");
const Request = require("../entities/Request");

const isLocal = process.env.DATABASE_URL &&
  (process.env.DATABASE_URL.includes("localhost") || process.env.DATABASE_URL.includes("127.0.0.1"));

const sslConfig = isLocal ? false : { rejectUnauthorized: false };

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,

  synchronize: true,
  logging: false,

  entities: [User, Software, Request],
  migrations: [],
  subscribers: [],

  ssl: sslConfig,
  extra: { ssl: sslConfig },
});

module.exports = { AppDataSource };
