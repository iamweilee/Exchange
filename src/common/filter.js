import Vue from "vue";
import { toFixeds, numberFormat } from "./TollClass/func";
import avatar from "Images/avatar.jpg";
function avatarFun(Img) {
    if (Img) {
        return Img;
    } else {
        return avatar;
    }
}
Vue.filter("numberFormat", numberFormat); //数字格式化
Vue.filter("toFixeds", toFixeds); //保留小数
Vue.filter("avatarFun", avatarFun);
