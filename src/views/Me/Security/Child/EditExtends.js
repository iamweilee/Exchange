import { mapState, mapActions } from "vuex";
import { isAccount, isCode } from "common/utli";
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
    destroyed() {
        clearInterval(this.timer);
    },
    methods: {
        verify(type) {
            let codeStr, loginNameStr;
            if (type == "edit") {
                codeStr = isCode(this.emailPhoneCode);
                loginNameStr = isAccount(this.emailPhone);
            } else if (type == "edit1") {
                codeStr = isCode(this.phoneData[this.pageType + "Code"]);
                loginNameStr = isAccount(this.phoneData[this.pageType]);
            }
            codeStr || loginNameStr
                ? (this.isClick = true)
                : (this.isClick = false);
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
                        this.getUserInfo();
                        this.$lStore.remove("phoneData");
                    } else {
                        this.loginOut();
                    }
                }
            });
        },
        loginOut() {
            this.$http({ url: "/v1/user/login_out", method: "post" })
                .then(res => {
                    if (res.status == this.STATUS) {
                        this.$lStore.remove("token");
                        this.updatedUserInfo("");
                        this.updatedBanlace("");
                        this.$router.push("/login");
                    }
                })
                .catch(err => {
                    this.$lStore.remove("token");
                    this.updatedUserInfo("");
                    this.updatedBanlace("");
                    this.$router.push("/login");
                });
        },
        //发送验证
        sendMsg(type) {
            let _this = this,
                loginName = this.emailPhone,
                codeType = this.pageType == "email" ? 6 : 5;
            if (this.pageType == "email") {
                codeType = 6;
            } else {
                if (this.$route.name == "Edit1") {
                    codeType = 5;
                } else {
                    if (this.userInfo.mobile) {
                        codeType = 9;
                    } else {
                        codeType = 5;
                    }
                }
            }
            if (type == "new") {
                loginName = this.phoneData[this.pageType];
            }
            this.sendMsgComm({
                loginName: loginName,
                areaCode: _this.userInfo.areaCode,
                codeType: codeType,
                fn: _this.$timeSet.bind("edit", _this)
            });
        },
        ...mapActions([
            "getUserInfo",
            "sendMsgComm",
            "updatedUserInfo",
            "updatedBanlace"
        ])
    }
};
export default extendTest;
