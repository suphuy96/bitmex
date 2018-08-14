const config = require('./data/thongso.json');
const unirest = require('unirest');
const crypto = require('crypto');

function bmHeaders(verb, path, postBody) {
    const expires = Date.now() + 60000;
    const signature = crypto
        .createHmac('sha256', config.api.secret)
        .update(verb + path + expires + postBody)
        .digest('hex');

    const headers = {
        'content-type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'api-expires': expires,
        'api-key': config.api.key,
        'api-signature': signature,
    };
    return headers;
}

const BitMEX = function BitMEX() {
};

BitMEX.prototype.init = function init() {
};

BitMEX.prototype.getBalance = function getBalance() {
    return new Promise((resolve, reject) => {
        const verb = 'GET';
        const path = '/api/v1/user/wallet';
        const headers = bmHeaders(verb, path, '');

        const request = unirest.get(config.api.resthost + path);
        request.header(headers).end((response) => {
            if (response.code === 200) return resolve(response.body.amount);
            return reject(response);
        });
    });
};


BitMEX.prototype.getOder = function getMarkPrice() {
    return new Promise((resolve, reject) => {
        const verb = 'GET';
        const path = '/api/v1/order';
        const b = {symbol: "XBTUSD", reverse: true};
        const body = JSON.stringify(b);
        const headers = bmHeaders(verb, path, body);

        const request = unirest.get(config.api.resthost + path);
        request
            .header(headers)
            .send(body)
            .end((response) => {
                if (response.code === 200) resolve(response.body);
                reject(response);
            });
    });
};
BitMEX.prototype.GetTradeBucketed = function GetTradeBucketed() {
    let nhuy = '1m';
    if (config.tradeBin == "tradeBin1m") {
        nhuy = "1m"
    } else if (config.tradeBin == "tradeBin5m") {
        nhuy = "5m"
    } else if (config.tradeBin == "tradeBin1h") {
        nhuy = "1h"
    } else {
        nhuy = "1d"
    }
    return new Promise((resolve, reject) => {
        const verb = 'GET';
        const path = '/api/v1/trade/bucketed';
        const b = {symbol: "XBTUSD", reverse: true, count: 200, binSize: nhuy};
        const body = JSON.stringify(b);
        const headers = bmHeaders(verb, path, body);

        const request = unirest.get(config.api.resthost + path);
        request
            .header(headers)
            .send(body)
            .end((response) => {
                if (response.code === 200) resolve(response.body);
                reject(response);
            });
    });
};
BitMEX.prototype.getOder = function getMarkPrice() {
    return new Promise((resolve, reject) => {
        const verb = 'GET';
        const path = '/api/v1/order';
        const b = {symbol: "XBTUSD", reverse: true, count: 100};
        const body = JSON.stringify(b);
        const headers = bmHeaders(verb, path, body);

        const request = unirest.get(config.api.resthost + path);
        request
            .header(headers)
            .send(body)
            .end((response) => {
                if (response.code === 200) resolve(response.body);
                reject(response);
            });
    });
};

BitMEX.prototype.adjustMargin = function adjustMargin(margin) {
    return new Promise((resolve, reject) => {
        const verb = 'POST';
        const path = '/api/v1/position/leverage';
        const data = {
            symbol: 'XBTUSD',
            leverage: margin,
        };
        const postBody = JSON.stringify(data);
        const headers = bmHeaders(verb, path, postBody);

        const request = unirest.post(config.api.resthost + path);
        request
            .header(headers)
            .send(postBody)
            .end((response) => {
                if (response.code === 200) return resolve(response);
                return reject(response);
            });
    });
};
BitMEX.prototype.GetListBalance = function GetListBalance() {
    return new Promise((resolve, reject) => {
        const verb = 'GET';
        const path = '/api/v1/user/walletHistory?count=100&start=0&reverse=true';
        const headers = bmHeaders(verb, path, '');

        const request = unirest.get(config.api.resthost + path);
        request.header(headers).end((response) => {
            if (response.code === 200) return resolve(false, response.body);
            console.log(response.body)
            return resolve(true, response.body);
        });
    });
};


BitMEX.prototype.GetListHighLow = function GetListHighLow() {
    return new Promise((resolve, reject) => {
        const verb = 'GET';
        const path = '/api/v1/user/walletHistory?count=100&start=0&reverse=true';
        const headers = bmHeaders(verb, path, '');

        const request = unirest.get(config.api.resthost + path);
        request.header(headers).end((response) => {
            if (response.code === 200) return resolve(false, response.body);
            console.log(response.body)
            return resolve(true, response.body);
        });
    });
};
BitMEX.prototype.marketOrder = function marketOrder(side, oorderQty, price) {
    return new Promise((resolve, reject) => {
        const verb = 'POST';
        const path = '/api/v1/order';
        const data = {
            symbol: 'XBTUSD',
            side: side,
            ordType: "Limit",
            orderQty: oorderQty,
            price: price
        };
        // console.log(data);
        const postBody = JSON.stringify(data);
        const headers = bmHeaders(verb, path, postBody);

        const request = unirest.post(config.api.resthost + path);
        request
            .header(headers)
            .send(postBody)
            .end((response) => {
                if (response.code === 200) return resolve(response);
                console.log(response.body);
                return reject(response);
            });
    });
};

BitMEX.prototype.adjustMargin = function adjustMargin(margin) {
    return new Promise((resolve, reject) => {
        const verb = 'POST';
        const path = '/api/v1/position/leverage';
        const data = {
            symbol: 'XBTUSD',
            leverage: margin,
        };
        const postBody = JSON.stringify(data);
        const headers = bmHeaders(verb, path, postBody);

        const request = unirest.post(config.api.resthost + path);
        request
            .header(headers)
            .send(postBody)
            .end((response) => {
                if (response.code === 200) return resolve(response);
                return reject(response);
            });
    });
};

BitMEX.prototype.closePosition = function closePosition(orderId) {
    return new Promise((resolve, reject) => {
        const verb = 'POST';
        const path = '/api/v1/order';
        const data = {
            orderID: orderId,
            symbol: 'XBTUSD',
            execInst: 'Close',

        };
        const postBody = JSON.stringify(data);
        const headers = bmHeaders(verb, path, postBody);

        const request = unirest.post(config.api.resthost + path);
        request
            .header(headers)
            .send(postBody)
            .end((response) => {
                if (response.code === 200) {
                    return resolve(response);
                }
                console.error('Error: position could not be closed');
                return reject(response);
            });
    });
};

BitMEX.prototype.closePositionLimit = function closePosition(orderId, price) {
    return new Promise((resolve, reject) => {
        const verb = 'POST';
        const path = '/api/v1/order';
        const data = {
            orderID: orderId,
            symbol: 'XBTUSD',
            execInst: 'Close',
            price: price

        };
        const postBody = JSON.stringify(data);
        const headers = bmHeaders(verb, path, postBody);

        const request = unirest.post(config.api.resthost + path);
        request
            .header(headers)
            .send(postBody)
            .end((response) => {
                if (response.code === 200) {
                    return resolve(response);
                }
                console.error('Error: position could not be closed');
                return reject(response);
            });
    });
};


BitMEX.prototype.deleteAllOrder = function deleteAllOrder() {
    return new Promise((resolve, reject) => {
        const verb = 'DELETE';
        const path = '/api/v1/order/all';
        const data = {
            symbol: 'XBTUSD'
        };
        const postBody = JSON.stringify(data);
        const headers = bmHeaders(verb, path, postBody);
        const request = unirest.delete(config.api.resthost + path);
        request
            .header(headers)
            .send(postBody)
            .end((response) => {
                if (response.code === 200) {
                    return resolve(response);
                }
                return resolve(response);
            });
    });
};


exports.BitMEX = new BitMEX();
