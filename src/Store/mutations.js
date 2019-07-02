import * as types from "./mutation-types";
import { lStore } from "../common/TollClass/func";
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
    setTabNav(state, val) {
        lStore.set("tabNav", val);
        state.tabNav = val;
    }
};
