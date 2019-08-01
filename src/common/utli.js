//判断数据类型的方法（对typeof的增强，7种常用类型的判断，返回小写字符串）

// 判断变量的类型
function dataType(obj) {
    var str = Object.prototype.toString.call(obj);
    var map = {
        "[object Boolean]": "boolean",
        "[object Number]": "number",
        "[object String]": "string",
        "[object Function]": "function",
        "[object Array]": "array",
        "[object Date]": "date",
        "[object RegExp]": "regExp",
        "[object Undefined]": "undefined",
        "[object Null]": "null",
        "[object Object]": "object"
    };
    if (obj !== obj) {
        return "nan";
    }
    if (obj instanceof Element) {
        //判断是否是dom元素，如div等
        return "element";
    }
    return map[str];
}

// function dataType(obj) {
//     if (obj === null) {
//         return "null";
//     }
//     if (obj !== obj) {
//         return "nan";
//     }
//     if (typeof Array.isArray === "function") {
//         if (Array.isArray(obj)) {
//             //浏览器支持则使用isArray()方法
//             return "array";
//         }
//     } else {
//         //否则使用toString方法
//         if (Object.prototype.toString.call(obj) === "[object Array]") {
//             return "array";
//         }
//     }
//     return (typeof obj).toLowerCase();
// }

//深拷贝函数
function deepCopy(p) {
    var obj;
    var str = getType(p);
    if (str == "array") {
        obj = [];
        for (var i = 0; i < p.length; i++) {
            obj.push(arguments.callee(p[i])); //回调自己
        }
    } else if (str == "object") {
        obj = {};
        for (var i in p) {
            obj[i] = arguments.callee(p[i]);
        }
    } else {
        return p;
    }
    return obj;
}

function addEvent(element, type, handler) {
    if (element.addEventListener) {
        //非IE浏览器采用dom2级事件处理，type为事件类型如：click，handler为事件处理函数，false代表事件采用冒泡处理模型，如果是true代表 采用捕获型处理模型
        //除了netbeans采用捕获型处理模型，其他都采用冒泡型处理模型
        //如果是非IE浏览器添加事件为：addEventListener
        element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
        //如果为IE浏览器，添加事件采用 attachEvent
        element.attachEvent("on" + type, handler);
    } else {
        element["on" + type] = handler;
    }
}

function removeEvent(element, type, handler) {
    if (element.removeEventListener) {
        //非IE浏览器采用dom2级事件处理，type为事件类型如：click，handler为事件处理函数，false代表事件采用冒泡处理模型，如果是true代表 采用捕获型处理模型
        //除了netbeans采用捕获型处理模型，其他都采用冒泡型处理模型
        //如果是非IE浏览器添加事件为：removeEventListener
        element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) {
        //如果为IE浏览器，添加事件采用 detachEvent
        element.detachEvent("on" + type, handler);
    } else {
        //dom0级事件处理，如果删除事件采用赋值null
        element["on" + type] = null;
    }
}

function stopEvent(event) {
    //停止事件冒泡
    if (event.stopProPagation) {
        event.stopProPagation();
    } else {
        event.cancelBubble = true;
    }
}
//事件监听
function EventListener(obj) {
    let Register = {};
    obj.on = function(name, method) {
        if (!Register.hasOwnProperty(name)) {
            Register[name] = [];
        }
        let handlerList = Register[name];
        let newArr = handlerList.filter(item => {
            if (item == method) {
                return;
            } else {
                return item;
            }
        });
        newArr.push(method);
        Register[name] = newArr;
    };
    obj.fire = function(name) {
        if (Register.hasOwnProperty(name)) {
            let handlerList = Register[name];
            for (let i = 0; i < handlerList.length; i++) {
                let handler = handlerList[i];
                let args = [];
                for (let j = 1; j < arguments.length; j++) {
                    args.push(arguments[j]);
                }

                handler.apply(this, args);
                // console.log("args = " + JSON.stringify(args));
            }
        }
    };
    obj.off = function(name, method) {
        if (Register.hasOwnProperty(name)) {
            let handlerList = Register[name];
            for (let i = 0; i < handlerList.length; i++) {
                if (handlerList[i] === method) {
                    handlerList.splice(i, 1);
                }
            }
        }
    };
    obj.has = function(name) {
        let bol = Register.hasOwnProperty(name);
        return bol;
    };
    obj.destroy = function() {
        Register = {};
    };
    return obj;
}

/**
 * 节制函数
 * @param {Function} method 需要节制的函数
 * @param {Number} delay  间隔时间
 * @param {Number} duration 超出时间
 * @param {Boolean} controlType 1防抖 0节流 默认0
 * @return Function
 */
function control(method, delay = 300, controlType) {
    let timer = null;
    let start = new Date().getTime();
    return function() {
        let context = this;
        let args = arguments;
        if (controlType) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(function() {
                let end = new Date().getTime();
                if (end - start >= delay) {
                    method.apply(context, args);
                    start = end;
                }
            }, delay);
        } else {
            let end = new Date().getTime();
            if (timer) clearTimeout(timer);
            if (end - start >= delay) {
                method.apply(context, args);
                start = end;
            } else {
                timer = setTimeout(function() {
                    method.apply(context, args);
                    start = new Date().getTime();
                }, delay);
            }
        }
    };
}

//sessionStorage  localStorage
var Store = function() {
    this.name = "Store";
};
Store.prototype = {
    init: function(options) {
        this.store = function() {
            return options.type;
        };
        return this;
    },
    set: function(key, value) {
        var type = dataType(value);
        switch (type) {
            case "object":
            case "array":
                this.store().setItem(key, JSON.stringify(value));
                break;
            // case 'array':
            //             this.store().setItem(key,'['+value+']');
            //             break;
            case "function": //如果是函数先用eval()计算执行js代码
                this.store().setItem(key, value);
                break;
            default:
                this.store().setItem(key, value);
        }
    },
    get: function(key) {
        var value = this.store().getItem(key);

        try {
            value = JSON.parse(value);
        } catch (e) {}
        return value;
    },
    getAll: function() {
        var json = {};
        var value = "";

        for (var attr in this.store()) {
            try {
                value = JSON.parse(this.store()[attr]);
            } catch (e) {}
            json[attr] = value;
        }
        return json;
    },
    remove: function(key) {
        this.store().removeItem(key);
    },
    clear: function() {
        this.store().clear();
    }
};
const lStore = new Store().init({
    type: window.localStorage
});
const sStore = new Store().init({
    type: window.sessionStorage
});

//正常化日期
function normalDate(oDate) {
    var CurrentDate = oDate;
    var reg = /\-+/g;

    if (dataType(oDate) == "string") {
        if (oDate.indexOf("+") == -1) {
            oDate = oDate.split(".")[0]; //解决ie浏览器对yyyy-MM-dd HH:mm:ss.S格式的不兼容
            oDate = oDate.replace(reg, "/"); //解决苹果浏览器对yyyy-MM-dd格式的不兼容性
        }
    }

    CurrentDate = new Date(oDate);

    return CurrentDate;
}

//获取时间戳
function numTime(val) {
    let time = normalDate(val);
    return time.getTime();
}

//秒转分秒
function formatSeconds(value) {
    var secondTime = parseInt(value/1000); // 秒
    var minuteTime = 0; // 分
    var hourTime = 0; // 小时
    if (secondTime > 60) {
        //如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        // //如果分钟大于60，将分钟转换成小时
        // if(minuteTime > 60) {
        //     //获取小时，获取分钟除以60，得到整数小时
        //     hourTime = parseInt(minuteTime / 60);
        //     //获取小时后取佘的分，获取分钟除以60取佘的分
        //     minuteTime = parseInt(minuteTime % 60);
        // }
    }
    var result = NumRes(parseInt(secondTime));

    if (minuteTime > 0) {
        result = NumRes(parseInt(minuteTime)) + ":" + result;
    }
    // if(hourTime > 0) {
    //   result = "" + parseInt(hourTime) + "小时" + result;
    // }
    return result;
}

function weekDay(time) {
    let num = normalDate(time).getDay(),
        weekday = [
            "星期日",
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六"
        ];
    return weekday[num];
}

//日期格式化函数
//oDate（时间戳或字符串日期都支持）
//fmt（格式匹配）
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
//例子：
//dateFormat0(new Date(),'yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
//dateFormat0(new Date(),'yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
function dateFormat(mydate, ft) {
    if (!mydate) {
        return "--";
    }
    var fmt = ft || "yyyy-MM-dd hh:mm:ss",
        reg = /^\d+$/g,
        weekday = [
            "星期日",
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六"
        ];
    if (reg.test(mydate)) {
        mydate = mydate - 0;
    }

    var oDate = normalDate(mydate);
    var date = {
        "M+": oDate.getMonth() + 1, //月份
        "d+": oDate.getDate(), //日
        "h+": oDate.getHours(), //小时
        "m+": oDate.getMinutes(), //分
        "s+": oDate.getSeconds(), //秒
        "q+": Math.floor((oDate.getMonth() + 3) / 3), //季度，+3为了好取整,
        "w+": weekday[oDate.getDay()],
        S: oDate.getMilliseconds() //毫秒
    };

    if (/(y+)/.test(fmt)) {
        //RegExp.$1(正则表达式的第一个匹配，一共有99个匹配)
        fmt = fmt.replace(
            RegExp.$1,
            (oDate.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }

    for (var attr in date) {
        if (new RegExp("(" + attr + ")").test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1
                    ? date[attr]
                    : ("00" + date[attr]).substring((date[attr] + "").length)
            );
        }
    }
    return fmt;
}

function NumRes(num) {
    if (Number(num) < 10) {
        return "0" + num;
    } else {
        return num + "";
    }
}
//科学技术法转化
function scientificToNumber(num) {
    if (!num) return num;
    let numStr = num.toString().toLocaleLowerCase();
    if (!/(e)|(E)/g.test(numStr)) {
        return num;
    }
    return Number(num)
        .toFixed(18)
        .replace(/\.0+$/, "")
        .replace(/(\.\d+[1-9])0+$/, "$1");
}
//科学计数法
function toFixeds(nums, len = 2) {
    if (nums || nums === 0) {
        let re = `/([0-9]+\.?[0-9]{${len}})[0-9]*/`,
            regexp = /(?:\.0*|(\.\d+?)0+)$/;
        nums = scientificToNumber(nums).toString();
        nums =
            nums == 0
                ? nums
                : nums.replace(eval(re), "$1").replace(regexp, "$1");
        return Number(Number(nums).toFixed(len));
    } else {
        return "--";
    }
}

//千分符
function toThousands(num) {
    var re = /\d{1,3}(?=(\d{3})+$)/g;
    var n1 = num.toString().replace(/^(\d+)((\.\d+)?)$/, function(s, s1, s2) {
        return s1.replace(re, "$&,") + s2;
    });
    return n1;
}
//浮点数转换成小数
function priceFormat(nums, extent = 2) {
    if (nums || nums === 0) {
        let re = `/([0-9]+\.?[0-9]{${extent}})[0-9]*/`,
            regexp = /(?:\.0*|(\.\d+?)0+)$/;
        nums = scientificToNumber(nums).toString();
        nums =
            nums == 0
                ? nums
                : nums.replace(eval(re), "$1").replace(regexp, "$1");
        return toThousands(Number(nums).toFixed(extent));
    } else {
        return "--";
    }
}

//数组去重
function distinct(a, b = []) {
    let arr = a.concat(b);
    let result = [];
    let obj = {};

    for (let i of arr) {
        if (!obj[i]) {
            result.push(i);
            obj[i] = 1;
        }
    }

    return result;
}

export {
    dataType,
    deepCopy,
    addEvent,
    removeEvent,
    stopEvent,
    EventListener,
    control, //节制函数
    lStore,
    sStore,
    normalDate,
    numTime,
    formatSeconds,
    weekDay,
    dateFormat,
    toFixeds,
    toThousands,
    priceFormat,
    distinct
};
