const fetch = require('node-fetch');
const Url = require('url').URL;
const apiUrl = 'https://transactionsallin.herokuapp.com/'

class Transaction{
    constructor(UserName,Amount,Type,Description){
        this.UserName = UserName;
        this.Amount =Amount;
        this.Type = Type;
        this.Description = Description;
    }

   static async addNewTransaction(transaction){
        try{
            const route= `v1/new/transaction`
            console.log(route);
            let res = await fetch((new Url(apiUrl+route)),{method:'POST',body:JSON.stringify(transaction), headers: { 'Content-Type': 'application/json'}});
            let msg = (await res.json());


            console.log(msg);
        }
        catch(err) {
            console.log(err);
        }

    }
}

// exporting the module
module.exports = Transaction;
