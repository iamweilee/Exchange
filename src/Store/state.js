import { lStore } from "../common/utli";
export default {
    lang: lStore.get("lang") || [{ text: "中文简体", value: "zh" }],
    tabNav: lStore.get("tabNav") || 1,
    TVInterval: lStore.get("TVInterval") || 5,
    userInfo: lStore.get("userInfo") || "",
    Socket: lStore.get("Socket") || null,
    balance: lStore.get("balance") || {}
};
