require("dotenv").config({
    path: `${__dirname}/../../.env`,
  });
  
  const { DATABASE_URL } = process.env;
  
  const [, dialect, username, password, host, port, database] =
    /^(\w+):\/\/([^:]+):([^@]+)@([^:]+):?(\d+)?\/(.*)$/.exec(DATABASE_URL) || [];
  
  if (!dialect) {
    console.error("dialect is missing");
  }
  if (!username) {
    console.error("username is missing");
  }
  if (!password) {
    console.error("password is missing");
  }
  if (!host) {
    console.error("host is missing");
  }
  if (!database) {
    console.error("database is missing");
  }
  
  module.exports = {
    development: {
      username,
      password,
      database,
      host,
      dialect,
    },
  };
  