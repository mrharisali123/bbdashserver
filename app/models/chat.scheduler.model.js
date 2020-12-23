module.exports = (sequelize, Sequelize) => {
    const Chat_schedule = sequelize.define("chat_schedulers", {
        schedule_date: {
            type: Sequelize.STRING
        },
        schedule_month: {
            type: Sequelize.STRING
        },
        schedule_day: {
            type: Sequelize.STRING
        },
        schedule_time: {
            type: Sequelize.STRING
        },
        schedule_name: {
            type: Sequelize.STRING
        },
        schedule_email: {
            type: Sequelize.STRING
        },
        created_by: {
            type: Sequelize.STRING
        },
        modify_by: {
            type: Sequelize.STRING
        },
    });

    return Chat_schedule;
};
