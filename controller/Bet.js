const mongoose = require("mongoose");

module.exports = () => {
 
        const Bet = require("../model/Bet");
        const Transaction = require("../controller/Transaction");
        const Notification = require("../controller/Notification");
        return {
            addNewBet : (data) => {
                return new Promise((resolve, reject) => {
                    let newBet = new Bet(data);
            
                    newBet.save((err) => {
                      if (err) {
                        reject(err);
                      } else {
                        resolve(`Bet Placed for ${data.UserName} on ${data.MatchId}`);
                      }
                    });
                  });

            },
            resolveBet : (data,id) => {
                return new Promise((resolve, reject) => {
                  console.log(data);
                  if(data.IsWin && data.AmountWon && data.IsInProgress)
                  {
                    let transaction = new Transaction(data.UserName,data.AmountWon,"CREDIT",`Bet ${id} Won ${data.AmountWon}`);
                    Transaction.addNewTransaction(transaction);
                    let notification = new Notification.Notify(data.UserName,data.MatchId,data.IsWin,data.AmountWon);
                    Notification.addNewNotification(notification);
                  }else if(data.IsInProgress && !data.IsWin)
                  {
                    let notification = new Notification.Notify(data.UserName,data.MatchId,data.IsWin,0);
                    Notification.addNewNotification(notification);
                  }
                  data.IsInProgress = false;
                    Bet.updateOne({ _id: id },  {
                        $set: data,
                      })
                      .exec()
                      .then((Bet) => {
                      
                        
                        resolve(`Bet updated for ${data.UserName}`);
                      })
                      .catch((err) => {
                        reject(err);
                      });
                  });
            },
            getAllBetByMatchId : (matchId) => new Promise((resolve, reject) => Bet.find({MatchId: matchId})
                .exec()
                .then((BetList) => resolve(BetList))
                .catch((err) => reject(err))
            ),
            getAllUserBets : (username) =>  new Promise((resolve, reject) => Bet.find({UserName: username})
                .exec()
                .then((BetList) => resolve(BetList))
                .catch((err) => reject(err))
            ),
            getAllUserBetsInProgress : (username, inProgress) => new Promise((resolve, reject) => { 
                console.log(username + "" +inProgress); 
                 Bet.find({UserName: username, IsInProgress : inProgress})
                .exec()
                .then((BetList) => resolve(BetList))
                .catch((err) => reject(err))}

            ),
        
            
         }
};