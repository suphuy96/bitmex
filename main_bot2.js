let bitmex = require("./bitmex.js").BitMEX;
const config = require('./config');
const orderlog = require('./orderlog').OrderLog;
const db = require('./Db.js').Db;
var ARsave = [];
var ARPoint = [];
var ARTG = [];
var ARTEMPPRICE = [];
var AROrDer = [];
var bietTG = 0;
var Botfb = null;
var STARTTOLL = true;
var PriceNow = 0;
var ArOrderSK = [];
var countorder = 0;
var TimeDelay = 2500;
var StartBalance = 0;
var startOrder = 0;
var CurrentBalance = 0;
var TimeCutLoss = 600000;
var TimeStart = new Date().getTime();
var ProfitDay = 0;
var TimeStartBot = new Date().getTime();
var CutLoss = 50;
var NexxtPullloss = 0;
var PriceCutProfit = 0;
var minBet = 7;
var VL = false;
// khoảng tăng giảm vào lệnh
var Deviation = 2;
// số lần chơi
var LimitLoss = 5;
// khoảng tụt bơm thêm
var UpDows = 0;
var PullLoss = 5;
var TruePull = true;
// khoảng cắt lời
// marin
var Marginbet = 25;
var CutProfit = 10;
var CutProfitTemp = CutProfit;
var MoreCutProfit = 1;
var waitOrder = false;
// thời gian đợi
var TimeWait = 15000;
var Profitorder = 0;
//
var ActiveTrade = false;
var TimeAA = new Date().getTime();
var Line = 5;
var CutProfit2 = 5;

var LastPrice = 0;
var PullValue = 0;
var BTC1d = {High: 0, Low: 0};
var BTC7d = {High: 0, Low: 0};
var BTC14d = {High: 0, Low: 0};
var High6Hous = 0;
var Low6Hous = 0;
var ThongSo = {
    minbet: minBet,
    CutProfit: CutProfit,
    Deviation: Deviation,
    TimeStart: new Date().getTime(),
    Marginbet: Marginbet,
    LimitLoss: LimitLoss,
    PullLoss: PullLoss,
    CutLoss: CutLoss
};
var StartQ = minBet;
setTimeout(function () {
    asdfkj = sdfsadf + dfasdf;
    // pm2.start()
    var pm2 = require("pm2");
    console.log("restart")
    let connectAndExec = (onSuccess, onError) => {
        pm2.connect(function (err) {
            if (err) {
                console.error(err);
                process.exit(2);
                onError();
            }

            onSuccess();
        });
    };
    pm2.restart(38, (err, data) => {
        if (err) {
            console.error(err);
            process.exit(2);
        }
    });
}, 3100000);
var CurrentOrder = {
    orderID: "",
    symbol: "XBTUSD",
    side: "Buy",
    currentQty: minBet,
    isOpen: true,
    posState: "",
    leverage: Marginbet,
    openingQty: 10,
    avgEntryPrice: 0,
    liquidationPrice: 0,
    CountBet: 0,
    TimeOpen: "",
    High: 0,
    Low: 0,
    TimeOrDer: new Date().getTime(),
    Profit: 0,

    TimeClose: new Date().getTime(),
    Guess: {text: "Tăng giảm", L: 5, High: 5, Low: 5, Side: "Buy"}
};
var AROrDer = [];
var ArPull = [];
var ArFB = [];
var ArFBRT = [];
db.getARFB().then((data) => {
    if (data != null) {
        ArFB = JSON.parse(data);
    }
});
db.getARFBRT().then((data) => {
    if (data != null) {
        ArFBRT = JSON.parse(data);
    }
});
db.getTHONGSO().then((data) => {
    if (data != null) {
        let thu = JSON.parse(data);
        if (!isNaN(thu.minbet)) {
            minBet = thu.minbet;
            ThongSo.minbet = thu.minbet;
            StartQ = minBet;
            console.log("thông sỗ minbet cũ" + thu.minbet)
        }
        if (!isNaN(thu.Deviation)) {

            ThongSo.Deviation = thu.Deviation;
            Deviation = ThongSo.Deviation
        }
        if (!isNaN(thu.CutProfit)) {
            ThongSo.CutProfit = thu.CutProfit;
            CutProfit = ThongSo.CutProfit;
            CutProfitTemp = CutProfit;
        }
        if (!isNaN(thu.TimeStart)) {
            ThongSo.TimeStart = thu.TimeStart;
            TimeStart = ThongSo.TimeStart;
        }
        if (!isNaN(thu.Marginbet)) {
            ThongSo.Marginbet = thu.Marginbet;
            Marginbet = ThongSo.Marginbet;
        }
        if (!isNaN(thu.LimitLoss)) {
            ThongSo.LimitLoss = thu.LimitLoss;
            LimitLoss = ThongSo.LimitLoss;
        }
        if (!isNaN(thu.PullLoss)) {
            ThongSo.PullLoss = thu.PullLoss;
            PullLoss = ThongSo.PullLoss;
        }
        if (!isNaN(thu.CutLoss)) {
            ThongSo.CutLoss = thu.CutLoss;
            CutLoss = ThongSo.CutLoss;
        }
    }
});
db.getOrDer().then((data) => {
    // console.log(data);
    if (data != null) {
        CurrentOrder = JSON.parse(data);
        if (isNaN(CurrentOrder.currentQty) || CurrentOrder.currentQty == null) {
            CurrentOrder.currentQty = 10;
        }
        // CurrentOrder.CountBet=0;

        console.log(CurrentOrder);
    }


});
db.getARPrice().then((data) => {
    // console.log(data);

    if (data != null) {
        let tt = JSON.parse(data);
        for (let i = 0; i < tt.length; i++) {
            // ARPoint.push(tt[i]);
        }
    }


});

var FunSendFB = function (type, content) {
    if (Botfb != null) {
        console.log("thuthoi")
        if (type == "INFO") {
            console.log(ArFB);
            if (ArFB.length > 0)
                for (let i = 0; i < ArFB.length; i++) {
                    console.log("_______sentddd" + ArFB[i])
                    Botfb.sendMessage(content, ArFB[i]);
                }
        } else {
            console.log(ArFBRT)

            if (ArFBRT.length > 0)
                for (let i = 0; i < ArFBRT.length; i++) {
                    console.log("_______sentddd" + ArFB[i])

                    Botfb.sendMessage(content, ArFBRT[i]);
                }
        }
    }
};
var Alarm = new Date();
if (Alarm.getHours() < 8) {
    let tam = Alarm;
    tam.setHours(7);
    tam.setMinutes(59);
    let timene = tam.getTime();
    setTimeout(function () {
        let ct =
            "💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰" +
            "\n💰💰💰 INFO Profit today 💰💰💰" +
            "\n💰💰💰 BalanceDay : " + CurrentBalance +
            "\n💰💰💰 ProfitDay_ : " + ProfitDay +
            "💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰";
        FunSendFB("INFO", ct)
    }, timene);
}
setTimeout(function () {
    FunSendFB("RT", "_____bot đã khởi động lại______")
}, 8000);
var FunDElete = function () {
    setTimeout(function () {
        if (ARTG.length > 30000)
            ARTG = [];
        if (ARPoint.length > 30000)
            ARPoint = [];
        if (ARTEMPPRICE.length > 30000)
            ARTEMPPRICE = [];
        if (AROrDer.length > 3000) {
            AROrDer = [];
        }
        FunDElete();
    }, 1111111);

};
FunDElete();
var FunWait = function () {
    setTimeout(function () {
        ActiveTrade = true;
    }, TimeWait);

};
var FunWaitDE = function () {

    setTimeout(function () {
        ActiveTrade = true;
        waitOrder = false;
    }, 2200);
};
var FunCHUY = function () {
    var countne = 1;
    var cc = StartQ;
    var C = CurrentOrder.currentQty;
    if (C < -1) {
        C = C * -1;
    }
    while (cc < C) {
        cc += cc;
        countne++;
    }
    if (countne == CurrentOrder.CountBet) {
        ///
        let t=0;
    } else {
        CurrentOrder.CountBet = countne;
    }
}
FunWait();
var FunOrder = function () {
    console.log("________order_________");
    ActiveTrade = false;
    // waitOrder
    if (ArOrderSK.length > 0) {

        bitmex.deleteAllOrder().then((data) => {
            console.log("Phai xoa cai cu");
            // if (CurrentOrder.CountBet > 0)
            //     CurrentOrder.CountBet--;
            FunCHUY();
            FunORMORE();
        });
    } else {
        FunORMORE();
    }

    // bitmex.deleteAllOrder().then((data) => {   });


};
var FunORMORE = function () {
    if (!waitOrder) {
        waitOrder = true;
        let MorePrice = 0.5;
        if (CurrentOrder.side == "Sell") {
            MorePrice = -0.5;
        }
        if (isNaN(CurrentOrder.currentQty) || CurrentOrder.currentQty == null) {
            CurrentOrder.currentQty = 10;
        }
        // cho gửi khi đã vào
        // ActiveTrade = true;

        let pricepull = PriceNow + MorePrice;
        CurrentOrder.avgEntryPrice = pricepull;
        console.log(")))))))))))))))))))))" + CurrentOrder.currentQty);
        let startPriceOrder = CurrentOrder.currentQty;
        if (startPriceOrder < 0) {
            startPriceOrder = startPriceOrder * -1;
        }

        if (!CurrentOrder.isOpen) {
            var DeDanh = 0.1;
            var VONGOC = CurrentBalance / 100000000 * PriceNow;
            var PHIMARGIN = 0.0001 * (VONGOC * Marginbet - VONGOC) * 3;
            var PHIGIAODICH = VONGOC * Marginbet * 0.0000002 * PriceNow;
            var TienKhaDung = (VONGOC * (0.9)) - PHIMARGIN - PHIGIAODICH;
            var tempnene = TienKhaDung * Marginbet;
            for (let i = 0; i < LimitLoss; i++) {
                tempnene *= 0.5;
            }
            startPriceOrder = parseInt(tempnene);
            // console.log(VONGOC)
            // console.log(VONGOC)
            // console.log(PHIMARGIN)
            // console.log(PHIGIAODICH)
            // console.log(TienKhaDung)
            // console.log(tempnene)

        }
        if(startPriceOrder<=0){
            startPriceOrder = CurrentOrder.currentQty;
            if (startPriceOrder < 0) {
                startPriceOrder = startPriceOrder * -1;
            }
        }
        console.log(startPriceOrder);

        ArPull.push(pricepull);
        Profitorder = ProfitDay;
        bitmex.marketOrder(CurrentOrder.side, startPriceOrder, pricepull).then((data) => {
            FunWaitDE();
            CurrentOrder.CountBet++;
            if (!isNaN(CurrentOrder.orderID))
                CurrentOrder.orderID = data.orderID;
            CurrentOrder.currentQty = data.cumQty;
            CurrentOrder.avgEntryPrice = data.avgPx;
            CurrentOrder.TimeOpen = data.timestamp;
            console.log("nênf");
            console.log(CurrentOrder);
            db.setOrDer(JSON.stringify(CurrentOrder)).then((data) => {
                let h = 0;
            });
            if (CurrentOrder.CountBet == 1) {

                let ct = "💲Price now:" + PriceNow + "💲" +
                    "\n____________________" +
                    "\n👉🏼 Quantity_ : " + CurrentOrder.currentQty +
                    "\n👉🏼 LiqPrice_ : " + CurrentOrder.liquidationPrice +
                    "\n👉🏼 Side_____ : " + CurrentOrder.side +
                    "\n👉🏼 Count bet : " + CurrentOrder.CountBet;

                "\n👉🏼 Time_____ : " + CurrentOrder.TimeOpen;
                FunSendFB("RT", "ℹ️Đã vào lệnh__\n" + ct);
                console.log("____Đã vào lệnh ____________qtt: " + pricepull);

            }
            else {
                let ct = "💲Price now:" + PriceNow + "💲" +
                    "\n____________________" +
                    "\n👉🏼 Quantity_ : " + CurrentOrder.currentQty +
                    "\n👉🏼 LiqPrice_ : " + CurrentOrder.liquidationPrice +
                    "\n👉🏼 Side_____ : " + CurrentOrder.side +
                    "\n👉🏼 Count bet : " + CurrentOrder.CountBet;

                FunSendFB("RT", "ℹ️Đã Bơm thêm__\n" + ct);
                console.log("____Đã Bơm Thêm ____________qtt: " + pricepull);
            }
        });
    } else {
        console.log("chưa được bơm000000000000000000000000000000000000000000000000")
    }
};
// setTimeout(function(){
//     FunOrder();
//
// },2000);
var FunClosePonsiton = function () {
    ActiveTrade = false;
    FunWaitDE();


    bitmex.closePosition(CurrentOrder.orderID).then((data) => {
        if (ArOrderSK.length > 0)
            bitmex.deleteAllOrder().then((data) => {
            });
        let tempttt = CurrentOrder.side;
        CurrentOrder = {
            orderID: "",
            symbol: "XBTUSD",
            side: tempttt,
            currentQty: minBet,
            isOpen: false,
            posState: "",
            leverage: Marginbet,
            openingQty: minBet,
            avgEntryPrice: 0,
            liquidationPrice: 0,
            CountBet: 0,
            TimeOpen: "",
            High: 0,
            Low: 0,
            TimeOrDer: new Date().getTime(),
            Profit: 0,

            TimeClose: new Date().getTime(),
            Guess: {text: "Tăng giảm", L: 5, High: 5, Low: 5, Side: "Buy"}
        };
        db.setOrDer(JSON.stringify(CurrentOrder)).then((data) => {
            let h = 0;
        });
        bitmex.GetListBalance().then((err, data) => {
            if (err) {
                console.log("không thể lấy được tiền ");

            } else {
                if (data.length > 0) {
                    if (data[0].transactStatus == "Pending") {
                        CurrentOrder.Profit = data[0].amount;
                        CurrentBalance = data[0].walletBalance;
                    } else {
                        CurrentOrder.Profit = data[0].amount - CurrentBalance;
                        CurrentBalance = data[0].walletBalance;
                    }
                    if (data[0].transactStatus == "Pending" && data.length > 1) {
                        if (data[1].transactStatus == "Completed") {
                            ProfitDay = data[0].amount;
                            CurrentBalance = data[0].walletBalance;
                        }
                    }
                }
                let ct = "💲Price now:" + PriceNow + "💲" +
                    "\n____________________" +
                    "\n👉🏼 avgEntryPrice_ : " + TEMPCurrentOrder.avgEntryPrice +
                    "\n👉🏼 Quantity_ : " + TEMPCurrentOrder.currentQty +
                    "\n👉🏼 LiqPrice_ : " + TEMPCurrentOrder.liquidationPrice +
                    "\n👉🏼 Profit_ : " + TEMPCurrentOrder.Profit +
                    "\n👉🏼 Side_____ : " + TEMPCurrentOrder.side +
                    "\n👉🏼 Count bet : " + TEMPCurrentOrder.CountBet +
                    "\n👉🏼 ProfitDay_ : " + ProfitDay;

                AROrDer.push(TEMPCurrentOrder);
                FunSendFB("RT", "ℹ️Đã Cắt Lời__\n" + ct + "\n💲💲💲💲💲💲💲💲💲💲💲💲");

            }

        });
        countorder = 0;
        ArPull = [];
        // bitmex.getBalance().then((balance) => {
        //     console.log(balance);
        //     CurrentBalance = balance;
        //     CurrentOrder.TimeClose = new Date().getTime();
        //     AROrDer.push(CurrentOrder);
        //     db.setAROrDer(JSON.stringify(AROrDer)).then((data) => {
        //         var h = 0;
        //     });
        //     CurrentOrder.Profit = startOrder - CurrentBalance;
        //     startOrder = CurrentBalance;
        //     console.log("))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))" + CurrentOrder.Profit);
        //     if (CurrentBalance < StartBalance * 0.71) {
        //         console.log("___________________stop tolll________________________");
        //         ActiveTrade = false;
        //     }
        //
        //
        // });
    });

};
var TEMPCurrentOrder = null;

var FunClosePonsitonLimit = function (Pricec) {
    ActiveTrade = false;
    waitOrder = true;

    bitmex.closePositionLimit(CurrentOrder.orderID, Pricec).then((data) => {
        console.log("_________dat lenh close trk________-");
        TEMPCurrentOrder = CurrentOrder;
        FunWaitDE();

        VL = false;
        setTimeout(function () {

            console.log("căt lời")
            console.log(TEMPCurrentOrder)
            TEMPCurrentOrder.Profit = ProfitDay - Profitorder;
            let ct = "💲Price now:" + PriceNow + "💲" +
                "\n____________________" +
                "\n👉🏼 avgEntryPrice_ : " + TEMPCurrentOrder.avgEntryPrice +
                "\n👉🏼 Quantity_ : " + TEMPCurrentOrder.currentQty +
                "\n👉🏼 LiqPrice_ : " + TEMPCurrentOrder.liquidationPrice +
                "\n👉🏼 Profit_ : " + TEMPCurrentOrder.Profit +
                "\n👉🏼 Side_____ : " + TEMPCurrentOrder.side +
                "\n👉🏼 Count bet : " + TEMPCurrentOrder.CountBet +
                "\n👉🏼 ProfitDay_ : " + ProfitDay;

            AROrDer.push(TEMPCurrentOrder);
            StartQ = minBet;
            FunSendFB("RT", "ℹ️Đã Cắt Lời__\n" + ct + "\n💲💲💲💲💲💲💲💲💲💲💲💲");
        }, 1000);
        let tempttt = CurrentOrder.side;
        CurrentOrder = {
            orderID: "",
            symbol: "XBTUSD",
            side: tempttt,
            currentQty: minBet,
            isOpen: false,
            posState: "",
            leverage: Marginbet,
            openingQty: 10,
            avgEntryPrice: 0,
            liquidationPrice: 0,
            CountBet: 0,
            TimeOpen: "",
            High: 0,
            Low: 0,
            TimeOrDer: new Date().getTime(),
            Profit: 0,

            TimeClose: new Date().getTime(),
            Guess: {text: "Tăng giảm", L: 5, High: 5, Low: 5, Side: "Buy"}
        };
        db.setOrDer(JSON.stringify(CurrentOrder)).then((data) => {
            let h = 0;
        });
        countorder = 0;
        ArPull = [];

    });


};

// bitmex.getListOrDer().then((data)=>{
//                                 console.log("_______________________________________________")
//     console.log(data)
// });
bitmex.getBalance().then((balance) => {
    console.log(balance);
    StartBalance = balance;
    CurrentBalance = balance;
    startOrder = StartBalance;
});
var TimeA = new Date().getTime();
console.log(TimeA);

db.getOrDer().then((data) => {
    // console.log(data);
    if (data != null) {
        CurrentOrder = JSON.parse(data);
        if (isNaN(CurrentOrder.currentQty) || CurrentOrder.currentQty == null) {
            CurrentOrder.currentQty = 10;
        }
        // CurrentOrder.CountBet=0;

        console.log(CurrentOrder);
    }


});
db.getARPrice().then((data) => {
    // console.log(data);
    if (data != null) {
        let tt = JSON.parse(data);
        for (let i = 0; i < tt.length; i++) {
            // ARPoint.push(tt[i]);
        }
    }


});
const BitmexClient = require('./bitmexlib/bitmexlib.js');
const TimeEnum = {
    ONE: 1,
    FIVE: 5,
    FIFTEEN: 15,
};
const timeframe = TimeEnum.FIFTEEN;
const client = new BitmexClient(config.bitmexConfig);
client.on('open', () => console.log('connection opened.'));
client.on('error', err => console.log('caught error', err));
client.on('close', () => console.log('connection closed.'));
client.on('initialize', () => console.log('initialized, waiting for data'));
client.addStream('XBTUSD', 'margin', data => {
    if (!isNaN(data.length)) {
        if (data.length > 0) {
            CurrentBalance = data[0].walletBalance;
            ProfitDay = data[0].realisedPnl;
        }
    }
});
client.addStream('XBTUSD', 'order', data => {
    // console.log(data)
    if (!isNaN(data.length))
        if (data.length > 0) {
            let temm = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].ordStatus == "New") {
                    temm.push(data[i]);
                }
            }
            ArOrderSK = temm;
            setTimeout(function () {
                if (ArOrderSK.length > 0) {

                    bitmex.deleteAllOrder().then((data) => {
                        console.log("Phai xoa cai cu");
                        if (CurrentOrder.CountBet > 0)
                            CurrentOrder.CountBet--;
                    });
                }
            }, 4999);
        }

    // console.log("data")
    // console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY")
    // console.log("data")
});
// client.addStream('XBTUSD', 'order', data => {
//     console.log(data);
// });
client.addStream('XBTUSD', 'position', data => {
    if (data.length > 0) {
        // console.log("ponsiton" + data.isOpen);
        // console.log( data);
        const curr = data[data.length - 1];
        const {
            isOpen,
            posState,
            avgEntryPrice,
            leverage,
            openingTimestamp,
            openingQty,
            currentQty,
            liquidationPrice
        } = curr;

        CurrentOrder.isOpen = isOpen;
        if (isOpen) {
            // console.log(curr);
            CurrentOrder.isOpen = isOpen;
            CurrentOrder.posState = posState;
            CurrentOrder.avgEntryPrice = avgEntryPrice;
            CurrentOrder.liquidationPrice = liquidationPrice;
            CurrentOrder.leverage = leverage;
            CurrentOrder.TimeOpen = openingTimestamp;
            CurrentOrder.openingQty = openingQty;

            CurrentOrder.currentQty = currentQty;
            if (!VL) {
                VL = true;

            }
            // console.log("Entry price: " + PriceNow + "tLiquidation price: " + liquidationPrice);
        } else {

            VL = false;
            ActiveTrade = false;
            countorder = 0;
            FunWaitDE();
            db.setOrDer(JSON.stringify(CurrentOrder));
            ArPull = [];
            if (CurrentOrder.CountBet != 0) {
                let cside = CurrentOrder.side;
                CurrentOrder = {
                    orderID: "",
                    symbol: "XBTUSD",
                    side: cside,
                    currentQty: minBet,
                    isOpen: false,
                    posState: "",
                    leverage: Marginbet,
                    openingQty: 10,
                    avgEntryPrice: 0,
                    liquidationPrice: 0,
                    CountBet: 0,
                    TimeOpen: "",
                    High: 0,
                    Low: 0,
                    TimeOrDer: new Date().getTime(),
                    Profit: 0,
                    TimeClose: new Date().getTime(),
                    Guess: {text: "Tăng giảm", L: 5, High: 5, Low: 5, Side: "Buy"}
                };
            }

        }

        if (posState === 'Liquidation') {

        }
    }
});

bitmex.getBalance().then((balance) => {
    console.log("balance" + balance);
});

client.addStream('XBTUSD', 'tradeBin1d', data => {
    let lastCandle = data[data.length - 1];
    if (isNaN(lastCandle) && lastCandle != null && isNaN(lastCandle.high))
        BTC1d = {High: lastCandle.high, Low: lastCandle.low};
    // console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++bin1D");
    // console.log(BTC1d);
});
let temp = {};
client.addStream('XBTUSD', 'trade', data => {

    let lastCandle = data[data.length - 1];
    let {
        timestamp,
        symbol,
        price
    } = lastCandle;
    //set Price now;
    let TimeB = new Date().getTime();
    // console.log("time" + timestamp + "price:___________" + price);

    if (TimeB - TimeAA > TimeDelay || LastPrice != price) {
        ARsave.push(price);
        ARTEMPPRICE.push(price);
        if (!CurrentBalance.isOpen) {
            // console.log("time" + timestamp + "price:___________" + price);
            // FunSendFB("RT","price: "+price);


        }
        TimeAA = new Date().getTime();
    }
    LastPrice = price;
    if (price > PriceNow) {
        if (UpDows > 0)
            UpDows++;
        else {
            UpDows = 1;
        }
    } else if (price < PriceNow) {
        if (UpDows < 0)
            UpDows--;
        else {
            UpDows = -1;
        }
    }

    // dự đoán chiều hướng tăng



    if ((TimeB - TimeA > TimeDelay && ARsave.length > 3) || ARsave.length > Line) {
        var sum = 0;
        for (let i = 0; i < ARsave.length; i++) {
            sum += ARsave[i];

        }
        ARPoint.push({price: sum / ARsave.length, time: new Date().getTime()});
        db.setARPrice(JSON.stringify(ARPoint)).then((err, data) => {
        });
        ARsave = [];
        TimeA = new Date().getTime();
    }
    let vaLTT = {TG: false, data: {}};

    if (ARTEMPPRICE.length > 7) {
        let ltrue = false;
        for (let i = ARTEMPPRICE.length - 1; i > ARTEMPPRICE.length - 6; i--) {
            if (ARTEMPPRICE[i] >= ARTEMPPRICE[i - 1]) {
                ltrue = true;
            } else {
                ltrue = false;
                break;
            }
        }
        if (ARTEMPPRICE[ARTEMPPRICE.length - 1] - ARTEMPPRICE[ARTEMPPRICE.length - 7] < Deviation * 1.5) {
            ltrue = false;
        }
        if (ltrue) {
            vaLTT.TG = true;
            vaLTT.data = {
                TG: "TANG",
                L: ARTEMPPRICE[ARTEMPPRICE.length - 1] - ARTEMPPRICE[ARTEMPPRICE.length - 7],
                High: ARTEMPPRICE[ARTEMPPRICE.length - 1],
                Low: ARTEMPPRICE[ARTEMPPRICE.length - 7],
                time: new Date().getTime()
            };
        }
        if (!ltrue) {
            let ntrue = false;
            for (let i = ARTEMPPRICE.length - 1; i > ARTEMPPRICE.length - 6; i--) {
                if (ARTEMPPRICE[i] <= ARTEMPPRICE[i - 1]) {
                    ntrue = true;
                } else {
                    ntrue = false;
                    break;
                }
            }
            if (ARTEMPPRICE[ARTEMPPRICE.length - 7] - ARTEMPPRICE[ARTEMPPRICE.length - 1] < Deviation * 1.5) {
                ntrue = false;
            }
            if (ntrue) {
                vaLTT.data = true;
                vaLTT.data = {
                    TG: "GIAM",
                    L: ARTEMPPRICE[ARTEMPPRICE.length - 7] - ARTEMPPRICE[ARTEMPPRICE.length - 1],
                    High: ARTEMPPRICE[ARTEMPPRICE.length - 7],
                    Low: ARTEMPPRICE[ARTEMPPRICE.length - 1],
                    time: new Date().getTime()
                };
            }
        }

    }
    if (ARPoint.length > 3 && ARPoint.length > bietTG + 2) {
        let startindex = bietTG;
        for (let i = startindex; i < ARPoint.length - 2; i++) {
            bietTG++;

            if (ARPoint[i + 2].price > ARPoint[i + 1].price && ARPoint[i + 1].price > ARPoint[i]) {
                let l = ARPoint[i + 2].price - ARPoint[i].price;
                temp = {
                    TG: "TANG",
                    L: l,
                    High: ARPoint[i + 2].price,
                    Low: ARPoint[i].price,
                    time: new Date().getTime()
                };
                if (!CurrentOrder.isOpen)
                    console.log("Tang |" + ARPoint[i + 2].price + " > " + ARPoint[i].price + " > " + ARPoint[i].price + "|");
            } else if (ARPoint[i + 2].price < ARPoint[i + 1].price && ARPoint[i + 1].price < ARPoint[i].price) {
                let l = ARPoint[i].price - ARPoint[i + 2].price;
                if (!CurrentOrder.isOpen)
                    console.log("Giam |" + ARPoint[i + 2].price + " < " + ARPoint[i].price + " < " + ARPoint[i].price + "|");
                temp = {
                    TG: "GIAM",
                    L: l,
                    High: ARPoint[i].price,
                    Low: ARPoint[i + 2].price,
                    time: new Date().getTime()
                };
            } else {
                if (!CurrentOrder.isOpen)
                    console.log("_____<>________");
                let h = 0;
                let l = 0;
                if (ARPoint[i + 2].price > ARPoint[i + 1].price) {
                    if (ARPoint[i + 2].price > ARPoint[i].price) {
                        h = ARPoint[i + 2].price;
                    }
                    else {
                        h = ARPoint[i].price;
                    }
                    if (ARPoint[i + 1].price > ARPoint[i].price) {
                        l = ARPoint[i].price;
                    } else {
                        l = ARPoint[i + 1].price;
                    }
                } else {
                    if (ARPoint[i + 1].price > ARPoint[i].price) {
                        h = ARPoint[i + 1].price;
                    } else {
                        h = ARPoint[i].price;
                    }
                    if (ARPoint[i + 2].price > ARPoint[i].price) {
                        l = ARPoint[i].price;
                    } else {
                        l = ARPoint[i + 2].price;
                    }
                }
                temp = {TG: "__", L: 0, High: h, Low: l, time: new Date().getTime()};
            }
            if (vaLTT.TG && temp.TG == "__") {
                console.log("(((((((((thuat toan doan moi))))))))");
                temp = vaLTT.data;
            }
            ARTG.push(temp);
            // console.log(ActiveTrade +"GDg"+CurrentOrder.isOpen)


            /////////////////
            if (ActiveTrade)
                if (!CurrentOrder.isOpen) {
                    // dự đoán tăng giảm để vào lệnh
                    if (temp.TG != "__") {
                        console.log(temp );
                        console.log("_________" + ActiveTrade+ "______"+waitOrder);
                        console.log(parseFloat(temp.L) > parseFloat(Deviation));

                        if (parseFloat(temp.L) > parseFloat(Deviation)) {
                            console.log("______chuan bi vao lenh________");
                            // vào lệnh
                            console.log(temp);
                            if (temp.TG == "TANG") {
                                CurrentOrder.side = "Buy";
                            } else {
                                CurrentOrder.side = "Sell";
                            }
                            CurrentOrder.TimeOrDer = new Date().getTime();
                            CurrentOrder.Guess.High = temp;
                            db.setOrDer(JSON.stringify(CurrentOrder)).then((data) => {
                                let h = 0;
                            });
                            TimeStart = new Date().getTime();
                            ThongSo.TimeStart = TimeStart;
                            db.setTHONGSO(JSON.stringify(ThongSo)).then((data) => {
                                let f = "sdf";
                            });
                            FunOrder();
                            console.log("___________vao lenh_________________")

                        } else {
                            if (ARTG.length > 3)
                                if (ARTG[ARTG.length - 2].TG == ARTG[ARTG.length - 1].TG) {
                                    let isOrder = false;

                                    if (ARTG[ARTG.length - 2].TG == "TANG") {
                                        if (ARTG[ARTG.length - 1].High - ARTG[ARTG.length - 2].Low > Deviation) {
                                            isOrder = true;
                                        } else if ((ARTG[ARTG.length - 2].TG == ARTG[ARTG.length - 3].TG) && (ARTG[ARTG.length - 1].High - ARTG[ARTG.length - 3].Low > Deviation)) {
                                            isOrder = true;
                                        } else {
                                            console.log("gop 2 lan tang chua đu _________" + (ARTG[ARTG.length - 1].High - ARTG[ARTG.length - 2].Low));
                                        }
                                    } else {
                                        if (ARTG[ARTG.length - 2].High - ARTG[ARTG.length - 1].Low > Deviation) {
                                            isOrder = true;
                                        } else if ((ARTG[ARTG.length - 2].TG == ARTG[ARTG.length - 3].TG) && (ARTG[ARTG.length - 3].High - ARTG[ARTG.length - 1].Low > Deviation)) {
                                            isOrder = true;
                                        } else {
                                            console.log("gop 2 lan giam chua đu _________" + (ARTG[ARTG.length - 2].High - ARTG[ARTG.length - 1].Low));
                                        }
                                    }
                                    if (isOrder) {
                                        // console.log("______chuan bi vao lenh________");
                                        // vào lệnh
                                        // console.log(temp);
                                        if (temp.TG == "TANG") {
                                            CurrentOrder.side = "Buy";
                                        } else {
                                            CurrentOrder.side = "Sell";
                                        }
                                        CurrentOrder.TimeOrDer = new Date().getTime();
                                        CurrentOrder.Guess.High = temp;
                                        db.setOrDer(JSON.stringify(CurrentOrder)).then((data) => {
                                            let h = 0;
                                        });
                                        TimeStart = new Date().getTime();
                                        ThongSo.TimeStart = TimeStart;
                                        db.setTHONGSO(JSON.stringify(ThongSo)).then((data) => {
                                            let f = "sdf";
                                        });
                                        FunSendFB("RT", "Chuẩn bị vào lệnh");
                                        FunOrder();
                                        // console.log("____________________________")
                                    }
                                }
                        }
                    }
                    else
                        console.log("khong du vao lenh" + (temp.L))
                } else {
                    // dự đoán tăng giảm để bơm
                    ////////////////////////////huy//////////////////
                    TruePull = true;
                    if (temp.TG != "__") {
                        if (parseFloat(temp.L) > parseFloat(Deviation)) {
                            console.log("______chan bom them________");
                            TruePull = false;
                        } else {
                            TruePull = true;
                            if (ARTG.length > 3)
                                if (ARTG[ARTG.length - 2].TG == ARTG[ARTG.length - 1].TG) {
                                    let isOrder = false;

                                    if (ARTG[ARTG.length - 2].TG == "TANG") {
                                        if (ARTG[ARTG.length - 1].High - ARTG[ARTG.length - 2].Low > Deviation) {
                                            TruePull = false;
                                            console.log("______chan bom them________");

                                        } else if ((ARTG[ARTG.length - 2].TG == ARTG[ARTG.length - 3].TG) && (ARTG[ARTG.length - 1].High - ARTG[ARTG.length - 3].Low > Deviation)) {
                                            TruePull = false;
                                            console.log("______chan bom them________");

                                        } else {
                                            TruePull = true;

                                        }
                                    } else {
                                        if (ARTG[ARTG.length - 2].High - ARTG[ARTG.length - 1].Low > Deviation) {
                                            TruePull = false;
                                            console.log("______chan bom them________");
                                        } else if ((ARTG[ARTG.length - 2].TG == ARTG[ARTG.length - 3].TG) && (ARTG[ARTG.length - 3].High - ARTG[ARTG.length - 1].Low > Deviation)) {
                                            TruePull = false;
                                            console.log("______chan bom them________");
                                        } else {
                                            TruePull = true;
                                        }
                                    }

                                }
                        }
                    } else {
                        TruePull=true;

                        if (temp.High - temp.Low > 2) {
                            TruePull = false;
                            console.log("______chan bom them________");
                        } else {
                            TruePull = true;

                            let be = ARTEMPPRICE.length - 1;
                            let lon = ARTEMPPRICE.length - 1;
                            if (ARTEMPPRICE.length) {
                                for (let i = ARTEMPPRICE.length - 1; i > ARTEMPPRICE.length - 6; i--) {
                                    if (ARTEMPPRICE[i] > lon) {
                                        lon = ARTEMPPRICE[i];
                                    }
                                    if (ARTEMPPRICE[i] < be) {
                                        be = ARTEMPPRICE[i];
                                    }
                                }
                                if (lon - be >3) {
                                    console.log("______chan bom them________");

                                    TruePull = false;
                                }   else{
                                    // console.log("______chan bom them________");
                                }
                            }
                        }
                    }
                }

        }
    }

    PriceNow = price;
    //check khi vào lệnh

    if (ActiveTrade)
        if (CurrentOrder.isOpen) {

            var VONGOC = CurrentBalance / 100000000 * PriceNow;
            var PHIMARGIN = 0.0001 * (VONGOC * Marginbet - VONGOC) * 3;
            var PHIGIAODICH = 0.0000002;
            var GIAGIAODICH = CurrentOrder.currentQty;
            if (GIAGIAODICH < 0) {
                GIAGIAODICH = GIAGIAODICH * -1;
            }
            CutProfit2 = (PriceNow * PHIGIAODICH * GIAGIAODICH + (PHIMARGIN / 30)) * PriceNow / GIAGIAODICH;
            CutProfit2 = parseFloat(CutProfit2.toFixed(2)) + parseFloat(0.5);

            // console.log("______________********_____________")
            //
            // console.log(PHIMARGIN)
            // console.log(VONGOC)
            // console.log(PHIGIAODICH)
            // console.log(GIAGIAODICH)
            // console.log(CutProfit2)
            // console.log("______________********_____________")

            if (CutProfit < CutProfit2) {
                CutProfit = CutProfit2 + 1;
            } else {
                CutProfit = CutProfitTemp;
            }
            // set high low trong lệnh
            if (PriceNow > CurrentOrder.High) {
                CurrentOrder.High = PriceNow;
            }
            if (PriceNow < CurrentOrder.Low) {
                CurrentOrder.Low = PriceNow;
            }
            // console.log("currentQty: " + CurrentOrder.currentQty + "liquidationPrice : " + CurrentOrder.liquidationPrice + " --- Price: " + PriceNow + " avgPrice : " + CurrentOrder.avgEntryPrice + " Count: " + CurrentOrder.CountBet + " side " + CurrentOrder.side);
            FunCHUY();
            if (CurrentOrder.side == "Buy") {
                // lệnh Buy

                NexxtPullloss = CurrentOrder.avgEntryPrice - (PullLoss * Math.pow(1.3, CurrentOrder.CountBet));
                // console.log(PriceNow - CurrentOrder.avgEntryPrice < -(PullLoss * Math.pow(1.3, CurrentOrder.CountBet)));
                // console.log(PriceNow - CurrentOrder.avgEntryPrice < -(PullLoss * Math.pow(1.3, CurrentOrder.CountBet)));
                // console.log(PriceNow - CurrentOrder.avgEntryPrice < -(PullLoss * Math.pow(1.3, CurrentOrder.CountBet)));
                if (PriceNow - CurrentOrder.avgEntryPrice < -(PullLoss * Math.pow(1.3, CurrentOrder.CountBet))) {
                    if(TruePull){
                        console.log("_________cho bơm")
                    } else{
                        console.log("_________chặn bơm bơm bơm"+PriceNow)

                    }
                    if (CurrentOrder.CountBet <= LimitLoss) {
                        if (TruePull) {
                            if (ActiveTrade) {
                                FunOrder();
                            }
                        } else if (PriceNow < (CurrentOrder.avgEntryPrice + CurrentOrder.liquidationPrice) / 2) {
                            if (ActiveTrade) {
                                FunOrder();
                            }
                        }else{

                        }

                    } else {
                        CurrentOrder.CountBet = 5;

                        if (PriceNow < (CurrentOrder.avgEntryPrice + CurrentOrder.liquidationPrice) / 2) {
                            // căt lỗ
                            console.log("_________bat dau cat lo_______Buy____");
                            // FunClosePonsiton();
                            FunClosePonsitonLimit(PriceNow - MoreCutProfit);


                        } else if (PriceNow < (CurrentOrder.avgEntryPrice + CutLoss) && (new Date().getTime() - TimeStart > TimeCutLoss)) {
                            console.log("_________bat dau cat lo khi doi qua lau_______Buy____");
                            // FunClosePonsiton();
                            FunClosePonsitonLimit(PriceNow - MoreCutProfit);

                        }
                    }
                } else if (PriceNow > (CurrentOrder.avgEntryPrice + CutProfit) && UpDows < 0) {
                    console.log("_________bat dau cat loiiiii____Buy_______");
                    // FunClosePonsiton();
                    FunClosePonsitonLimit(PriceNow - MoreCutProfit);

                    UpDows = 0;
                } else if (PriceNow > (CurrentOrder.avgEntryPrice + CutProfit2) && UpDows < -1) {
                    console.log("_________bat dau cat loiiiii___ biendong______Buy__");
                    UpDows = 0;
                    FunClosePonsitonLimit(PriceNow - MoreCutProfit);
                    // FunClosePonsiton();
                }
            } else {
                // lệnh Sell
                NexxtPullloss = CurrentOrder.avgEntryPrice + (PullLoss * Math.pow(1.3, CurrentOrder.CountBet));
                // console.log(PriceNow - CurrentOrder.avgEntryPrice > (PullLoss * Math.pow(1.3, CurrentOrder.CountBet)))
                // console.log(PriceNow - CurrentOrder.avgEntryPrice)
                // console.log(PullLoss * Math.pow(1.3, CurrentOrder.CountBet))
                if (PriceNow - CurrentOrder.avgEntryPrice > (PullLoss * Math.pow(1.3, CurrentOrder.CountBet))) {
                    if(TruePull){
                        console.log("_________cho bơm")
                    } else{
                        console.log("_________chặn bơm bơm bơm"+PriceNow)

                    }
                    if (CurrentOrder.CountBet <= LimitLoss) {
                        if (TruePull) {
                            if (ActiveTrade) {
                                FunOrder();
                            }
                        } else if (PriceNow > (CurrentOrder.liquidationPrice + CurrentOrder.avgEntryPrice) / 2) {
                            if (ActiveTrade) {
                                FunOrder();
                            }
                        }
                    } else {
                        if (PriceNow > (CurrentOrder.liquidationPrice + CurrentOrder.avgEntryPrice) / 2) { //cắt lỗ

                            console.log("_________bat dau cat lo___Sell________" + (CurrentOrder.liquidationPrice + CurrentOrder.avgEntryPrice) / 2);
                            // FunClosePonsiton();
                            FunClosePonsitonLimit(PriceNow + MoreCutProfit);

                        }
                        if (PriceNow > (CurrentOrder.avgEntryPrice + CutLoss) && (new Date().getTime() - TimeStart > TimeCutLoss)) {
                            console.log("_________bat dau cat lo khi doi qua lau_______Buy____");
                            // FunClosePonsiton();
                            FunClosePonsitonLimit(PriceNow + MoreCutProfit);

                        }
                    }
                } else if (PriceNow < (CurrentOrder.avgEntryPrice - CutProfit) && UpDows > 0) {
                    console.log("_________bat dau cat loiiiii_____ sell______");
                    UpDows = 0;
                    FunClosePonsitonLimit(PriceNow + MoreCutProfit);
                    // FunClosePonsiton();
                } else if (PriceNow < (CurrentOrder.avgEntryPrice - CutProfit2) && UpDows > 1) {
                    console.log("_________bat dau cat loiiiii___ biendong__ sell______");
                    UpDows = 0;
                    FunClosePonsitonLimit(PriceNow + MoreCutProfit);
                    // FunClosePonsiton();
                }
            }
        }
    // console.log(TimeB);

});

// send data
const fs = require("fs");

const login = require("facebook-chat-api");
console.log("nefnef ")
// Create simple echo bot
var credentials = {email: "suphuyquansu1996@gmail.com", password: "AIitsme1010"};
login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, api) => {
    if (err) return console.error(err);
    fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
    console.log("_________đã kết nối bot______________");
    api.listen((err, event) => {
        // console.log(event)
        Botfb = api;
        if (event.body.toUpperCase() === 'BITMEX' || event.body.toUpperCase() === "START") {
            if (ArFB.indexOf(event.threadID) == -1) {
                api.sendMessage("❤️bạn vừa được kết nối bot❤️", event.threadID);


                ArFB.push(event.threadID);
            } else
                api.sendMessage("❤️bạn đã kết nối bot❤️", event.threadID);

            db.setARFB(JSON.stringify(ArFB)).then((data) => {
                let t = "df";
            });
            // db.setARFBRT(JSON.stringify(ArFBRT)).then((data)=>{
            //     let t="df";
            // });
        } else if (event.body.toUpperCase() === 'STOP' || event.body.toUpperCase() === 'S') {
            if (ArFB.indexOf(event.threadID) >= 0) {
                ArFB.splice(ArFB.indexOf(event.threadID), 1)
            }
            if (ArFBRT.indexOf(event.threadID) >= 0) {
                ArFBRT.splice(ArFBRT.indexOf(event.threadID), 1)
            }
            db.setARFB(JSON.stringify(ArFB)).then((data) => {
                let t = "df";
            });
            db.setARFBRT(JSON.stringify(ArFBRT)).then((data) => {
                let t = "df";
            });
            api.sendMessage("❤️❤️Goodbye…..", event.threadID);
        } else if (ArFB.indexOf(event.threadID) >= 0) {
            if (event.body.toUpperCase() === "RT") {
                if (ArFBRT.indexOf(event.threadID) == -1) {
                    ArFBRT.push(event.threadID);
                    api.sendMessage("❤️Bạn vừa kết nối Realtime❤️", event.threadID);


                } else
                    api.sendMessage("❤️Đã kết nối Realtime❤️", event.threadID);

                // db.setARFB(JSON.stringify(ArFB)).then((data)=>{
                //     let t="df";
                // });
                db.setARFBRT(JSON.stringify(ArFBRT)).then((data) => {
                    let t = "df";
                });
            } else if (event.body.toUpperCase() === "SRT" || event.body.toUpperCase() === "STOPRT") {
                if (ArFBRT.indexOf(event.threadID) >= 0) {
                    ArFBRT.splice(ArFBRT.indexOf(event.threadID), 1)
                }
                api.sendMessage("👉🏼 Đã ngắt socket", event.threadID);

            } else if (event.body.toUpperCase() === "SETTING" || event.body.toUpperCase() === "ST") {


                let ct =
                    "\n____________________" +
                    "\n👉🏼 Min bet_____ : " + minBet +
                    "\n👉🏼 Marginbet🔼🔽 : " + Marginbet +
                    "\n👉🏼 Deviation🔼🔽 : " + Deviation +
                    "\n👉🏼 LimitLoss🔼🔽 : " + LimitLoss +
                    "\n👉🏼 PullLoss🔼🔽 : " + PullLoss +
                    "\n👉🏼 CutLoss🔼🔽 : " + CutLoss +
                    "\n👉🏼 Cut Profit__ : " + CutProfit +
                    "\n____________________";
                api.sendMessage(ct, event.threadID);

            } else if (event.body.toUpperCase().indexOf("SET MINBET") >= 0) {
                try {
                    let stringne = event.body;
                    if (!isNaN(parseInt(stringne.substring(11, stringne.length)))) {
                        console.log("set ting");
                        ThongSo.minbet = parseInt(stringne.substring(11, stringne.length));
                        // ThongSo = JSON.parse(data);
                        minBet = ThongSo.minbet;
                        db.setTHONGSO(JSON.stringify(ThongSo)).then((data) => {
                            let f = "sdf";
                        });
                        if (!CurrentOrder.isOpen) {
                            StartQ = minBet;
                        }
                        api.sendMessage("ℹ️đã update min bet: " + ThongSo.minbet, event.threadID);
                    } else {
                        api.sendMessage("⚡không thể set min bet⚡\n vui lòng nhập lại" + stringne.substring(11, stringne.length), event.threadID);

                    }
                } catch (e) {

                }
                let ct =
                    "\n____________________" +
                    "\n👉🏼 Min bet_____ : " + minBet +
                    "\n👉🏼 Marginbet🔼🔽 : " + Marginbet +
                    "\n👉🏼 Deviation🔼🔽 : " + Deviation +
                    "\n👉🏼 LimitLoss🔼🔽 : " + LimitLoss +
                    "\n👉🏼 PullLoss🔼🔽 : " + PullLoss +
                    "\n👉🏼 CutLoss🔼🔽 : " + CutLoss +
                    "\n👉🏼 Cut Profit__ : " + CutProfit +
                    "\n____________________";
                api.sendMessage(ct, event.threadID);

            }
            else if (event.body.toUpperCase().indexOf("SET CF") >= 0) {
                try {
                    let stringne = event.body;
                    if (!isNaN(parseInt(stringne.substring(7, stringne.length)))) {
                        console.log("setting");
                        ThongSo.CutProfit = parseInt(stringne.substring(7, stringne.length));
                        // ThongSo = JSON.parse(data);
                        CutProfit = ThongSo.CutProfit;
                        CutProfitTemp = CutProfit;
                        db.setTHONGSO(JSON.stringify(ThongSo)).then((data) => {
                            let f = "sdf";
                        });
                        api.sendMessage("ℹ️đã update Cut Frofit: " + ThongSo.CutProfit, event.threadID);
                    } else {
                        api.sendMessage("⚡không thể set Cut Frofit⚡\n vui lòng nhập lại" + stringne.substring(7, stringne.length), event.threadID);

                    }
                } catch (e) {

                }
                let ct =
                    "\n____________________" +
                    "\n👉🏼 Min bet_____ : " + minBet +
                    "\n👉🏼 Marginbet🔼🔽 : " + Marginbet +
                    "\n👉🏼 Deviation🔼🔽 : " + Deviation +
                    "\n👉🏼 LimitLoss🔼🔽 : " + LimitLoss +
                    "\n👉🏼 PullLoss🔼🔽 : " + PullLoss +
                    "\n👉🏼 CutLoss🔼🔽 : " + CutLoss +
                    "\n👉🏼 Cut Profit__ : " + CutProfit +
                    "\n____________________";
                api.sendMessage(ct, event.threadID);

            }
            else if (event.body.toUpperCase().indexOf("SET MG") >= 0) {
                try {
                    let stringne = event.body;
                    if (!isNaN(parseInt(stringne.substring(7, stringne.length)))) {
                        console.log("setting");
                        ThongSo.Marginbet = parseInt(stringne.substring(7, stringne.length));
                        // ThongSo = JSON.parse(data);
                        Marginbet = ThongSo.Marginbet;
                        bitmex.adjustMargin(Marginbet).then((data) => {
                            let d = 0;
                        });
                        db.setTHONGSO(JSON.stringify(ThongSo)).then((data) => {
                            let f = "sdf";
                        });
                        api.sendMessage("ℹ️đã update Marginbet: " + ThongSo.Marginbet, event.threadID);
                    } else {
                        api.sendMessage("⚡không thể set Marginbet⚡\n vui lòng nhập lại" + stringne.substring(7, stringne.length), event.threadID);

                    }
                } catch (e) {

                }
                let ct =
                    "\n____________________" +
                    "\n👉🏼 Min bet_____ : " + minBet +
                    "\n👉🏼 Marginbet🔼🔽 : " + Marginbet +
                    "\n👉🏼 Deviation🔼🔽 : " + Deviation +
                    "\n👉🏼 LimitLoss🔼🔽 : " + LimitLoss +
                    "\n👉🏼 PullLoss🔼🔽 : " + PullLoss +
                    "\n👉🏼 CutLoss🔼🔽 : " + CutLoss +
                    "\n👉🏼 Cut Profit__ : " + CutProfit +
                    "\n____________________";
                api.sendMessage(ct, event.threadID);

            }
            else if (event.body.toUpperCase().indexOf("SET LL") >= 0) {
                try {
                    let stringne = event.body;
                    if (!isNaN(parseInt(stringne.substring(7, stringne.length)))) {
                        console.log("setting");
                        ThongSo.LimitLoss = parseInt(stringne.substring(7, stringne.length));
                        // ThongSo = JSON.parse(data);
                        LimitLoss = ThongSo.LimitLoss;
                        db.setTHONGSO(JSON.stringify(ThongSo)).then((data) => {
                            let f = "sdf";
                        });

                        api.sendMessage("ℹ️đã update LimitLoss: " + ThongSo.LimitLoss, event.threadID);
                    } else {
                        api.sendMessage("⚡không thể set LimitLoss⚡\n vui lòng nhập lại" + stringne.substring(7, stringne.length), event.threadID);

                    }
                } catch (e) {

                }
                let ct =
                    "\n____________________" +
                    "\n👉🏼 Min bet_____ : " + minBet +
                    "\n👉🏼 Marginbet🔼🔽 : " + Marginbet +
                    "\n👉🏼 Deviation🔼🔽 : " + Deviation +
                    "\n👉🏼 LimitLoss🔼🔽 : " + LimitLoss +
                    "\n👉🏼 PullLoss🔼🔽 : " + PullLoss +
                    "\n👉🏼 CutLoss🔼🔽 : " + CutLoss +
                    "\n👉🏼 Cut Profit__ : " + CutProfit +
                    "\n____________________";
                api.sendMessage(ct, event.threadID);

            }
            else if (event.body.toUpperCase().indexOf("SET DE") >= 0) {
                try {
                    let stringne = event.body;
                    if (!isNaN(parseInt(stringne.substring(7, stringne.length)))) {
                        console.log("setting");
                        ThongSo.Deviation = parseInt(stringne.substring(7, stringne.length));
                        // ThongSo = JSON.parse(data);
                        Deviation = ThongSo.Deviation;
                        db.setTHONGSO(JSON.stringify(ThongSo)).then((data) => {
                            let f = "sdf";
                        });
                        api.sendMessage("ℹ️đã update Deviation: " + ThongSo.Deviation, event.threadID);
                    } else {
                        api.sendMessage("⚡không thể set Deviation⚡\n vui lòng nhập lại" + stringne.substring(7, stringne.length), event.threadID);

                    }
                } catch (e) {

                }
                let ct =
                    "\n____________________" +
                    "\n👉🏼 Min bet_____ : " + minBet +
                    "\n👉🏼 Marginbet🔼🔽 : " + Marginbet +
                    "\n👉🏼 Deviation🔼🔽 : " + Deviation +
                    "\n👉🏼 LimitLoss🔼🔽 : " + LimitLoss +
                    "\n👉🏼 PullLoss🔼🔽 : " + PullLoss +
                    "\n👉🏼 CutLoss🔼🔽 : " + CutLoss +
                    "\n👉🏼 Cut Profit__ : " + CutProfit +
                    "\n____________________";
                api.sendMessage(ct, event.threadID);

            }
            else if (event.body.toUpperCase().indexOf("SET PL") >= 0) {
                try {
                    let stringne = event.body;
                    if (!isNaN(parseInt(stringne.substring(7, stringne.length)))) {
                        console.log("setting");
                        ThongSo.PullLoss = parseInt(stringne.substring(7, stringne.length));
                        // ThongSo = JSON.parse(data);
                        PullLoss = ThongSo.PullLoss;
                        db.setTHONGSO(JSON.stringify(ThongSo)).then((data) => {
                            let f = "sdf";
                        });
                        api.sendMessage("ℹ️đã update PullLoss: " + ThongSo.PullLoss, event.threadID);
                    } else {
                        api.sendMessage("⚡không thể set PullLoss⚡\n vui lòng nhập lại" + stringne.substring(7, stringne.length), event.threadID);

                    }
                } catch (e) {

                }
                let ct =
                    "\n____________________" +
                    "\n👉🏼 Min bet_____ : " + minBet +
                    "\n👉🏼 Marginbet🔼🔽 : " + Marginbet +
                    "\n👉🏼 Deviation🔼🔽 : " + Deviation +
                    "\n👉🏼 LimitLoss🔼🔽 : " + LimitLoss +
                    "\n👉🏼 PullLoss🔼🔽 : " + PullLoss +
                    "\n👉🏼 CutLoss🔼🔽 : " + CutLoss +
                    "\n👉🏼 Cut Profit__ : " + CutProfit +
                    "\n____________________";
                api.sendMessage(ct, event.threadID);

            }
            else if (event.body.toUpperCase().indexOf("SET CL") >= 0) {
                try {
                    let stringne = event.body;
                    if (!isNaN(parseInt(stringne.substring(7, stringne.length)))) {
                        console.log("setting");
                        ThongSo.CutLoss = parseInt(stringne.substring(7, stringne.length));
                        // ThongSo = JSON.parse(data);
                        CutLoss = ThongSo.CutLoss;
                        db.setTHONGSO(JSON.stringify(ThongSo)).then((data) => {
                            let f = "sdf";
                        });
                        api.sendMessage("ℹ️đã update CutLoss: " + ThongSo.CutLoss, event.threadID);
                    } else {
                        api.sendMessage("⚡không thể set CutLoss⚡\n vui lòng nhập lại" + stringne.substring(7, stringne.length), event.threadID);

                    }
                } catch (e) {

                }
                let ct =
                    "\n____________________" +
                    "\n👉🏼 Min bet_____ : " + minBet +
                    "\n👉🏼 Marginbet🔼🔽 : " + Marginbet +
                    "\n👉🏼 Deviation🔼🔽 : " + Deviation +
                    "\n👉🏼 LimitLoss🔼🔽 : " + LimitLoss +
                    "\n👉🏼 PullLoss🔼🔽 : " + PullLoss +
                    "\n👉🏼 CutLoss🔼🔽 : " + CutLoss +
                    "\n👉🏼 Cut Profit__ : " + CutProfit +
                    "\n____________________";
                api.sendMessage(ct, event.threadID);

            }
            else if (event.body.toUpperCase() === "INFO" || event.body.toUpperCase() === "IF" || event.body.toUpperCase() === "I") {
                var startPriceOrder=0;
                var DeDanh = 0.1;
                var VONGOC = CurrentBalance / 100000000 * PriceNow;
                var PHIMARGIN = 0.0001 * (VONGOC * Marginbet - VONGOC) * 3;
                var PHIGIAODICH = VONGOC * Marginbet * 0.0000002 * PriceNow;
                var TienKhaDung = (VONGOC * (0.9)) - PHIMARGIN - PHIGIAODICH;
                var tempnene = TienKhaDung * Marginbet;
                for (let i = 0; i < LimitLoss; i++) {
                    tempnene *= 0.5;
                }
                startPriceOrder = parseInt(tempnene);
                console.log(CurrentBalance)
                console.log(PriceNow)
                console.log(VONGOC)
                console.log(PHIMARGIN)
                console.log(PHIGIAODICH)
                console.log(TienKhaDung)
                console.log(tempnene)


                let text = "START";
                if (!STARTTOLL) {
                    text = "STOP";
                }
                if (CurrentOrder.isOpen) {

                    let ct = "💲Price now:" + PriceNow + "💲" +
                        "\n____________________" +
                        "\n👉🏼 avgEntryPrice_ : " + CurrentOrder.avgEntryPrice +
                        "\n👉🏼 Quantity_ : " + CurrentOrder.currentQty +
                        "\n👉🏼 LiqPrice_ : " + CurrentOrder.liquidationPrice +
                        "\n👉🏼 Profit_ : " + CurrentOrder.Profit +
                        "\n👉🏼 Side_____ : " + CurrentOrder.side +
                        "\n👉🏼 Count bet : " + CurrentOrder.CountBet +
                        "\n👉🏼 Time _____ : " + ((new Date().getTime() - TimeStart) / 60000).toFixed(2) + "p" +
                        "\n👉🏼 CutProfit3 : " + CutProfit2 +
                        "\n👉🏼 CutProfit! : " + CutProfit +
                        "\n👉🏼 MinBet : " + tempnene +

                        "\n👉🏼 BalanceDay : " + CurrentBalance +
                        "\n👉🏼 ProfitDay_ : " + ProfitDay;
                    api.sendMessage(ct, event.threadID);
                } else {
                    let ct = "💲Price now:" + PriceNow + "💲" +
                        "\n_____BOT___" + text + "______" +
                        "\n👉🏼 Waitting Order : " +
                        "\n👉🏼 MinBet : " + tempnene +

                        "\n👉🏼 BalanceDay : " + CurrentBalance +
                        "\n👉🏼 ProfitDay_ : " + ProfitDay;

                    api.sendMessage(ct, event.threadID);
                }
            } else if (event.body.toUpperCase() === "CCC") {
                FunCHUY();
                api.sendMessage("đã cân bằng count" + CurrentOrder.CountBet, event.threadID);

            }   else if (event.body.toUpperCase() === "huyhuy")  {
                asdfkj = sdfsadf + dfasdf;
                // pm2.start()
                var pm2 = require("pm2");
                console.log("restart")
                let connectAndExec = (onSuccess, onError) => {
                    pm2.connect(function (err) {
                        if (err) {
                            console.error(err);
                            process.exit(2);
                            onError();
                        }

                        onSuccess();
                    });
                };
                pm2.restart(38, (err, data) => {
                    if (err) {
                        console.error(err);
                        process.exit(2);
                    }
                });
            }
            else if (event.body.toUpperCase() === "FROFIT" || event.body.toUpperCase() === "FF" || event.body.toUpperCase() === "F") {



                {
                    let text = "START";
                    if (!STARTTOLL) {
                        text = "STOP";
                    }
                    let ct =
                        "\n____________________" +
                        "\n_____BOT___" + text + "______" +
                        "\n👉🏼 Time Start :" + ((new Date().getTime() - TimeStartBot) / 3600000).toFixed(3) + "h" +
                        "\n👉🏼 Count Order__dc :" + AROrDer.length +
                        "\n👉🏼 Balance______ :" + CurrentBalance +
                        "\n👉🏼 Frofit_______ :" + ProfitDay +
                        "\n____________________";

                    api.sendMessage(ct, event.threadID);

                }
            }
            else if (event.body.toUpperCase() === "STOPBOT" || event.body.toUpperCase() === "STOP BOT") {
                ActiveTrade = false;
                waitOrder = true;
                STARTTOLL = false;
                if (CurrentOrder.isOpen) {
                    if (CurrentOrder.side == "Buy")
                        FunClosePonsitonLimit(PriceNow - MoreCutProfit);
                    else
                        FunClosePonsitonLimit(PriceNow + MoreCutProfit);

                }

                api.sendMessage("\"--❤❤STOP BOT❤❤--\"", event.threadID);
            }
            else if (event.body.toUpperCase() === "STARTBOT" || event.body.toUpperCase() === "START BOT") {
                ActiveTrade = true;
                waitOrder = false;
                STARTTOLL = true;
                api.sendMessage("\"--❤❤START BOT❤❤--\"", event.threadID);
            }
            else if (event.body.toUpperCase() === "HELP" || event.body.toUpperCase() === "H") {
                let ct = "_______---❤❤HELP❤❤---______" +
                    "\n______________________________" +
                    "\n👉🏼 Check Info __ : INFO | IF | I" +
                    "\n👉🏼 Check Frofit_ : FROFIT | FF | F" +
                    "\n👉🏼 Check setting : SETTING | ST" +
                    "\n👉🏼 Realtime ____ : REALTIME | RT " +
                    "\n👉🏼 stop listen__ : STOP | S" +
                    "\n👉🏼 stop Realtime : STOPRT | SRT " +
                    "\n👉🏼 set MinBet___ : SET MINBET" +
                    "\n👉🏼 set CutFrofit : SET CF" +
                    "\n👉🏼 set MarginBet : SET MG" +
                    "\n👉🏼 set DE_______ : SET DE" +
                    "\n👉🏼 set LimitLoss : SET LL" +
                    "\n______________________________";


                api.sendMessage(ct, event.threadID);
            } else {
                let text = "START";
                if (!STARTTOLL) {
                    text = "STOP";
                }
                if (CurrentOrder.isOpen) {

                    let ct ="______---❤💰💰💰💰❤---______" +
                        "\n👉🏼 Price Now___ : " + PriceNow +
                        "\n👉🏼 AvgPrice____ : " + CurrentOrder.avgEntryPrice.toFixed(2) +
                        "\n👉🏼 Quantity____ : " + CurrentOrder.currentQty.toFixed(2) +
                        "\n👉🏼 LiqPrice____ : " + CurrentOrder.liquidationPrice +
                        "\n👉🏼 Side________ : " + CurrentOrder.side +
                        "\n👉🏼 Count bet___ : " + CurrentOrder.CountBet +
                        "\n👉🏼 NextPullLoss : " + NexxtPullloss.toFixed(2) +
                        "\n👉🏼 CutProfit3__ : " + CutProfit2 +
                        "\n👉🏼 CutProfit1__ : " + CutProfit +
                        "\n👉🏼 Time _______ : " + ((new Date().getTime() - TimeStart) / 60000).toFixed(2) + "p" +
                        "\n👉🏼 BalanceDay__ : " + CurrentBalance +
                        "\n👉🏼 ProfitDay___ : " + ProfitDay;

                    api.sendMessage(ct, event.threadID);
                } else {
                    let ct = "💲Price now:" + PriceNow + "💲" +
                        "\n_____BOT___" + text + "______" +
                        "\n👉🏼 Waitting Order : " +

                        "\n👉🏼 BalanceDay : " + CurrentBalance +
                        "\n👉🏼 ProfitDay_ : " + ProfitDay;

                    api.sendMessage(ct, event.threadID);
                }
            }
        }
        else {
            api.sendMessage("💰💰💰_Bot Trade coin by suphuy_💰💰💰", event.threadID);
        }

    });


});                                        


