export default {
    // 测试地址
    testENV: {
        name: "test",
        httpApi: "http://web.asiabitmex.com",
        httpApi1: "http://web.asiabitmex.com",
        uploadApi: "http://web.asiabitmex.com:8182",
        TVsocket: "ws://3.0.67.19:8195/ws",
        // TVsocket: "ws://192.168.0.104:8085/"
    },
    //生产地址
    proENV: {
        name: "prod",
        httpApi: "http://18.139.211.91:8183",
        httpApi1: "http://web.asiabitmex.com",
        uploadApi: "http://web.asiabitmex.com:8182",
        TVsocket: "ws://3.0.67.19:8195/ws"
        // TVsocket: "ws://192.168.50.71:8195/ws",
    },
    getENV: function() {
        return this.testENV;
    }
};
