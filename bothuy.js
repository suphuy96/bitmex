let bitmex = require("./bitmex.js").BitMEX;
const config = require('./config');
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
const BitmexClient = require('./bitmexlib/bitmexlib.js');
const TimeEnum = {
    ONE: 1,
    FIVE: 5,
    FIFTEEN: 15,
};
server.listen(port, function () {
    console.log('Server listening at port %d', port);
});
// var cookieParser = require('cookie-parser');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routeruser = require("./libexpress/user.js");
require('./libexpress/passport');
var session = require('express-session');
var localStrategy = require('passport-local').Strategy;
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
var flash = require('connect-flash');
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/', allowAdmins, function (req, res, next) {
    res.render('index', {title: 'Express'});
});
app.get('/demo', allowAdmins, function (req, res, next) {
    res.render('demo', {title: 'Express'});
})
app.get('/data', allowAdmins, function (req, res, next) {
    let data = ArDataClient;
    res.json(data);
})

function allowAdmins(req, res, next) {
    return next();
    // if(req.username=="bitmex")
    // {
    //         return next();
    // }else
    // res.redirect('/login');
}

app.use(routeruser);
var ArDataClient = [];
var ArRenDerChart = {};
var TimeAT = 0;
var ARsave = [];
var ARPoint = [];
var ARTG = [];
var ARTEMPPRICE = [];
var AROrDer = [];
var bietTG = 0;
var gdcp=0.2;
var lechnen=0.5;
var lechsma10=0.8;
var tilelech=50000;
var ArTrend1m=[];
var khoangdai=7;
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
// bien moi
var ArBollingerBands = [];

var period = 20;
var ArBIENDuoi = [];
var ArBIENTren = [];
var ArTrade1m = [];
var ArSMA10 = [];
var ArSMA20 = [];
var ArToast = [];
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
var isDemo = true;
var LastPrice = 0;
var PullValue = 0;
var BTC1d = {High: 0, Low: 0};

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
const fs = require("fs");
var FunSaveDataBaseSync = function (name, object) {
    fs.writeFileSync("data/" + name + '.json', JSON.stringify(object));
};
var FunSaveData = function (name, object, callback) {
    fs.writeFile("data/" + name + '.json', JSON.stringify(object), 'utf8', function read(err) {

        callback(err);
    });
};
var FunGetDataBaseSync = function (name) {
    if (!fs.existsSync("data/" + name + '.json')) {
        return null;
    }
    let t = null;
    try {
        t = JSON.parse(fs.readFileSync("data/" + name + '.json', 'utf8'));

    } catch (e) {
        t = null;
    }
    return t;
};
var FunGetDataBase = function (name, callback) {
    fs.exists("/path/to/file", function (exists) {
        if (exists)
            fs.readFile("data/" + name + '.json', function read(err, data) {
                if (err) {
                    callback(true, data);

                } else
                    callback(false, data);
            }); else
            callback(false, null);
    });


};
var CurrentSign = {
    BollingerBand: {
        top: {value: 0, trend: "__"},
        bottom: {value: 0, trend: "__"},
        middle: {value: 0, trend: "__"},
        trend: "",
        value: 0,
        note: "__"
    },
    Sma: {trend: "", sma10: {value: 0, trend: "__"}, sma20: {value: 0, trend: "__"}, value: 0, note: "__"},
    Volume: {trend: "", note: "__", value: 0, buy: {value: 0, trend: "__"}, sell: {value: 0, trend: "__"}},
    Price: {
        trend: "__",
        TG: "GIAM",
        L: 0,
        High: 0,
        Low: 0,
        time: new Date().getTime()
    },
    time: new Date().getTime(),
    trend: "__",
    note: "__",
    value: 0,
    status: {isTrade: false, side: "Buy", note: "__"}


};
var ArDD = [];
var ArSign = [];

var PriceRealTime = {high: 0, low: 0, close: 0, open: 0, buy: 0, sell: 0, size: 0, time: new Date().getTime()};

var Arname = [];
io.on('connection', function (socket) {
    if (ArDataClient.length == 0) {

        setTimeout(function () {
            FunSendSocket("datatrade1m", {
                data: ArDataClient,
                Bollinger: ArBollingerBands,
                Sma10: ArSMA10,
                Sma20: ArSMA20
            });
            FunSendSocket("dataMSA10", ArSMA10);
            FunSendSocket("dataToast", ArToast);
            FunSendSocket("dataMSA20", ArSMA20);
            FunSendSocket("BollingerBands", ArBollingerBands);
            FunSendSocket("dataTrend1m", ArTrend1m);
        }, 2960);

    } else {
        FunSendSocket("datatrade1m", {data: ArDataClient, Bollinger: ArBollingerBands, Sma10: ArSMA10, Sma20: ArSMA20});
        FunSendSocket("dataToast", ArToast);

        FunSendSocket("dataMSA10", ArSMA10);
        FunSendSocket("dataMSA20", ArSMA20);
        FunSendSocket("BollingerBands", ArBollingerBands);
        FunSendSocket("dataTrend1m", ArTrend1m);
    }
    socket.on('getdataTrend1m', function () {
        FunSendSocket("dataTrend1m", ArTrend1m);
    });
    socket.on('getdataToast', function () {
        FunSendSocket("dataToast", ArToast);
    });
    // FunSendSocket("DataBollingerBands", ArBIENTren);
    socket.on('DataBollingerBands', function () {
        FunSendSocket("BollingerBands", ArSMA10);
    });
    socket.on('getMSA10', function () {
        FunSendSocket("dataMSA10", ArSMA10);
    });
    socket.on('getMSA20', function () {
        FunSendSocket("dataMSA20", ArSMA20);
    });
    socket.on('getBienTren', function () {
        FunSendSocket("dataBienTren", ArBIENTren);
    });
    socket.on('getBienDuoi', function () {
        FunSendSocket("dataBienDuoi", ArBIENDuoi);
    });
    socket.on('gettrade1m', function () {
        console.log("gettrade1m");
        FunSendSocket("datatrade1m", {data: ArDataClient, Bollinger: ArBollingerBands, Sma10: ArSMA10, Sma20: ArSMA20});
    });
    socket.on('disconnect', function () {
        socket.broadcast.emit('user left', {
            TEXT: "THU"
        });
    });
});
var FunSendSocket = function (url, data) {
    io.sockets.emit(url, data);
}
var x = function (obj) {
    var str = Object.prototype.toString.call(obj);
    return str === '[object Array]' || str === '[object Array Iterator]';
};


// funsma
var FUNSMA = function (b, period, index) {
    var d = {index: index, period: period, standardDeviation: 2};
    var c = d.period, a = b.xData;
    b = b.yData;
    var e = b.length, f = 0, m = 0, h = [], k = [], l = [], g = -1, n;
    if (a.length < c) return !1;
    for (x(b[0]) && (g = d.index ? d.index : 0); f < c - 1;) m += 0 > g ? b[f] : b[f][g], f++;
    for (d = f; d < e; d++) m += 0 > g ? b[d] : b[d][g],
        n = [a[d], m / c], h.push(n), k.push(n[0]), l.push(n[1]), m -= 0 > g ? b[d - f] : b[d - f][g];
    return h
};
// get value
var ge = function (b, period) {
    var d = {index: 3, period: period, standardDeviation: 2};
    var c = d.period, a = b.xData;
    b = b.yData;
    var e = b.length, f = 0, m = 0, h = [], k = [], l = [], g = -1, n;
    if (a.length < c) return !1;
    for (x(b[0]) && (g = d.index ? d.index : 0); f < c - 1;) m += 0 > g ? b[f] : b[f][g], f++;
    for (d = f; d < e; d++) m += 0 > g ? b[d] : b[d][g],
        n = [a[d], m / c], h.push(n), k.push(n[0]), l.push(n[1]), m -= 0 > g ? b[d - f] : b[d - f][g];
    return {values: h, xData: k, yData: l}
}
// get BollingBans
var FunGetBollingerBands = function (a, period) {
    var c = {index: 3, period: period, standardDeviation: 2};
    var d = c.period, f = c.standardDeviation, e = a.xData, k = (a = a.yData) ? a.length : 0, m = [], b, h,
        g, q, n = [], u = [], v, l;
    if (e.length < d) return !1;
    v = x(a[0]);
    for (l = d; l <= k; l++) {
        q = e.slice(l - d, l);
        h = a.slice(l - d, l);
        b = ge({xData: q, yData: h}, period);
        q = b.xData[0];
        b = b.yData[0];
        g = 0;
        for (var w = h.length, r = 0, t; r < w; r++)
            t = (v ? h[r][c.index] : h[r]) - b, g += t * t;
        g = Math.sqrt(g / (w - 1));
        h = b + f * g;
        g = b - f * g;
        m.push([q, h, b, g]);
        // n.push(q);
        // u.push([h, b, g])
    }
    return m
};

var vvv = FunGetDataBaseSync("ArToast");
if (vvv != null) {
    ArToast = vvv;
}
vvv = FunGetDataBaseSync("ArFB");
if (vvv != null) {
    ArFB = vvv;
}

vvv = FunGetDataBaseSync("ArTrend1m");
if (vvv != null) {
    ArTrend1m = vvv;
}


vvv = FunGetDataBaseSync("ArSign");
if (vvv != null) {
    ArSign = vvv;
}
vvv = FunGetDataBaseSync("ArFBRT");
if (vvv != null) {
    ArFBRT = vvv;
}

vvv = FunGetDataBaseSync("ThongSo");
if (vvv != null) {
    let thu = vvv;
    // ThongSo=vvv;
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
vvv = FunGetDataBaseSync("CurrentOrder");
if (vvv != null) {
    CurrentOrder = vvv;
    if (isNaN(CurrentOrder.currentQty) || CurrentOrder.currentQty == null) {
        CurrentOrder.currentQty = 10;
    }
}
var FunSendFB = function (type, content) {
    if (Botfb != null) {
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
// get data 1m
var DataBucketed = FunGetDataBaseSync("DataBucketed");

var ArDataGE = [];
bitmex.GetTradeBucketed().then((datane) => {
    // console.log(data);
    // FunSendSocket("trade1m",data)
    ArTrade1m = [];
    let data = [];
    if (DataBucketed != null && DataBucketed.length > 0) {
        console.log("_________check dataofilne_________")
        let index = 0;
        let hieu = new Date(datane[0].timestamp).getTime() - new Date(DataBucketed[0].timestamp).getTime();
        console.log(hieu)
        index = (hieu / 300000);
        console.log(index)
        if (index < 200 && index > 0) {
            // console.log("ghép dữ liệu cũ"+index);
            data = DataBucketed;
            for (let i = index - 1; i > 0; i--) {
                data.unshift(datane[i])
            }
            console.log("dữ liệu ghép" + data.length);
        } else {
            if (index == 0) {
                data = DataBucketed;
            } else
                data = datane;
        }
    } else {
        data = datane;

    }
    DataBucketed = data;
    FunSaveDataBaseSync("DataBucketed", data);
    let temp = data;
    ArRenDerChart.xData = [];
    ArRenDerChart.yData = [];
    for (let i = data.length - 1; i > 0; i--) {
        ArTrade1m.push(data[i]);
        ArDataGE.push(data[i]);
        ArRenDerChart.xData.push(new Date(data[i].timestamp).getTime());
        ArRenDerChart.yData.push([data[i].open, data[i].high, data[i].low, data[i].close, data[i].volume]);
        ArDataClient.push([new Date(data[i].timestamp).getTime(), data[i].open, data[i].high, data[i].low, data[i].close, data[i].volume]);
    }

    console.log("_________render___________________")  ;
    if (ArRenDerChart.xData.length > 0) {
        ArBollingerBands = FunGetBollingerBands(ArRenDerChart, period);
        ArSMA10 = FUNSMA(ArRenDerChart, 10, 3);
        ArSMA10.splice(0,10);
        ArSMA20 = FUNSMA(ArRenDerChart, 20, 3);
        // check bollingerband
        ///
        FunSaveData("ArRenDerChart", ArRenDerChart, function (err) {
            console.log("savefile " + err);
        })
        FunSaveData("ArBollingerBands", ArBollingerBands, function (err) {
            console.log("savefile " + err);
        })
        FunSaveData("ArSMA10", ArSMA10, function (err) {
            console.log("savefile " + err);
        })
        FunSaveData("ArSMA20", ArSMA20, function (err) {
            console.log("savefile " + err);
        })
    }

    console.log("_________send data 1m___________________")
})
;


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
        if (DataBucketed.length > 3000) {
            DataBucketed.slice(DataBucketed.length - 1000, 1000)
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
        let t = 0;
    } else {
        CurrentOrder.CountBet = countne;
    }
}
FunWait();
var FunOrder = function () {
    console.log("________order_________");
    ActiveTrade = false;
    if (ArOrderSK.length > 0) {
        bitmex.deleteAllOrder().then((data) => {
            console.log("Phai xoa cai cu");
            FunCHUY();
            FunORMORE();
        });
    } else {
        FunORMORE();
    }
    // bitmex.deleteAllOrder().then((data) => {   });
};
var FunORMORE = function () {
    if (!isDemo)
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
            }
            if (startPriceOrder <= 0) {
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

                FunSaveData("CurrentOrder", CurrentOrder, function () {

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
        FunSaveData("CurrentOrder", CurrentOrder, function () {

        });
        countorder = 0;
        ArPull = [];

    });
};

bitmex.getBalance().then((balance) => {
    console.log(balance);
    StartBalance = balance;
    CurrentBalance = balance;
    startOrder = StartBalance;
});
var TimeA = new Date().getTime();
console.log(TimeA);

let nene = FunGetDataBaseSync("CurrentOrder");

if (nene != null) {
    CurrentOrder = nene;
    if (isNaN(CurrentOrder.currentQty) || CurrentOrder.currentQty == null) {
        CurrentOrder.currentQty = 10;
    }
}

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
            }, 3999);
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
            FunSaveData("CurrentOrder", CurrentOrder, function () {

            });
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

client.addStream('XBTUSD', 'tradeBin5m', data => {
    let lastCandle = data[data.length - 1];
    if (lastCandle != null && ArDataClient.length != 0 && new Date(DataBucketed[0].timestamp).getTime() != new Date(lastCandle.timestamp).getTime()) {
        BTC1d = {High: lastCandle.high, Low: lastCandle.low};
        ArTrade1m.push(lastCandle)
        // console.log();
        // console.log(lastCandle)
        if (DataBucketed.length > 0 && new Date(DataBucketed[0].timestamp).getTime() + 300000 == new Date(lastCandle.timestamp).getTime()) {

            DataBucketed.unshift(lastCandle);

            FunSaveDataBaseSync("DataBucketed", DataBucketed);

        }
        console.log("______trade1m___________________")
        PriceRealTime.high = 0;
        PriceRealTime.low = 0;
        PriceRealTime.open = 0;
        PriceRealTime.buy = 0;
        PriceRealTime.sell = 0;
        PriceRealTime.size = 0;
        TimeAT = new Date(lastCandle.timestamp).getTime();
        ArDataClient.push([new Date(lastCandle.timestamp).getTime(), lastCandle.open, lastCandle.high, lastCandle.low, lastCandle.close, lastCandle.volume]);
        console.log("do dai" + ArDataClient.length);

        ArRenDerChart.xData.push(new Date(lastCandle.timestamp).getTime());
        ArRenDerChart.yData.push([lastCandle.open, lastCandle.high, lastCandle.low, lastCandle.close, lastCandle.volume]);

        let ArDataTam = {};
        ArDataTam.yData = [];
        ArDataTam.xData = [];
        for (let i = ArRenDerChart.xData.length - period; i < ArRenDerChart.xData.length; i++) {
            ArDataTam.xData.push(ArRenDerChart.xData[i]);
            ArDataTam.yData.push(ArRenDerChart.yData[i]);
        }
        let ArtamSma10 = {};
        ArtamSma10.xData = [];
        ArtamSma10.yData = [];
        for (let i = ArRenDerChart.xData.length - 10; i < ArRenDerChart.xData.length; i++) {
            ArtamSma10.xData.push(ArRenDerChart.xData[i]);
            ArtamSma10.yData.push(ArRenDerChart.yData[i]);
        }
        // console.log(ArRenDerChart);
        let temsma10 = FUNSMA(ArtamSma10, 10, 0);
        let ArtamSma20 = {};
        ArtamSma20.xData = [];
        ArtamSma20.yData = [];
        for (let i = ArRenDerChart.xData.length - 20; i < ArRenDerChart.xData.length; i++) {
            ArtamSma20.xData.push(ArRenDerChart.xData[i]);
            ArtamSma20.yData.push(ArRenDerChart.yData[i]);
        }
        let temsma20 = FUNSMA(ArtamSma20, 20, 0);
        // console.log(ArDataTam);
        let temp = FunGetBollingerBands(ArDataTam, period);
        ArBollingerBands.push(temp[0]);
        ArSMA10.push(temsma10[0]);
        ArSMA20.push(temsma20[0]);
        // console.log(temp[0])   ;
        let temmm=0;
        let temmmmm="__";
        if(DataBucketed.length>1){
            temmm=DataBucketed[0].volume-DataBucketed[1];
            if(temmm>tilelech){
                temmmmm="TANG";
            } else if(temmm<-tilelech){

                temmmmm="GIAM";
            }
        }

        let CurrentSignn = {
            BollingerBand: {
                top: {value: 0, trend: "__"},
                bottom: {value: 0, trend: "__"},
                middle: {value: 0, trend: "__"},
                trend: "",
                value: 0,
                note: "__"
            },
            Sma: {trend: "", sma10: {value: 0, trend: "__"}, sma20: {value: 0, trend: "__"}, value: 0, note: "__"},
            Volume: {trend:temmmmm, note: "__", value: temmm,size: lastCandle.volume},
            Price: {
                trend: "__",
                TG: "GIAM",
                L: 0,
                High: 0,
                Low: 0,
                time: new Date().getTime()
            },
            time: new Date().getTime(),
            trend: "__",
            note: "__",
            value: 0,
            status: {isTrade: false, side: "Buy", note: "__"}
        };

        var CurrentTrend = {
            middle: {trend: "__", value: 0, count: 0},
            bb:{tren:ArBollingerBands[ ArBollingerBands.length - 1][1],duoi:ArBollingerBands[ ArBollingerBands.length - 1][3]},
            sma: {
                sma10: {value: 0, trend: "__", count: 0},
                sma20: {value: 0, trend: "__", count: 0},
                trend: "__",
                count: 0,
                type:"__",
                value:0
            },
            Nen:{value:0,trend:"__",count:0,name:"",type:"__"},
            time: new Date(lastCandle.timestamp).getTime()
        };
        //top 1 bottom 3
        for (let i = ArBollingerBands.length - 1; i > ArBollingerBands.length - khoangdai; i--) {
            console.log("___ lặp __");
            if (ArBollingerBands[i][2] - ArBollingerBands[i - 1][2] > 0 || (ArBollingerBands[i][2] - ArBollingerBands[i - 1][2] > -gdcp && CurrentTrend.middle.count > 0)) {
                if (CurrentTrend.middle.count == 0 || CurrentTrend.middle.trend == "TANG") {
                    CurrentTrend.middle.count++;
                    CurrentTrend.middle.trend = "TANG";
                    console.log("___ tăng __")

                    CurrentTrend.middle.value += ArBollingerBands[i][2] - ArBollingerBands[i - 1][2];
                } else {
                    console.log("___ br1 __")

                    break;
                }
            } else if (ArBollingerBands[i][2] - ArBollingerBands[i - 1][2] < 0 || (ArBollingerBands[i][2] - ArBollingerBands[i - 1][2] < gdcp && CurrentTrend.middle.count > 0)) {
                if (CurrentTrend.middle.count == 0 || CurrentTrend.middle.trend == "GIAM") {
                    CurrentTrend.middle.count++;
                    console.log("___ giảm __")

                    CurrentTrend.middle.trend = "GIAM";
                    CurrentTrend.middle.value +=  ArBollingerBands[i - 1][2] - ArBollingerBands[i][2];
                } else {
                    console.log("___ brc __")

                    break;
                }
            } else {
                break;
            }
        }

        for (let i = ArSMA10.length - 1; i > ArSMA10.length - khoangdai; i--) {
            console.log("___ lặp __")
            if (ArSMA10[i][1] - ArSMA10[i - 1][1] > 0 || (ArSMA10[i][2] - ArSMA10[i - 1][1] > -gdcp && CurrentTrend.sma.sma10.count > 0)) {
                if (CurrentTrend.sma.sma10.count == 0 || CurrentTrend.sma.sma10.trend == "TANG") {
                    CurrentTrend.sma.sma10.count++;
                    CurrentTrend.sma.sma10.trend = "TANG";
                    console.log("___ tăng __")

                    CurrentTrend.sma.sma10.value += ArSMA10[i][1] - ArSMA10[i - 1][1];
                } else {
                    console.log("___ br1 __");

                    break;
                }
            } else if (ArSMA10[i][1] - ArSMA10[i - 1][1] < 0 || (ArSMA10[i][1] - ArSMA10[i - 1][1] < gdcp && CurrentTrend.sma.sma10.count > 0)) {
                if (CurrentTrend.sma.sma10.count == 0 || CurrentTrend.sma.sma10.trend == "GIAM") {
                    CurrentTrend.sma.sma10.count++;
                    console.log("___ giảm __")

                    CurrentTrend.sma.sma10.trend = "GIAM";
                    CurrentTrend.sma.sma10.value += ArSMA10[i - 1][1] - ArSMA10[i][1];
                } else {
                    console.log("___ brc __");

                    break;
                }
            } else {
                break;
            }
        }




        for (let i = ArSMA20.length - 1; i > ArSMA20.length - khoangdai; i--) {
            console.log("___ lặp __");
            if (ArSMA20[i][1] - ArSMA20[i - 1][1] > 0 || (ArSMA20[i][2] - ArSMA20[i - 1][1] > -gdcp && CurrentTrend.sma.sma20.count > 0)) {
                if (CurrentTrend.sma.sma20.count == 0 || CurrentTrend.sma.sma20.trend == "TANG") {
                    CurrentTrend.sma.sma20.count++;
                    CurrentTrend.sma.sma20.trend = "TANG";
                    console.log("___ tăng __")

                    CurrentTrend.sma.sma20.value += ArSMA20[i][1] - ArSMA20[i - 1][1];
                } else {
                    console.log("___ br1 __")

                    break;
                }
            } else if (ArSMA20[i][1] - ArSMA20[i - 1][1] < 0 || (ArSMA20[i][1] - ArSMA20[i - 1][1] < gdcp && CurrentTrend.sma.sma20.count > 0)) {
                if (CurrentTrend.sma.sma20.count == 0 || CurrentTrend.sma.trend == "GIAM") {
                    CurrentTrend.sma.sma20.count++;
                    console.log("___ giảm __")

                    CurrentTrend.sma.sma20.trend = "GIAM";
                    CurrentTrend.sma.sma20.value += ArSMA20[i - 1][1] - ArSMA20[i][1];
                } else {
                    console.log("___ brc __");

                    break;
                }
            } else {
                break;
            }
        }


        for (let i = ArSMA20.length - 1; i > ArSMA20.length - khoangdai*2; i--) {
            console.log("___ lặp __");
            if (ArSMA10[i][1] - ArSMA20[i][1] > gdcp) {
                if (CurrentTrend.sma.count == 0 || CurrentTrend.sma.trend == "TREN") {
                    CurrentTrend.sma.count++;
                    CurrentTrend.sma.trend = "TREN";
                    console.log("___ tăng __");
                    if (CurrentTrend.sma.count == 0)
                        CurrentTrend.sma.value += ArSMA10[i][1] - ArSMA20[i][1];
                } else {
                    console.log("___ br1 __");

                    break;
                }
            } else if (ArSMA10[i][1] - ArSMA20[i][1] < -gdcp) {
                if (CurrentTrend.sma.count == 0 || CurrentTrend.sma.trend == "DUOI") {
                    CurrentTrend.sma.count++;
                    console.log("___ giảm __");
                    CurrentTrend.sma.trend = "DUOI";
                    if (CurrentTrend.sma.count == 0)
                        CurrentTrend.sma.value += ArSMA20[i][1] - ArSMA10[i][1];
                } else {
                    console.log("___ brc __");

                    break;
                }
            } else {
                break;
            }

        }


        let biendongsmatang=false;
        let biendongsmagiam=false;
        if(ArTrend1m.length>1){
            let beforeTrend=ArTrend1m[ArTrend1m.length-1];
            if ((CurrentTrend.sma.trend=="TREN" && beforeTrend.sma.trend =="DUOI")) {
                if((CurrentTrend.sma.sma10.trend=="TANG" && CurrentTrend.sma.sma10.value>lechsma10) ||  ( CurrentTrend.sma.sma20=="GIAM"  && CurrentTrend.sma.sma20.value>lechsma10))
                    CurrentTrend.sma.type="CHUANBICAT";
            }else if (CurrentTrend.sma.trend == "__" && beforeTrend.sma.trend =="DUOI"){
                if((CurrentTrend.sma.sma10.trend=="TANG" && CurrentTrend.sma.sma10.value>lechsma10) ||  ( CurrentTrend.sma.sma20=="GIAM"  && CurrentTrend.sma.sma20.value>lechsma10))
                    CurrentTrend.sma.type="CHUANBICAT";
            }  else
            if( CurrentTrend.sma.trend=="DUOI" && beforeTrend.sma.trend =="TREN" ){
                if((CurrentTrend.sma.sma10.trend=="GIAM" && CurrentTrend.sma.sma10.value>lechsma10) ||  ( CurrentTrend.sma.sma20=="TANG"  && CurrentTrend.sma.sma20.value>lechsma10))
                    CurrentTrend.sma.type="CHUANBICAT";
            } else if (CurrentTrend.sma.trend=="__" && beforeTrend.sma.trend =="TREN"){
                if((CurrentTrend.sma.sma10.trend=="GIAM" && CurrentTrend.sma.sma10.value>lechsma10) || ( CurrentTrend.sma.sma20=="TANG"  && CurrentTrend.sma.sma20.value>lechsma10))
                    CurrentTrend.sma.type="CHUANBICAT";
            }
        }


        let thannen=lastCandle.open -lastCandle.close;
        if(thannen<0)
            thannen *=-1;
        let nentruoc=DataBucketed[DataBucketed.length-2];
        if(lastCandle.open<lastCandle.close){
            CurrentTrend.Nen.trend="TANG";
            CurrentTrend.Nen.count=1;
            CurrentTrend.Nen.value=lastCandle.close- nentruoc.close;
            if(lastCandle.close>lastCandle.high-lechnen && lastCandle.open<lastCandle.low+lechnen){
                CurrentTrend.Nen.type="MARUBOZU";

            }else if( lastCandle.close==lastCandle.high ){
                if((thannen> (lastCandle.high-lastCandle.low)/4 )&&( thannen< (lastCandle.high-lastCandle.low)/3)){
                    CurrentTrend.Nen.type="HAMMER";
                }
            }

        } else   if(lastCandle.close==lastCandle.close){
            CurrentTrend.Nen.trend="__";
        }
        else   if(lastCandle.close<lastCandle.open){
            CurrentTrend.Nen.trend="GIAM";
            if(lastCandle.open>lastCandle.high-lechnen && lastCandle.close<lastCandle.low+lechnen){
                CurrentTrend.Nen.type="MARUBOZU";
            } else if( lastCandle.open==lastCandle.high ){
                if((thannen> (lastCandle.high-lastCandle.low)/4 )&&( thannen< (lastCandle.high-lastCandle.low)/3)){
                    CurrentTrend.Nen.type="HAMMER";
                }
            }
            CurrentTrend.Nen.count=1;
            CurrentTrend.Nen.value= nentruoc.close-lastCandle.close;
        }


        {
            if((thannen> (lastCandle.high-lastCandle.low)/4 )&&( thannen< (lastCandle.high-lastCandle.low)/3)){
                CurrentTrend.Nen.type="SPINNINGTOPS";
            }
        }

        //     if(lastCandle.close-lastCandle.open>-0.7  lastCandle.close-lastCandle.open<0.7){
        //
        // }
        // if(lastCandle.close)

        for (let i = ArTrend1m.length - 1; i > ArTrend1m.length - khoangdai*2; i--) {
            if (CurrentTrend.Nen.trend ==CurrentTrend.Nen.trend) {
                CurrentTrend.Nen.count++;
            } else {
                break;
            }
        }



        // for (let i = 0; i < ; i++) {
        //
        // }

        console.log(CurrentTrend);

        ArTrend1m.push(CurrentTrend);
        FunSaveData("ArTrend1m",ArTrend1m,function(){} );
        //
        // if(CurrentTrend.middle.trend!="__"){
        //     let toasttem = {
        //         y: lastCandle.close,
        //         type: "INFO",
        //         name: "Middle",
        //         connent: "bollinderband xu hướng" + CurrentTrend.middle.trend + " :" + CurrentTrend.middle.value,
        //         time: new Date().getTime(),
        //         value: CurrentTrend.middle.value
        //     };
        //     FunSendSocket("Toast", toasttem);
        //     ArToast.push(toasttem);
        // }




        FunSendSocket("Trend1m", CurrentTrend);

        FunSaveData("ArToast", ArToast, function () {
        });

        FunSendSocket("trade1m", {
            data: [new Date(lastCandle.timestamp).getTime(), lastCandle.open, lastCandle.high, lastCandle.low, lastCandle.close, lastCandle.volume],
            Bollinger: temp[0], Sma10: temsma10[0], Sma20: temsma20[0]
        });


        console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++bin1D");


    }
    // console.log(BTC1d)   ;
});
let temp = {};
client.addStream('XBTUSD', 'trade', data => {

    let lastCandle = data[data.length - 1];
    let {
        side,
        size,
        timestamp,
        price
    } = lastCandle;

    if (price > PriceRealTime.high || PriceRealTime.high == 0) {
        PriceRealTime.low = price;
    }
    if (price < PriceRealTime.low || PriceRealTime.low == 0) {
        PriceRealTime.low = price;
    }
    PriceRealTime.close = price;
    if (PriceRealTime.open == 0)
        PriceRealTime.open = price;

    for (let i = 0; i < data.length; i++) {
        if (data[i].side == "Buy") {
            PriceRealTime.buy += data[i].size;
        } else {
            PriceRealTime.sell += data[i].size;
        }
        PriceRealTime.size += data[i].size;
    }

    //set Price now;
    let TimeB = new Date().getTime();


    let ArDataTam = {};
    ArDataTam.yData = [];
    ArDataTam.xData = [];
    for (let i = ArRenDerChart.xData.length - period + 1; i < ArRenDerChart.xData.length; i++) {
        ArDataTam.xData.push(ArRenDerChart.xData[i]);
        ArDataTam.yData.push(ArRenDerChart.yData[i]);
    }
    // ArRenDerChart.xData[ArRenDerChart.xData.length-1
    let tempdate = TimeAT + 300000;
    ArDataTam.xData.push(tempdate);
    ArDataTam.yData.push([PriceRealTime.open, PriceRealTime.high, PriceRealTime.low, PriceRealTime.close, PriceRealTime.size]);
    // console.log(ArRenDerChart);

    // console.log(ArDataTam);
    let temp = FunGetBollingerBands(ArDataTam, period);


    FunSendSocket("trade", {price: PriceRealTime, Bollinger: temp[0]});
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








            var lydo="" ;


            /////////////////
            if (ActiveTrade)
                if (!CurrentOrder.isOpen) {
                    // dự đoán tăng giảm để vào lệnh

                    var beforeTrend=ArTrend1m[ArTrade1m.length-2];
                    let istradenow=false;

                    if(CurrentTrend.length>1){
                        var CurrentTrend=ArTrend1m[ArTrade1m.length-1];

                        if( price<CurrentTrend.bb.duoi   && CurrentTrend.volume.trend !="__" && CurrentTrend.sma.type=="CHUANBICAT" &&temp.TG=="TANG" )     {
                            istradenow=true;
                            lydo=" giá thấp hơn biên dưới | volume tăng | giá có xu hướng tăng";
                        }
                        if( (price>CurrentTrend.bb.tren  ) && CurrentTrend.volume.trend!="__" && CurrentTrend.sma.type=="CHUANBICAT"  &&temp.TG=="GIAM" )   {
                            istradenow=true;
                            lydo=" giá cao hơn biên trên | volume tăng | giá có xu hướng giảm";
                        }
                    }

                    if (temp.TG != "__" && istradenow) {
                        FunSendSocket("UpDown", temp);

                        ArToast.push({
                            y: price,
                            type: "INFO",
                            name: temp.TG,
                            connent: temp.L,
                            time: new Date().getTime()
                        });
                        FunSaveData("ArToast", ArToast, function () {
                        });


                        console.log(temp);
                        console.log("_________" + ActiveTrade + "______" + waitOrder);
                        console.log(parseFloat(temp.L) > parseFloat(Deviation));

                        if ((parseFloat(temp.L) > parseFloat(Deviation) ) )
                        {
                            FunSendSocket("Toast", {
                                y: price,
                                type: "INFO",
                                name: "Lệnh",
                                connent: "Chuẩn bị vào lệnh" +lydo ,
                                value: temp.L,
                                time: new Date().getTime()
                            });
                            ArToast.push({
                                y: price,
                                type: "INFO",
                                name: "Lệnh",
                                connent: "Chuẩn bị vào lệnh",
                                time: new Date().getTime()
                            });
                            FunSaveData("ArToast", ArToast, function () {
                            });
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

                            FunSaveData("CurrentOrder", CurrentOrder, function () {

                            });
                            TimeStart = new Date().getTime();
                            ThongSo.TimeStart = TimeStart;

                            FunSaveData("ThongSo", ThongSo, function () {

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

                                        FunSaveData("CurrentOrder", CurrentOrder, function () {
                                        });
                                        TimeStart = new Date().getTime();
                                        ThongSo.TimeStart = TimeStart;

                                        ArToast.push({
                                            y: price,
                                            type: "Wait",
                                            name: "Lệnh",
                                            connent: "Chuẩn bị vào lệnh",
                                            time: new Date().getTime()
                                        });

                                        FunSendSocket("Toast", {
                                            y: price,
                                            type: "INFO",
                                            name: "Lệnh",
                                            connent: "Chuẩn bị vào lệnh",
                                            value: temp.L,
                                            time: new Date().getTime()
                                        });


                                        FunSaveData("ArToast", ArToast, function () {
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
                                            // console.log("dan roi làm điều không thể làm thôi làm ")
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
                        TruePull = true;

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
                                if (lon - be > 3) {
                                    console.log("______chan bom them________");

                                    TruePull = false;
                                } else {
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
                    if (TruePull) {
                        console.log("_________cho bơm")
                    } else {
                        console.log("_________chặn bơm bơm bơm" + PriceNow)

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
                        } else {

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
                    if (TruePull) {
                        console.log("_________cho bơm")
                    } else {
                        console.log("_________chặn bơm bơm bơm" + PriceNow)

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


            FunSaveData("ArFB", ArFB, function () {

            });

        } else if (event.body.toUpperCase() === 'STOP' || event.body.toUpperCase() === 'S') {
            if (ArFB.indexOf(event.threadID) >= 0) {
                ArFB.splice(ArFB.indexOf(event.threadID), 1)

            }
            if (ArFBRT.indexOf(event.threadID) >= 0) {
                ArFBRT.splice(ArFBRT.indexOf(event.threadID), 1)
            }

            FunSaveData("ArFBRT", ArFBRT, function () {

            });
            FunSaveData("ArFB", ArFB, function () {

            });
            api.sendMessage("❤️❤️Goodbye…..", event.threadID);
        } else if (ArFB.indexOf(event.threadID) >= 0) {
            if (event.body.toUpperCase() === "RT") {
                if (ArFBRT.indexOf(event.threadID) == -1) {
                    ArFBRT.push(event.threadID);
                    api.sendMessage("❤️Bạn vừa kết nối Realtime❤️", event.threadID);


                } else
                    api.sendMessage("❤️Đã kết nối Realtime❤️", event.threadID);

                FunSaveData("ArFBRT", ArFBRT, function () {

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
                        FunSaveData("ThongSo", ThongSo, function () {

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
                        FunSaveData("ThongSo", ThongSo, function () {

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
                        FunSaveData("ThongSo", ThongSo, function () {

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
                        FunSaveData("ThongSo", ThongSo, function () {

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
                        FunSaveData("ThongSo", ThongSo, function () {

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
                        FunSaveData("ThongSo", ThongSo, function () {

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
                        FunSaveData("ThongSo", ThongSo, function () {

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
                var startPriceOrder = 0;
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

            } else if (event.body.toUpperCase() === "huyhuy") {
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

                    let ct = "______---❤💰💰💰💰❤---______" +
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


