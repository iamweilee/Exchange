import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home";
import Footer from "./components/Footer";
import store from "./Store";
import { lStore } from "./common/utli";
Vue.use(Router);

const router = new Router({
    // mode: "history",
    base: process.env.BASE_URL,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { x: 0, y: 0 };
        }
    },
    routes: [
        {
            path: "/", //首页
            name: "home",
            meta: { id: 1 },
            components: {
                default: Home,
                mainfooter: Footer
            }
        },
        {
            path: "/scroll_test", //首页
            name: "scrollTest",
            meta: { id: 1 },
            component: () => import("views/scroll_test.vue")
        },
        {
            path: "/service", //联系客服
            name: "Service",
            meta: { id: 1.1 },
            component: () => import("views/Home/Service")
        },
        {
            path: "/msg_board", //留言板
            name: "MsgBoard",
            meta: { id: 1.1 },
            component: () => import("views/MsgBoard")
        },
        {
            path: "/hot", //热门活动
            name: "Hot",
            meta: { id: 1.2 },
            component: () => import("views/Home/HotActive")
        },
        {
            path: "/guide", //新手引导
            name: "NoviceGuide",
            meta: { id: 1.3 },
            component: () => import("views/Home/NoviceGuide")
        },
        {
            path: "/guide/swiper/:type", //引导swiper
            name: "GuideSwiper",
            meta: { id: 1.31 },
            component: () => import("views/Home/GuideSwiper")
        },
        {
            path: "/asked", //新手引导子页面
            name: "Asked",
            meta: { id: 1.32 },
            component: () => import("views/Home/Asked")
        },
        {
            path: "/asked/:type",
            name: "AskedType",
            meta: { id: 1.33 },
            component: () => import("views/Home/Asked")
        },
        {
            path: "/disciple", //我的徒弟
            name: "Disciple",
            meta: { id: 1.4 },
            component: () => import("views/Home/Disciple")
        },
        {
            path: "/disciple/list", //我的徒弟
            name: "DiscipleList",
            meta: { id: 1.41 },
            component: () => import("views/Home/Disciple/List.vue")
        },
        {
            path: "/otc", //充值OTC
            name: "Otc",
            meta: { id: 1.5 },
            component: () => import("views/Home/Otc"),
            children: [
                {
                    path: "/otc",
                    name: "otcMerchant",
                    meta: { id: 1.51 },
                    component: () => import("views/Home/Otc/Merchant")
                },
                {
                    path: "/otc/wallet",
                    name: "otcWallet",
                    meta: { id: 1.52, type: "sub" },
                    component: () => import("views/Home/Otc/Wallet")
                }
            ]
        },
        {
            path: "/withdraw", //充值OTC
            name: "Withdraw",
            meta: { id: 1.5 },
            component: () => import("views/Home/Withdraw"),
            children: [
                {
                    path: "/withdraw",
                    name: "withdrawMerchant",
                    meta: { id: 1.51 },
                    component: () => import("views/Home/Withdraw/Merchant")
                },
                {
                    path: "/withdraw/wallet",
                    name: "withdrawWallet",
                    meta: { id: 1.52, type: "sub" },
                    component: () => import("views/Home/Withdraw/Wallet")
                }
            ]
        },
        {
            path: "/withdraw/address", //行业快讯
            name: "Address",
            meta: { id: 1.54 },
            component: () => import("views/Home/Withdraw/Address")
        },
        {
            path: "/withdraw/list", //行业快讯
            name: "AddressList",
            meta: { id: 1.53 },
            component: () => import("views/Home/Withdraw/Address/List.vue")
        },
        {
            path: "/news", //行业快讯
            name: "News",
            meta: { id: 1.6 },
            components: {
                default: () => import("views/Home/News")
            }
        },
        {
            path: "/recharge", //充币
            name: "Recharge",
            meta: { id: 1.9 },
            components: {
                default: () => import("views/Recharge")
            }
        },

        {
            path: "/login", //登录
            name: "Login",
            meta: { id: 0.1 },
            component: () => import("views/Login")
        },
        {
            path: "/login/:type",
            name: "LoginType",
            meta: { id: 0.2 },
            component: () => import("views/Login/pwd")
        },
        {
            path: "/register", //注册
            name: "Register",
            meta: { id: 0.3 },
            component: () => import("views/Register"),
            children: [
                {
                    path: "/register",
                    name: "Phone",
                    meta: { id: 0.4 },
                    component: () => import("views/Register/Phone")
                },
                {
                    path: "/register/email",
                    name: "Email",
                    meta: { id: 0.5 },
                    component: () => import("views/Register/Email")
                }
            ]
        },
        {
            path: "/register/pwd", //杠杆
            name: "Pwd",
            meta: { id: 0.6 },
            component: () => import("views/Register/Pwd")
        },
        {
            path: "/lever", //杠杆
            name: "Lever",
            meta: { id: 2 },
            components: {
                default: () => import("views/Lever"),
                mainfooter: Footer
            }
        },
        {
            path: "/position/:coinCode", //交易
            name: "Position",
            meta: { id: 3 },
            component: () => import("views/positions")
        },
        {
            path: "/chat", //持仓
            name: "Chat",
            meta: { id: 4 },
            components: {
                default: () => import("views/Chat"),
                mainfooter: Footer
            },
            children: [
                {
                    path: "/chat",
                    name: "ChatHold",
                    meta: { id: 4 },
                    component: () => import("views/Chat/Hold")
                },
                {
                    path: "/chat/list",
                    name: "ChatList",
                    meta: { id: 4 },
                    component: () => import("views/Chat/List")
                },
                {
                    path: "/chat/history", //持仓历史
                    name: "ChatHistory",
                    meta: { id: 4 },
                    component: () => import("views/Chat/History")
                }
            ]
        },
        {
            path: "/chat/hold/:id", //持仓详情
            name: "HoldDetail",
            meta: { id: 4.3 },
            component: () => import("views/Chat/HoldDetail")
        },

        {
            path: "/chat/history/:id", //持仓历史
            name: "ChatHistoryDetail",
            meta: { id: 4.21 },
            component: () => import("views/Chat/History/Detail.vue")
        },
        {
            path: "/me", //我的
            name: "Me",
            meta: { id: 5 },
            components: {
                default: () => import("views/Me"),
                mainfooter: Footer
            }
        },
        {
            path: "/me/report", //投资报表
            name: "Report",
            meta: { id: 5.1 },
            component: () => import("views/Me/Report")
        },
        {
            path: "/me/fund", //资金明细
            name: "Fund",
            meta: { id: 5.2 },
            component: () => import("views/Me/Fund"),
            children: [
                {
                    path: "/me/fund", //OTC资金明细
                    name: "FundOtc",
                    meta: { id: 5.21 },
                    component: () => import("views/Me/Fund/Otc")
                },
                {
                    path: "/me/fund/wallet/:type", //钱包资金明细
                    name: "FundWallet",
                    meta: { id: 5.22, type: "sub" },
                    component: () => import("views/Me/Fund/Wallet")
                }
            ]
        },
        {
            path: "/me/bank", //账户设置
            name: "Bank",
            meta: { id: 5.4 },
            component: () => import("views/Me/Bank")
        },
        {
            path: "/me/bank/add", //账户设置
            name: "BankAdd",
            meta: { id: 5.41 },
            component: () => import("views/Me/Bank/AddBank.vue")
        },
        {
            path: "/me/fund/status/:id", //账户设置
            name: "Status",
            meta: { id: 5.23 },
            component: () => import("views/Me/Fund/Status")
        },
        {
            path: "/me/fund/detail/:id", //账户设置
            name: "Detail",
            meta: { id: 5.24 },
            component: () => import("views/Me/Fund/Detail")
        },
        {
            path: "/me/msg", //消息中心
            name: "Msg",
            meta: { id: 5.3 },
            component: () => import("views/Me/Msg"),
            children: [
                {
                    path: "/me/msg", //系统消息
                    name: "SysMsg",
                    meta: { id: 5.31 },
                    component: () => import("views/Me/Msg/Sys")
                },
                {
                    path: "/me/msg/notic", //重置
                    name: "NoticMsg",
                    meta: { id: 5.32, type: "sub" },
                    component: () => import("views/Me/Msg/Notic")
                }
            ]
        },
        {
            path: "/me/setting", //账户设置
            name: "Setting",
            meta: { id: 5.4 },
            component: () => import("views/Me/Setting")
        },
        {
            path: "/me/setting/about", //关于我们
            name: "About",
            meta: { id: 5.44 },
            component: () => import("views/Me/Setting/About")
        },
        {
            path: "/me/feedback", //关于我们
            name: "FeedBack",
            meta: { id: 5.45 },
            component: () => import("views/Me/Setting/FeedBack")
        },
        {
            path: "/me/security", //安全中心
            name: "Security",
            meta: { id: 5.5 },
            component: () => import("views/Me/Security")
        },
        {
            path: "/me/pwd", //修改登录密码
            name: "MePwd",
            meta: { id: 5.51 },
            component: () => import("views/Me/Security/Child/Pwd.vue"),
            children: [
                {
                    path: "/me/pwd",
                    name: "PwdEdit",
                    meta: { id: 5.52 },
                    component: () =>
                        import("views/Me/Security/Child/PwdEdit.vue")
                },
                {
                    path: "/me/pwd/reset", //重置
                    name: "PwdReset",
                    meta: { id: 5.53 },
                    component: () =>
                        import("views/Me/Security/Child/PwdReset.vue")
                }
            ]
        },
        {
            path: "/me/edit/:type", //修改手机||邮箱
            name: "Edit",
            meta: { id: 5.54 },
            component: () => import("views/Me/Security/Child/Edit.vue")
        },
        {
            path: "/me/edit1/:type", //修改手机||邮箱 step1
            name: "Edit1",
            meta: { id: 5.55 },
            component: () => import("views/Me/Security/Child/Edit1.vue")
        },
        {
            path: "/me/user", //我的
            name: "User",
            meta: { id: 5.6 },
            component: () => import("views/Me/User")
        },
        {
            path: "/intord/:type", //所有介绍
            name: "Intord",
            meta: { id: 11 },
            component: () => import("views/Intord")
        }
    ]
});
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.id)) {
        let Id = to.meta.id;
        store.commit("setTabNav", Id);
    }
    if (to.name == "Position") {
        lStore.set("coinCode", to.params.coinCode);
    }
    next();
});

export default router;
