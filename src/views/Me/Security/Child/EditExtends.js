import { mapState, mapActions } from "vuex";
const extendTest = {
    data() {
        return {
            isSend: false, //发送验证码按钮是否可点击
            isClick: true,
            sendBtnText: "获取验证码",
            timer: null,
            pageType: this.$route.params.type,
            changeTimer: null
        };
    },
    computed: {
        ...mapState(["userInfo"])
    },
    methods: {
        verify(type) {
            console.log(type, arguments);
            if (type == "edit") {
                this.emailPhone.trim() && this.emailPhoneCode.trim()
                    ? (this.isClick = false)
                    : (this.isClick = true);
            } else if (type == "edit1") {
                console.log(this.phoneData[this.pageType]);
                this.phoneData[this.pageType].trim() &&
                this.phoneData[this.pageType + "Code"].trim()
                    ? (this.isClick = false)
                    : (this.isClick = true);
            }
        },
        editPhone(req, bol) {
            this.$http({
                url: `/v1/user/bind_${this.pageType}`,
                data: req,
                method: "post"
            }).then(res => {
                if ((res.status = 200)) {
                    if (bol) {
                        this.$router.back();
                    }
                    this.getUserInfo();
                }
            });
        },
        //发送验证
        sendMsg() {
            this.isSend = true;
            let _this = this,
                num = 10;
            _this.timer = setInterval(() => {
                num--;
                if (num <= 0) {
                    clearInterval(_this.timer);
                    this.isSend = false;
                    this.sendBtnText = "获取验证码";
                } else {
                    this.sendBtnText = num + "S后重新获取";
                }
            }, 1000);
            this.sendBtnText = num + "S后重新获取";
        },
        ...mapActions(["getUserInfo"])
    }
};
export default extendTest;
