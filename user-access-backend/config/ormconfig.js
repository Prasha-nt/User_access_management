// config/ormconfig.js
const { DataSource } = require("typeorm");
const User = require("../entities/User");
const Software = require("../entities/Software");
const Request = require("../entities/Request");

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Software, Request],
  migrations: [],
  subscribers: [],
});

module.exports = { AppDataSource };
