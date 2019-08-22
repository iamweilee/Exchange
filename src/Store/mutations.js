import * as types from "./mutation-types";
import { lStore } from "../common/utli";
export default {
    [types.SET_LANG](state, lang) {
        lStore.set("lang", lang);
        state.lang = lang;
    },
    [types.SET_USERINFO](state, userInfo) {
        if (userInfo) {
            lStore.set("userInfo", userInfo);
        } else {
            lStore.remove("userInfo");
        }
        state.userInfo = userInfo;
    },
    [types.SET_BALANCE](state, balance) {
        if (balance) {
            lStore.set("balance", balance);
        } else {
            lStore.remove("balance");
        }
        state.balance = balance;
    },
    setTabNav(state, val) {
        lStore.set("tabNav", val);
        state.tabNav = val;
    },
    [types.SET_TRADETYPE](state, tradeType) {
        if (tradeType) {
            lStore.set("tradeType", tradeType);
        } else {
            lStore.set("tradeType", false);
        }
        state.tradeType = tradeType;
    }
};
