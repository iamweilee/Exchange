var rp = require("request-promise").defaults({ json: true });

const api_root = "https://min-api.cryptocompare.com";
const history = {};

export default {
    getBars: function(symbolInfo, resolution, from, to, first, limit) {
        var split_symbol = symbolInfo.name.split(/[:/]/);
        console.log(resolution)
        const url =
            resolution === "D"
                ? "/data/histoday"
                : resolution >= 60
                ? "/data/histohour"
                : "/data/histominute";
        const qs = {
            e: split_symbol[0],
            fsym: split_symbol[1],
            tsym: split_symbol[2],
            toTs: from ? from : "",
            limit: limit ? limit : 100
            // aggregate: 1//resolution
        };
        // console.log({qs})

        return rp({
            url: `${api_root}${url}`,
            qs
        }).then(data => {
            if (data.Response && data.Response === "Error") {
                console.log("CryptoCompare API error:", data.Message);
                return [];
            }
            if (data.Data.length) {
                var bars = data.Data.map(el => {
                    return {
                        time: el.time * 1000, //TradingView requires bar time in ms
                        low: el.low,
                        high: el.high,
                        open: el.open,
                        close: el.close,
                        volume: el.volumefrom
                    };
                });
                console.log(bars[bars.length - 1])
                if (first) {
                    var lastBar = bars[bars.length - 1];
                    history[symbolInfo.name] = { lastBar: lastBar };
                }
                return bars;
            } else {
                return [];
            }
        });
    }
};
