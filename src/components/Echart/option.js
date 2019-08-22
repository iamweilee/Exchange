var upColor = "#F66464";
var downColor = "#1DBC8C";

function splitData(rawData) {
    var categoryData = [];
    var values = [];
    for (var i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i].splice(0, 1)[0]);
        values.push(rawData[i]);
    }
    return {
        categoryData: categoryData,
        values: values
    };
}

function calculateMA(dayCount, data) {
    var result = [];
    for (var i = 0, len = data.values.length; i < len; i++) {
        if (i < dayCount) {
            result.push("-");
            continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
            sum += data.values[i - j][1];
        }
        result.push(sum / dayCount);
    }
    return result;
}
var kpEn = "开盘";
var zdEn = "最低";
var spEn = "收盘";
var zgEn = "最高";
var cjlEn = "成交量";
function createOpt(data) {
    let option = {
        animation: false,
        title: {
            text: "",
            left: 0
        },
        tooltip: {
            trigger: "axis",
            formatter: function(params) {
                // console.log(params);
                let obj = {};
                if (params[0].value[0] !== undefined) {
                    // 防止放上去提示undefined
                    obj = {
                        sName: params[0].seriesName,
                        name: params[0].name,
                        start: params[0].value[0],
                        close: params[0].value[1],
                        low: params[0].value[2],
                        height: params[0].value[3],
                        vol: params[1].value
                    };
                } else {
                    obj = {
                        sName: params[1].seriesName,
                        name: params[1].name,
                        start: params[1].value[0],
                        close: params[1].value[1],
                        low: params[1].value[2],
                        height: params[1].value[3],
                        vol: params[0].value
                    };
                }
                console.log(params);
                // console.log(obj);
            }
        },

        grid: {
            left: "10",
            right: "46",
            bottom: "20",
            top:"0"
        },
        xAxis: {
            type: "category",
            data: data.categoryData,
            scale: true,
            boundaryGap: false,
            axisLine: { onZero: false },
            splitLine: { show: false },
            splitNumber: 20,
            min: "dataMin",
            max: "dataMax"
        },
        yAxis: {
            position: "right",
            scale: true,
            splitArea: {
                show: true
            }
        },
        dataZoom: [
            {
                type: "inside",
                start: 50,
                end: 100,
                zoomLock: true
            },
            {
                show: false,
                type: "slider",
                y: "90%",
                start: 50,
                end: 100,
                zoomLock: true
            }
        ],
        series: [
            {
                name: "日K",
                type: "candlestick",
                data: data.values,
                itemStyle: {
                    normal: {
                        color: upColor,
                        color0: downColor,
                        borderColor: upColor,
                        borderColor0: downColor
                    }
                },

                markLine: {
                    symbol: ["none", "none"],
                    data: [
                        [
                            {
                                symbol: "none",
                                x: "20",
                                yAxis: data.values[data.values.length - 1][0]
                            },
                            {
                                symbol: "circle",
                                label: {
                                    normal: {
                                        position: "end",
                                        formatter: "{c}"
                                    }
                                },
                                value: data.values[data.values.length - 1][0],
                                xAxis:
                                    data.categoryData[
                                        data.categoryData.length - 1
                                    ],
                                yAxis: data.values[data.values.length - 1][0]
                            }
                        ]

                        // {
                        //     name: "max line on close",
                        //     type: "max",
                        //     valueDim: "close"
                        // }
                    ]
                }
            },
            {
                name: "MA5",
                type: "line",
                symbol: "none",
                data: calculateMA(5, data),
                smooth: true,
                lineStyle: {
                    normal: { opacity: 0.5 }
                }
            },
            {
                name: "MA10",
                type: "line",
                symbol: "none",
                data: calculateMA(10, data),
                smooth: true,
                lineStyle: {
                    normal: { opacity: 0.5 }
                }
            },
            {
                name: "MA30",
                type: "line",
                symbol: "none",
                data: calculateMA(30, data),
                // smooth: true,
                lineStyle: {
                    normal: { opacity: 0.5 }
                }
            }
        ]
    };
    return option;
}

export { splitData, createOpt };
