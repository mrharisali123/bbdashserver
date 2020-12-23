const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.chat = require("../models/chat.model.js")(sequelize, Sequelize);
db.chat_schedule = require("../models/chat.scheduler.model")(sequelize, Sequelize);
db.roomparticipant = require("../models/room.participentes.model")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});
// db.roomparticipant.belongsToMany(db.chat, {
//   through: "fk_chat_paticipents",
//   foreignKey: "ROOM_ID",
//   otherKey: "ROOM_ID_FK"
// });
// db.chat.belongsToMany(db.roomparticipant, {
//   through: "fk_chat_paticipents",
//   foreignKey: "ROOM_ID_FK",
//   otherKey: "ROOM_ID"
// });
db.ROLES = ["admin"];

module.exports = db;
