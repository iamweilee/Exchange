const extendCom = {
    methods: {
        //Dialog 公公显示函数
        showCustomDialog() {
            this.$refs.customDialog.showDialog();
        },

        showExplain() {
            this.$refs.OrderExplain.showExplain();
        }
    }
};
export default extendCom;
