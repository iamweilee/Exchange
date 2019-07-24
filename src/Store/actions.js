import * as types from "./mutation-types";
import { Toast } from "vant";
import http from "common/Api";
import { getBanner } from "./../common/http-req";
const getUserInfo = function(commit) {
    http({
        url: "/v1/user/user_info",
        method: "get"
    }).then(res => {
        if (res.status == 200) {
            commit(types.SET_USERINFO, res.data);
        }
    });
};

const getBanlace = function(commit) {
    http({
        url: "/v1/position/list",
        method: "get",
        data: { coinCode: "USDT" }
    }).then(res => {
        if (res.status == 200) {
            let banlance = res.data[0];
            commit(types.SET_BALANCE, banlance);
        }
    });
};
export default {
    // 不请求直接异步改变
    updatedLang({ commit }, lang) {
        i18n.locale = "zh";
        commit(types.SET_LANG, lang);
    },
    updatedUserInfo({ commit }, userInfo) {
        commit(types.SET_USERINFO, userInfo);
    },
    updatedBanlace({ commit }, Banlace) {
        commit(types.SET_BALANCE, Banlace);
    },
    //通过ajax 异步请求
    getUserInfo({ commit }) {
        getUserInfo(commit);
    },
    getBanlace({ commit }) {
        getBanlace(commit);
    }
};
