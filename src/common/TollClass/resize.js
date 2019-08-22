import { addEvent, control } from "common/utli";
(function(doc, win) {
    var docEl = doc.documentElement,
        resizeEvt =
            "orientationchange" in window ? "orientationchange" : "resize",
        recalc = control(function() {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if (clientWidth >= 375) {
                docEl.style.fontSize = "50px";
            } else {
                docEl.style.fontSize =
                    Math.floor(100 * (clientWidth / 750)) + "px";
            }
        });
    if (!doc.addEventListener) return;
    addEvent(win, resizeEvt, recalc);
    addEvent(doc, "DOMContentLoaded", recalc);
})(document, window);
