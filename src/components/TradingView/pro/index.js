import historyProvider from "./historyProvider";
import stream from "./stream";
import { lStore } from "common/utli";
const supportedResolutions = ["1", "5", "15", "30", "60", "D", "W", "M"];

const config = {
  supported_resolutions: supportedResolutions
};

export default {
  onReady: cb => {
    console.log("=====onReady running");
    setTimeout(() => cb(config), 0);
  },
  searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
    console.log("====Search Symbols running");
  },
  resolveSymbol: (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback
  ) => {
    // expects a symbolInfo object in response
    console.log("======resolveSymbol running", symbolName);
    // console.log('resolveSymbol:',{symbolName})
    var split_data = symbolName.split(/[:/]/),
      pricescale = Math.pow(
        10,
        lStore.get("coinPrecision")[split_data[0]].tickLength
      );
    // console.log({split_data})
    var symbol_stub = {
      name: symbolName,
      type: "crypto",
      session: "24x7",
      timezone: "Asia/Shanghai",
      ticker: symbolName,
      minmov: 1,
      pricescale: 100,
      has_intraday: true,
      has_weekly_and_monthly: true,
      supported_resolution: supportedResolutions,
      volume_precision: 8,
      data_status: "streaming",
      supports_time: true,
    //   has_daily: true
    };
    symbol_stub.pricescale = pricescale;
    setTimeout(function() {
      onSymbolResolvedCallback(symbol_stub);
      console.log("Resolving that symbol....");
    }, 0);

    // onResolveErrorCallback('Not feeling it today')
  },
  getBars: function(
    symbolInfo,
    resolution,
    from,
    to,
    onHistoryCallback,
    onErrorCallback,
    firstDataRequest
  ) {
    console.log("=====getBars running");
    historyProvider
      .getBars(symbolInfo, resolution, from, to, firstDataRequest)
      .then(bars => {
          console.log(bars)
        if (bars.length) {
            bars = bars.sc
          onHistoryCallback(bars, { noData: false });
        } else {
          onHistoryCallback(bars, { noData: true });
        }
      })
      .catch(err => {
        onErrorCallback(err);
      });
  },
  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscribeUID,
    onResetCacheNeededCallback
  ) => {
    console.log("=====subscribeBars runnning");
    // stream.subscribeBars(
    //   symbolInfo,
    //   resolution,
    //   onRealtimeCallback,
    //   subscribeUID,
    //   onResetCacheNeededCallback
    // );
  },
  unsubscribeBars: subscriberUID => {
    console.log("=====unsubscribeBars running");

    stream.unsubscribeBars(subscriberUID);
  },
  calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
    //optional
    console.log("=====calculateHistoryDepth running", resolution);
    // while optional, this makes sure we request 24 hours of minute data at a time
    // CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data

    return undefined;
  },
  getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
    //optional
    console.log("=====getMarks running");
  },
  getTimeScaleMarks: (
    symbolInfo,
    startDate,
    endDate,
    onDataCallback,
    resolution
  ) => {
    //optional
    console.log("=====getTimeScaleMarks running");
  },
  getServerTime: cb => {
    console.log("=====getServerTime running");
  }
};
