//K线图的颜色设置
let upColor = '#F66464'
let upBorderColor = '#F66464'
let downColor = '#1DBC8C'
let downBorderColor = '#1DBC8C'

// 数据意义：时间，开盘(open)，收盘(close)，最低(lowest)，最高(highest)
let data = [
  ['2013/3/4', 2332.08, 2273.4, 2259.25, 2333.54],
  ['2013/3/5', 2274.81, 2326.31, 2270.1, 2328.14],
  ['2013/3/6', 2333.61, 2347.18, 2321.6, 2351.44],
  ['2013/3/7', 2340.44, 2324.29, 2304.27, 2352.02],
  ['2013/3/8', 2326.42, 2318.61, 2314.59, 2333.67],
  ['2013/3/11', 2314.68, 2310.59, 2296.58, 2320.96],
  ['2013/3/12', 2309.16, 2286.6, 2264.83, 2333.29],
  ['2013/3/13', 2282.17, 2263.97, 2253.25, 2286.33],
  ['2013/3/14', 2255.77, 2270.28, 2253.31, 2276.22],
  ['2013/3/15', 2269.31, 2278.4, 2250, 2312.08],
  ['2013/3/18', 2267.29, 2240.02, 2239.21, 2276.05],
  ['2013/3/19', 2244.26, 2257.43, 2232.02, 2261.31],
  ['2013/3/20', 2257.74, 2317.37, 2257.42, 2317.86],
  ['2013/3/21', 2318.21, 2324.24, 2311.6, 2330.81],
  ['2013/3/22', 2321.4, 2328.28, 2314.97, 2332],
  ['2013/3/25', 2334.74, 2326.72, 2319.91, 2344.89],
  ['2013/3/26', 2318.58, 2297.67, 2281.12, 2319.99],
  ['2013/3/27', 2299.38, 2301.26, 2289, 2323.48],
  ['2013/3/28', 2273.55, 2236.3, 2232.91, 2273.55],
  ['2013/3/29', 2238.49, 2236.62, 2228.81, 2246.87],
  ['2013/4/1', 2229.46, 2234.4, 2227.31, 2243.95],
  ['2013/4/2', 2234.9, 2227.74, 2220.44, 2253.42],
  ['2013/4/3', 2232.69, 2225.29, 2217.25, 2241.34],
  ['2013/4/8', 2196.24, 2211.59, 2180.67, 2212.59],
  ['2013/4/9', 2215.47, 2225.77, 2215.47, 2234.73],
  ['2013/4/10', 2224.93, 2226.13, 2212.56, 2233.04],
  ['2013/4/11', 2236.98, 2219.55, 2217.26, 2242.48],
  ['2013/4/12', 2218.09, 2206.78, 2204.44, 2226.26],
  ['2013/4/15', 2199.91, 2181.94, 2177.39, 2204.99],
  ['2013/4/16', 2169.63, 2194.85, 2165.78, 2196.43],
  ['2013/4/17', 2195.03, 2193.8, 2178.47, 2197.51],
  ['2013/4/18', 2181.82, 2197.6, 2175.44, 2206.03],
  ['2013/4/19', 2201.12, 2244.64, 2200.58, 2250.11],
  ['2013/4/22', 2236.4, 2242.17, 2232.26, 2245.12],
  ['2013/4/23', 2242.62, 2184.54, 2182.81, 2242.62],
  ['2013/4/24', 2187.35, 2218.32, 2184.11, 2226.12],
  ['2013/4/25', 2213.19, 2199.31, 2191.85, 2224.63],
  ['2013/4/26', 2203.89, 2177.91, 2173.86, 2210.58],
  ['2013/5/2', 2170.78, 2174.12, 2161.14, 2179.65],
  ['2013/5/3', 2179.05, 2205.5, 2179.05, 2222.81],
  ['2013/5/6', 2212.5, 2231.17, 2212.5, 2236.07],
  ['2013/5/7', 2227.86, 2235.57, 2219.44, 2240.26],
  ['2013/5/8', 2242.39, 2246.3, 2235.42, 2255.21],
  ['2013/5/9', 2246.96, 2232.97, 2221.38, 2247.86],
  ['2013/5/10', 2228.82, 2246.83, 2225.81, 2247.67],
  ['2013/5/13', 2247.68, 2241.92, 2231.36, 2250.85],
  ['2013/5/14', 2238.9, 2217.01, 2205.87, 2239.93],
  ['2013/5/15', 2217.09, 2224.8, 2213.58, 2225.19],
  ['2013/5/16', 2221.34, 2251.81, 2210.77, 2252.87],
  ['2013/5/17', 2249.81, 2282.87, 2248.41, 2288.09],
]

//处理数据，分别拿到分时图和K线图的数据
let lineData = sliceLineData(data)
let candleData = sliceCandleData(data)

function sliceCandleData (data) {
  let categoryData = []
  let values = []
  for (let i = 0; i < data.length; i++) {
    categoryData.push(data[i].slice(0, 1)[0]);
    values.push(data[i].slice(1))
  }
  return {
    categoryData: categoryData,
    values: values,
  }
}

function sliceLineData (data) {
  let categoryData = []
  let values = []
  for (let i = 0; i < data.length; i++) {
    categoryData.push(data[i].slice(0, 1)[0])
    values.push(data[i].slice(1, 2)[0])
  }
  return {
    categoryData: categoryData,
    values: values,
  }
}

//计算 MA 均线的数据
function calculateMA (dayCount) {
  let result = []
  for (let i = 0, len = candleData.values.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-')
      continue
    }
    let sum = 0
    for (let j = 0; j < dayCount; j++) {
      sum += candleData.values[i - j][1]
    }
    result.push(sum / dayCount)
  }
  return result
}

//面积图 图表设置
let lineSeries = [
  {
    type: 'line',
    data: lineData.values,
    smooth:true,
    itemStyle:{
      color:'#354162',
      opacity:0.1
    },
    lineStyle:{
      width:1,
      color:'#354162'
    },
    areaStyle: {
      color:'#EEEEEE'
    },
  },
]

//K线图 图表设置
let candleSeries = [
  {
    type: 'candlestick',
    data: candleData.values,
    // barWidth:5,
    itemStyle: {
      normal: {
        color: upColor,
        color0: downColor,
        borderColor: upBorderColor,
        borderColor0: downBorderColor,
      },
    },
  },
]

//共用的一些图表设置
let option = {
  grid: {
    top: 10,
    bottom: 20,
    left: 10,
    right: 10,
  },
  xAxis: {
    data: undefined,
    scale: true,
    axisLabel: {
      color: '#A0A0A0',
      fontSize: 10,
    },
    axisLine: {
      lineStyle: {
        color: '#A0A0A0',
      },
    },
  },
  yAxis: {
    scale: true,
    position: 'right',
    axisLabel: {
      color: '#A0A0A0',
      fontSize: 10,
      inside: true,
    },
    axisLine: {
      lineStyle: {
        color: '#A0A0A0',
      },
    },
    splitLine: {
      lineStyle: {
        color: '#EEEEEE',
      },
    },
  },
  series: undefined,
}


export default class chartUtil {
  static lineOption = () => {
    option.xAxis.data = lineData.categoryData
    option.series = lineSeries
    return option
  }

  static candleOption = () => {
    option.xAxis.data = candleData.categoryData
    option.series = candleSeries
    return option
  }
}