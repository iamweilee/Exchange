import http from "common/Api";
const history = {};

export default {
    history: history,
    getBars: function(symbolInfo, resolution, from, to, first, limit) {
        var split_symbol = symbolInfo.name.split(/[:/]/);
        // to = to * 1000;
        // console.log(resolution)
        if (resolution < 60) {
            resolution = resolution + "m";
        } else if (resolution == 60) {
            resolution = "1h";
        } else if (resolution == "1D") {
            resolution = "1d";
        } else if (resolution == "1W") {
            resolution = "1w";
        } else if (resolution == "1M") {
            resolution = "1M";
        } else {
            resolution = "5m";
        }
        const qs = {
            currency: split_symbol[0],
            base: split_symbol[1],
            openTime: to ? to : "",
            interval: resolution, //resolution
            pageSize: limit ? limit : 100
        };
        return http({
            url: "/v1/kline/findList",
            data: qs,
            name: "K线数据源",
            method: "get",
            baseApi: "test"
        }).then(res => {
            if (res.status == 200) {
                let resList = res.data;
                if (resList.length) {
                    let newList = resList.map(item => {
                        return {
                            time: item.openTime, //TradingView requires bar time in ms
                            low: item.low,
                            high: item.high,
                            open: item.open,
                            close: item.close,
                            volume: item.volume
                        };
                    });

                    let lastBar = newList[99];
                    console.log(lastBar);
                    history[symbolInfo.name] = {
                        lastBar: lastBar
                    };
                    console.log(history[symbolInfo.name]);
                    return resList;
                } else {
                    return [];
                }
            }
        });
    }
};
