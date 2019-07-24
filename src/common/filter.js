import Vue from "vue";
import { numberFormat } from "./TollClass/func";
import { toFixeds, dateFormat, priceFormat } from "./utli";
import avatar from "Images/avatar.jpg";
function avatarFun(Img) {
    if (Img) {
        return Img;
    } else {
        return avatar;
    }
}
function statusType(status, detail) {
    if (detail) {
        switch (status) {
            case "1":
                return "申请中";
            case "2":
                return "申请中";
            case "3":
                return "已成功";
            case "4":
                return "已失效";
            case "9":
                return "已失效";
        }
    }
    switch (status) {
        case "1":
            return "申请中";
        case "2":
            return "付款审核中";
        case "3":
            return "审核成功";
        case "4":
            return "审核失败";
        case "9":
            return "已失效";
    }
}
Vue.filter("numberFormat", numberFormat); //数字格式化
Vue.filter("toFixeds", toFixeds); //保留小数
Vue.filter("dateFormat", dateFormat);
Vue.filter("priceFormat", priceFormat);
Vue.filter("avatarFun", avatarFun);
Vue.filter("statusType", statusType);
