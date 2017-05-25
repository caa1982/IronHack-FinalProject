const Coin = require("../model/coin");
const request = require('request');

module.exports =
    function () {
        setInterval(() => {
            request.get({
                url: "https://api.coinmarketcap.com/v1/ticker/",
                json: true,
                headers: { 'User-Agent': 'request' }
            }, (err, data) => {
                if (err) {
                    console.log('Error:', err);
                } else {
                    data.body.forEach(el => {

                        Coin.update(
                            { id: el.id },
                            el,
                            { upsert: true },
                            err => {
                                if (err) console.log(err); 
                            }
                        );

                    });
                }
            });

        }, 20000);

    }