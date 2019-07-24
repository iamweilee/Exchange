export default {
    getLang(state) {
        return state.lang;
    },
    usableBalance(state) {
        return state.balance.currentAmount;
    }
};
