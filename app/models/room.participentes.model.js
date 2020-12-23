module.exports = (sequelize, Sequelize) => {
    const RoomParticipant = sequelize.define("room_participants", {
        RnP_ID: {
            type: Sequelize.STRING
        },
        USER_ID: {
            type: Sequelize.STRING
        },
        USER_NAME:{
            type: Sequelize.STRING
        },
        ROOM_ID: {
            allowNull: false,
            unique: true,
            type: Sequelize.STRING
        },
        PASTOR_ID: {
            allowNull: false,
            type: Sequelize.STRING
        },
        CHAT_FLAG_STATUS: {
            allowNull: false,
            type: Sequelize.STRING
        },
        CHAT_COMMENT:{
            allowNull: false,
            type: Sequelize.STRING
        },
        CREATED_BY: {
            type: Sequelize.STRING
        },
        MODIFY_BY: {
            type: Sequelize.STRING
        },
    });

    return RoomParticipant;
};
