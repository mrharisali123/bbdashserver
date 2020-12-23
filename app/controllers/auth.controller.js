const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Chat = db.chat;
const Chat_schedule = db.chat_schedule;
const RoomParticipant = db.roomparticipant;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var EmailService = require('../utility/EmailService');
var MailMessage = require('../utility/MailMessage');
var EmailBuilder = require('../utility/EmailBuilder');


// Save User to Database
exports.signup = (req, res) => {
  const date = new Date().toISOString().
    replace(/T/, '').
    replace(/\..+/, '');

  const uid = ((req.body.username).slice(0, 3)) + date
  console.log(date);
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    first_name: req.body.first_name,
    middle_name: req.body.middle_name,
    phone_no: req.body.phone_no,
    last_name: req.body.last_name,
    gender: req.body.gender,
    city: req.body.city,
    state: req.body.state,
    yob: req.body.yob,
    time_zone: req.body.time_zone,
    church_name: req.body.church_name,
    paster_name: req.body.paster_name,
    church_city: req.body.church_city,
    church_state: req.body.church_state,
    id_is_Active: 1,
    restricted: 0,
    created_by: req.body.created_by,
    modify_by: req.body.modify_by,

    u_id: uid
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User registered successfully!" });
          var m = {
            email: user.email,
            password: user.password,
            first_name: user.first_name,
            last_name: user.last_name
          };

          var msg = EmailBuilder.getSignUpMessage(m);
          msg.to = req.body.email;

          var ser = new EmailService()
          ser.sendEmail(msg, function (err, result) {
            if (err) {
              console.log(err);
            }
          });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// user login api
exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (user.restricted == 0) {

        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }

        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );

        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        }
      }
      else {
        res.send("user not authorized to access")
      }
      //jwt token
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push(roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

//search user by username
exports.search = (req, res) => {
  if (req.body.username == "" || req.body.username == null) {
    res.send("no record");
  }
  else {
    User.findAll({
      where: {
        username: {
          [Op.like]: '%' + req.body.username + '%'
        }
      }
    })
      .then(user => {
        console.log(user);
        if (user.length == 0) {
          return res.send({ message: "User Not found." });
        }
        res.json({
          data: user.map(function (v) {
            return {
              user: v.username
            }
          })
        })
      });
  }
};
// update record using username
exports.update = (req, res) => {
  const username = req.body.username;
  User.update(req.body, {
    where: { username: username }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with id=${username}. Maybe User was not found or req.body is empty!`
        });
      }
    }).catch(err => {
      res.status(500).send({
        message: "Error updating username with id=" + username
      });
    });

}
//chat hittory create
exports.chat_history = (req, res) => {
  Chat.create({
    chat_id: req.body.chat_id,
    sender_id: req.body.sender_id,
    message: req.body.message,
    date_time: req.body.date_time,
    status: req.body.status,
    ROOM_ID: req.body.ROOM_ID_FK,
    SENDER_TYPE:req.body.SENDER_TYPE
  })
    .then(chat => {

      console.log(chat);
      res.send({
        result: 1,
        message: "User registered successfully!"
      });

    });

};

//room participent

exports.room_participant = (req, res) => {
  var roomfk;
  var userfk = req.body.USER_ID
  roomfk = req.body.ROOM_ID

  RoomParticipant.create({
    RnP_ID: req.body.RnP_ID,
    USER_ID: userfk,
    USER_NAME: req.body.USER_NAME,
    ROOM_ID: roomfk,
    PASTOR_ID: req.body.PASTOR_ID,
    CHAT_FLAG_STATUS: req.body.CHAT_FLAG_STATUS,
    CHAT_COMMENT: req.body.CHAT_COMMENT,
  }).then()
    Chat.create({
    ROOM_ID_FK: roomfk,
    sender_id: userfk,
    SENDER_TYPE:userfk
  }) .then()
   RoomParticipant.findOne({
    where: {
      ROOM_ID: req.body.ROOM_ID
    }
  })
  
    .then(roomparticipant => {
      console.log(roomparticipant);
      console.log(roomparticipant.ROOM_ID)
      res.send({ message: "User registered successfully!" });

    });
};

//get details
exports.getroomdetails = (req, res) => {

  RoomParticipant.findAll()
    .then(roomparticipant => {
      res.json(roomparticipant
      )
    });
}

// schedule appointmet
exports.chat_scheduler = (req, res) => {
  const date1 = new Date().toISOString().
    replace(/T/, '').
    replace(/\..+/, '').
    replace([6], [0]);
  Chat_schedule.create({
    schedule_date: date1,
    schedule_month: req.body.schedule_month,
    schedule_day: req.body.schedule_day,
    schedule_time: req.body.schedule_time,
    schedule_name: req.body.schedule_name,
    schedule_email: req.body.schedule_email
  })
    .then(chat_schedule => {
      console.log(chat_schedule);
      res.send({ message: "schudele appointment!" });

    })
}


// search appointment on based of date
exports.schedule_search = (req, res) => {
  if (req.body.schedule_date == "" || req.body.schedule_date == null) {
    res.send("no record");
  }
  else {
    Chat_schedule.findAll({
      where: {
        schedule_date: {
          [Op.like]: '%' + req.body.schedule_date + '%'
        }
      }
    })
      .then(chat_schedule => {
        console.log(chat_schedule);
        if (chat_schedule.length == 0) {
          return res.send({ message: "Record Not found." });
        }
        res.json(chat_schedule)
      })

  }
};


