module.exports = {
  HOST: "bbshborad.c27swtyzqmgm.us-east-2.rds.amazonaws.com",
  USER: "root",
  PASSWORD: "root1234",
  DB: "bbashboard",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

