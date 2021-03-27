const mongoose = require("mongoose");

module.exports = () => {
 
        const Bet = require("../model/Bet");
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