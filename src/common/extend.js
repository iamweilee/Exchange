import Vue from "vue";
import http from "./Api";
import {
    addEvent,
    removeEvent,
    EventListener,
    control,
    lStore,
    sStore
} from "./utli";
import md5 from "md5";
function ScrollTop(anim = true) {
    if (anim) {
        let scrollToptimer = setInterval(function() {
            let top =
                document.body.scrollTop || document.documentElement.scrollTop;
            let speed = top / 4;
            if (document.body.scrollTop !== 0) {
                document.body.scrollTop -= speed;
            } else {
                document.documentElement.scrollTop -= speed;
            }
            if (top === 0) {
                clearInterval(scrollToptimer);
            }
        }, 30);
    } else {
        document.documentElement.scrollTop = 0;
    }
}
Vue.prototype.$ScrollTop = ScrollTop;
Vue.prototype.$lStore = lStore;
Vue.prototype.$sStore = sStore;
Vue.prototype.$control = control;
Vue.prototype.$http = http;
Vue.prototype.$EventListener = EventListener({});
Vue.prototype.$addEvent = addEvent;
Vue.prototype.$removeEvent = removeEvent;
Vue.prototype.$md5 = md5;
Vue.prototype.STATUS = 200;
Vue.directive("debounce", {
    bind(el, { value }) {
        const time = value.time || 300,
            method = value.method || "click",
            debounced = control(value.fn, time, 1);
        addEvent(el, method, debounced);
        el._debounced = debounced;
    },
    unbind(el, { value }) {
        const method = value.method || "click";
        removeEvent(el, method, el._debounced);
    }
});
