const { DataSource } = require("typeorm");
require("dotenv").config();

const User = require("../entities/User");
const Software = require("../entities/Software");
const Request = require("../entities/Request");

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,

  synchronize: true,
  logging: false,

  entities: [User, Software, Request],
  migrations: [],
  subscribers: [],

  ssl: false,
});

module.exports = { AppDataSource };
