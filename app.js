const express = require("express");
const axios = require("axios");
var _ = require("lodash");
const app = express();
const port = process.env.PORT; //3000;

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/abt", async function (req, res) {
  const bitkub = await getBitkub();
  const satang = await getSatangPro();

  //let bitkub_btc_price = parseFloat(295501.18);
  let ask_bitkub_btc_price = parseFloat(bitkub["THB_BTC"].lowestAsk);
  let ask_satang_btc_price = parseFloat(satang["BTC_THB"].ask.price);
  let bid_bitkub_btc_price = parseFloat(bitkub["THB_BTC"].highestBid);
  let bid_satang_btc_price = parseFloat(satang["BTC_THB"].bid.price);
  let money = 10000;
  let fee = 0.25;
  let total_fee = (money * fee) / 100;
  let total_money_ask = money - total_fee;
  let total_bitkub = total_money_ask / ask_bitkub_btc_price;
  let total_satang = total_money_ask / ask_satang_btc_price;

  let buy_bitkub_sell_satang = total_bitkub * bid_satang_btc_price - fee;
  let buy_satang_sell_bitkub = total_satang * bid_bitkub_btc_price - fee;

  // satang["BTC_THB"].ask.price;

  res.send({
    AskBitkub: ask_bitkub_btc_price,
    AskSatang: ask_satang_btc_price,
    BidBitkub: bid_bitkub_btc_price,
    BidSatang: bid_satang_btc_price,
    bitkubBtc: total_bitkub,
    satangBtc: total_satang,
    buy_bitkub_sell_satang: buy_bitkub_sell_satang,
    buy_satang_sell_bitkub: buy_satang_sell_bitkub,
    buy_bitkub_sell_satang_profit: buy_bitkub_sell_satang - money,
    buy_satang_sell_bitkub_profit: buy_satang_sell_bitkub - money,
  });
});

app.get("/v1/coins", async function (req, res) {
  const coins = await getCoinsTH();
  const bitkub = await getBitkub();
  const satang = await getSatangPro();

  //let bitkub_btc_price = parseFloat(295501.18);

  let ask_coins_btc_price = parseFloat(coins.ask);
  let ask_bitkub_btc_price = parseFloat(bitkub["THB_BTC"].lowestAsk);
  let ask_satang_btc_price = parseFloat(satang["BTC_THB"].ask.price);
  let bid_coins_btc_price = parseFloat(coins.bid);
  let bid_bitkub_btc_price = parseFloat(bitkub["THB_BTC"].highestBid);
  let bid_satang_btc_price = parseFloat(satang["BTC_THB"].bid.price);
  let money = 10000;
  let fee = 0.25;
  let total_fee = (money * fee) / 100;
  let total_money_ask = money - total_fee;
  let total_bitkub = total_money_ask / ask_bitkub_btc_price;
  let total_satang = total_money_ask / ask_satang_btc_price;
  let total_coins = money / ask_coins_btc_price;

  let buy_bitkub_sell_satang = total_bitkub * bid_satang_btc_price;
  let buy_satang_sell_bitkub = total_satang * bid_bitkub_btc_price;
  let buy_coins_sell_bitkub = total_coins * bid_bitkub_btc_price;
  let buy_coins_sell_satang = total_coins * bid_satang_btc_price;

  let buy_bitkub_sell_satang_net =
    buy_bitkub_sell_satang - (buy_bitkub_sell_satang * fee) / 100;
  let buy_satang_sell_bitkub_net =
    buy_satang_sell_bitkub - (buy_satang_sell_bitkub * fee) / 100;
  let buy_coins_sell_bitkub_net =
    buy_coins_sell_bitkub - (buy_coins_sell_bitkub * fee) / 100;
  let buy_coins_sell_satang_net =
    buy_coins_sell_satang - (buy_coins_sell_satang * fee) / 100;

  console.log(
    "buy_bitkub_sell_satang_net = (" +
      buy_bitkub_sell_satang +
      ") - fee(" +
      (buy_bitkub_sell_satang * fee) / 100 +
      ") = " +
      buy_bitkub_sell_satang_net
  );
  console.log(
    "buy_satang_sell_bitkub_net = (" +
      buy_satang_sell_bitkub +
      ") - fee(" +
      (buy_satang_sell_bitkub * fee) / 100 +
      ") = " +
      buy_satang_sell_bitkub_net
  );
  console.log(
    "buy_coins_sell_bitkub_net = (" +
      buy_coins_sell_bitkub +
      ") - fee(" +
      (buy_coins_sell_bitkub * fee) / 100 +
      ") = " +
      buy_coins_sell_bitkub_net
  );
  console.log(
    "buy_coins_sell_satang_net = (" +
      buy_coins_sell_satang +
      ") - fee(" +
      (buy_coins_sell_satang * fee) / 100 +
      ") = " +
      buy_coins_sell_satang_net
  );

  let buy_bitkub_sell_satang_profit =
    buy_bitkub_sell_satang_net - total_money_ask;
  let buy_satang_sell_bitkub_profit =
    buy_satang_sell_bitkub_net - total_money_ask;
  let buy_coins_sell_bitkub_profit =
    buy_coins_sell_bitkub_net - (money + (money * 1) / 100);
  let buy_coins_sell_satang_profit =
    buy_coins_sell_satang_net - (money + (money * 1) / 100);

  res.send({
    AskCoins: ask_coins_btc_price,
    AskBitkub: ask_bitkub_btc_price,
    AskSatang: ask_satang_btc_price,
    BidCoins: bid_coins_btc_price,
    BidBitkub: bid_bitkub_btc_price,
    BidSatang: bid_satang_btc_price,
    bitkub_total_btc: total_bitkub,
    satang_total_btc: total_satang,
    coins_total_btc: total_coins,
    buy_bitkub_sell_satang_net: buy_bitkub_sell_satang_net,
    buy_satang_sell_bitkub_net: buy_satang_sell_bitkub_net,
    buy_coins_sell_satang_net: buy_coins_sell_bitkub_net,
    buy_coins_sell_bitkub_net: buy_coins_sell_satang_net,

    buy_bitkub_sell_satang_profit: buy_bitkub_sell_satang_profit,
    buy_bitkub_sell_satang_profit_desc:
      "buy_bitkub_sell_satang_net(" +
      buy_bitkub_sell_satang_net +
      ")-money(" +
      (money + total_fee) +
      ")",

    buy_satang_sell_bitkub_profit: buy_satang_sell_bitkub_profit,
    buy_satang_sell_bitkub_profit_desc:
      "buy_satang_sell_bitkub_net(" +
      buy_satang_sell_bitkub_net +
      ")-money(" +
      (money + total_fee) +
      ")",

    buy_coins_sell_bitkub_profit: buy_coins_sell_bitkub_profit,
    buy_coins_sell_bitkub_profit_desc:
      "buy_coins_sell_bitkub_net(" +
      buy_coins_sell_bitkub_net +
      ")-money(" +
      (money + (money * 1) / 100) +
      ")",

    buy_coins_sell_satang_profit: buy_coins_sell_satang_profit,
    buy_coins_sell_satang_profit_desc:
      "buy_coins_sell_satang_net(" +
      buy_coins_sell_satang_net +
      ")-money(" +
      (money + (money * 1) / 100) +
      ")",
  });
  // res.send(
  //   _.find(data.markets, function (o) {
  //     return o.symbol == "BTC-THB";
  //   })
  // );
});

app.get("/v2/coins", async function (req, res) {
  const coins = await getCoinsTH();
  const bitkub = await getBitkub();
  const satang = await getSatangPro();

  //let bitkub_btc_price = parseFloat(295501.18);

  let ask_coins_btc_price = parseFloat(coins.ask);
  let ask_bitkub_btc_price = parseFloat(bitkub["THB_BTC"].lowestAsk);
  let ask_satang_btc_price = parseFloat(satang["BTC_THB"].ask.price);
  let bid_coins_btc_price = parseFloat(coins.bid);
  let bid_bitkub_btc_price = parseFloat(bitkub["THB_BTC"].highestBid);
  let bid_satang_btc_price = parseFloat(satang["BTC_THB"].bid.price);
  let money = 10000;
  let fee = 0.25;
  let total_fee = (money * fee) / 100;
  let total_money_ask = money - total_fee;
  let total_bitkub = total_money_ask / ask_bitkub_btc_price;
  let total_satang = total_money_ask / ask_satang_btc_price;
  let total_coins = money / ask_coins_btc_price;

  let buy_bitkub_sell_satang = total_bitkub * bid_satang_btc_price;
  let buy_satang_sell_bitkub = total_satang * bid_bitkub_btc_price;
  let buy_coins_sell_bitkub = total_coins * bid_bitkub_btc_price;
  let buy_coins_sell_satang = total_coins * bid_satang_btc_price;

  let buy_bitkub_sell_satang_net =
    buy_bitkub_sell_satang - (buy_bitkub_sell_satang * fee) / 100;
  let buy_satang_sell_bitkub_net =
    buy_satang_sell_bitkub - (buy_satang_sell_bitkub * fee) / 100;
  let buy_coins_sell_bitkub_net =
    buy_coins_sell_bitkub - (buy_coins_sell_bitkub * fee) / 100;
  let buy_coins_sell_satang_net =
    buy_coins_sell_satang - (buy_coins_sell_satang * fee) / 100;

  let buy_bitkub_sell_satang_profit = buy_bitkub_sell_satang_net - money;
  let buy_satang_sell_bitkub_profit = buy_satang_sell_bitkub_net - money;
  let buy_coins_sell_bitkub_profit =
    buy_coins_sell_bitkub_net - (money + (money * 1) / 100);
  let buy_coins_sell_satang_profit =
    buy_coins_sell_satang_net - (money + (money * 1) / 100);

  res.send({
    "ราคาขาย coins": ask_coins_btc_price,
    "ราคาขาย bitkub": ask_bitkub_btc_price,
    "ราคาขาย satang": ask_satang_btc_price,
    "ราคารับซื้อ coins": bid_coins_btc_price,
    "ราคารับซื้อ bitkub": bid_bitkub_btc_price,
    "ราคารับซื้อ satang": bid_satang_btc_price,
    "ซื้อที่ bitkub ได้รับ": {
      total_coins: total_bitkub,
      fee: total_fee,
      total_cost: money,
      buy_cost: money - total_fee,
    },
    "ซื้อที่ satang ได้รับ": {
      total_coins: total_satang,
      fee: total_fee,
      total_cost: money,
      buy_cost: money - total_fee,
    },
    "ซื้อที่ coins ได้รับ": {
      total_coins: total_coins,
      fee: (money * 1) / 100,
      total_cost: money + (money * 1) / 100,
      buy_cost: money,
    },
    buy_bitkub_sell_satang_net: buy_bitkub_sell_satang_net,
    buy_satang_sell_bitkub_net: buy_satang_sell_bitkub_net,
    buy_coins_sell_satang_net: buy_coins_sell_bitkub_net,
    buy_coins_sell_bitkub_net: buy_coins_sell_satang_net,
    buy_bitkub_sell_satang_profit: buy_bitkub_sell_satang_profit,
    buy_satang_sell_bitkub_profit: buy_satang_sell_bitkub_profit,
    buy_coins_sell_bitkub_profit: buy_coins_sell_bitkub_profit,
    buy_coins_sell_satang_profit: buy_coins_sell_satang_profit,
  });
  // res.send(
  //   _.find(data.markets, function (o) {
  //     return o.symbol == "BTC-THB";
  //   })
  // );
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

function getBitkub() {
  return new Promise((resolve, reject) => {
    axios
      .get("https://api.bitkub.com/api/market/ticker")
      .then(function (response) {
        //console.log(response.data);
        resolve(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  });
}

function getSatangPro() {
  return new Promise((resolve, reject) => {
    axios
      .get("https://api.tdax.com/api/orderbook-tickers/")
      .then(function (response) {
        //console.log(response.data);
        resolve(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  });
}

function getCoinsTH() {
  return new Promise((resolve, reject) => {
    axios
      .get("https://quote.coins.ph/v1/markets?region=th")
      .then(function (response) {
        //console.log(response.data);

        resolve(
          _.find(response.data.markets, function (o) {
            return o.symbol == "BTC-THB";
          })
        );
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  });
}
