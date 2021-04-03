require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors")
const mongoose = require("mongoose")
const jwt = require('jsonwebtoken');
const BetController = require("./controller/Bet")();
const bodyParser = require("body-parser");
const boolParser = require("express-query-boolean");

var jwtOptions = {};

jwtOptions.secretOrKey = '&0y7$noP#5rt99&GB%Pz7j2b1vkzaB0RKs%^N^0zOP89NT04mPuaM!&G8cbNZOtH';

app.use(bodyParser.json());
app.use(boolParser());
app.use(cors());


app.post("/v1/bet", (req, res) => BetController.addNewBet(req.body).then((msg) => {
    res.json({ message: msg });
  })
    .catch((err) => {
      res.json({ message: `an error occurred: ${err}` });
    })
  );
  
  app.put("/v1/bet/resolve/:id", (req, res) => BetController.resolveBet(req.body,req.params.id).then((msg) => {
    res.json({ message: msg });
  })
    .catch((err) => {
      res.json({ message: `an error occurred: ${err}` });
    })
  );
  
  app.get("/v1/match/bets/:id", (req, res) => {
    BetController.getAllBetByMatchId(req.params.id).then((data) => {
      res.json(data);
    })
      .catch((err) => {
        res.json({ message: `an error occurred: ${err}` });
      })
  })
  
  app.get("/v1/user/bets/:username", (req, res) => {
      console.log(req.query.inProgress);
  
    if (req.query.inProgress == true) {
      BetController.getAllUserBetsInProgress(req.params.username,req.query.inProgress).then((data) => {
        res.json(data);
      })
        .catch((err) => {
          res.json({ message: `an error occurred: ${err}` });
        })
    }
    else if (req.query.inProgress == false) {
      BetController.getAllUserBetsInProgress(req.params.username, req.query.inProgress).then((data) => {
        res.json(data);
      })
        .catch((err) => {
          res.json({ message: `an error occurred: ${err}` });
        })
    }
    else {
      BetController.getAllUserBets(req.params.username).then((data) => {
        res.json(data);
      })
        .catch((err) => {
          res.json({ message: `an error occurred: ${err}` });
        })
    }
  
  });
  
  // Connection to db and defines User model
  const connect = (mongoDBConnectionString) => {
    return new Promise(function (resolve, reject) {
      let db = mongoose.createConnection(mongoDBConnectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      db.on("error", (err) => {
        reject(err);
      });

      db.once("open", () => {
        resolve();
      });
    });
  }

  connect(process.env.URI)
    .then(() => {
      app.listen(port, () => {
        console.log("API listening on: " + port);
      });
    })
    .catch((err) => {
      console.log("unable to start the server: " + err);
      process.exit();
    });