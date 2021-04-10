const mongoose = require("mongoose");
const Notification = require("../model/Notification");
class Notify {
    constructor(username,matchId,isWin,amountWon){
        this.UserName = username;
        this.MatchId = matchId;
        this.IsWin = isWin;
        this.AmountWon = amountWon;
    }
}
const addNewNotification = (data) => {
    return new Promise((resolve, reject) => {
        let newNotification = new Notification(data);

        newNotification.save((err) => {
            if (err) {
                reject(err);
            } else {
                resolve(`new notification for ${data.UserName}`);
            }
        });
    });
};

const getAllNotificationForUser = (username) => {
    return new Promise((resolve, reject) => {
        Notification.find({ UserName: username })
            .exec()
            .then((NotificationList) => resolve(NotificationList))
            .catch((err) => reject(err))
    })
}

const resolveNotification = (id, data) => {
    return new Promise((resolve, reject) => {
        Notification.updateOne({ _id: id }, {
            $set: data,
        })
            .exec()
            .then((Bet) => {


                resolve(`Notification read for ${data.UserName}`);
            })
            .catch((err) => {
                reject(err);
            });
    })
}
module.exports = {
    getAllNotificationForUser,
    addNewNotification,
    resolveNotification,
    Notify
};