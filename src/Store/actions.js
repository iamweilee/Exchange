import * as types from "./mutation-types";
import state from "./state";
import { Toast } from "vant";
import http from "common/Api";
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
    console.log(state.tradeType);
    http({
        url: "/v1/position/list",
        method: "get",
        data: { coinCode: state.tradeType ? "USDT" : "USDT_MOCK" }
    }).then(res => {
        if (res.status == 200) {
            let banlance = res.data[0];
            commit(types.SET_BALANCE, banlance);
        }
    });
};
const sendMsg = function(req) {
    http({
        url: "/auth/send_sms_all",
        data: req,
        method: "post"
    }).then(res => {
        if (res.status == 200) {
            Toast("验证码已发送！");
            req.fn();
        }
    });
};
export default {
    // 不请求直接异步改变
    updatedLang({ commit }, lang) {
        i18n.locale = lang[0].value;
        commit(types.SET_LANG, lang);
    },
    updatedUserInfo({ commit }, userInfo) {
        commit(types.SET_USERINFO, userInfo);
    },
    updatedBanlace({ commit }, Banlace) {
        commit(types.SET_BALANCE, Banlace);
    },
    setTradeType({ commit }, tradeType) {
        commit(types.SET_TRADETYPE, tradeType);
        getBanlace(commit);
    },
    //通过ajax 异步请求
    getUserInfo({ commit }) {
        getUserInfo(commit);
    },
    getBanlace({ commit }) {
        getBanlace(commit);
    },
    sendMsgComm({ commit }, req) {
        sendMsg(req);
    }
};
