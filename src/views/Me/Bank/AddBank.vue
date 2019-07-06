<template>
  <div class="addBank">
    <NavBar title="实名绑卡认证" fixed showL @clickLeft="clickLeft" />
    <div class="addBank_tips" @click="toShow">
      请填写您的真实信息，通过后将不能修改
    </div>
    <div class="addBank_form">
      <div class="single border-1px">
        <input
          type="text"
          v-model="cardData.papers"
          readonly
          placeholder="真实姓名"
        />
        <van-icon class="arrow_icon" name="arrow" />
      </div>
      <div class="single border-1px">
        <input
          type="text"
          v-model="cardData.userName"
          placeholder="真实姓名"
          ref="userName"
        />
      </div>
      <div class="single border-1px">
        <input
          type="text"
          v-model="cardData.identifyId"
          placeholder="身份证号"
          ref="identifyId"
        />
      </div>
      <div class="single border-1px">
        <input
          type="text"
          v-model="cardData.bankAccount"
          placeholder="银行卡号(仅限储蓄卡)"
          ref="bankAccount"
        />
      </div>
      <div class="single border-1px" @click="toShow('bankList')">
        <input
          type="text"
          v-model="cardData.bankName"
          placeholder="所属银行"
          readonly
          ref="bankName"
        />
        <van-icon class="arrow_icon" name="arrow" />
      </div>
      <div class="single border-1px" @click="toShow('address')">
        <input
          type="text"
          v-model="cardData.bankInfo"
          readonly
          placeholder="开户城市"
          ref="bankInfo"
        />
        <van-icon class="arrow_icon" name="arrow" />
      </div>
      <div class="single border-1px">
        <input
          type="text"
          v-model="cardData.bankPhone"
          placeholder="预留手机号"
          ref="bankPhone"
        />
      </div>
    </div>
    <div class="addBank_btn">
      <button @click="addBankCard">开户</button>
    </div>
    <vue-pickers
      :link="link"
      :show="show"
      :columns="columns"
      :defaultData="defaultData"
      :selectData="pickData"
      @cancel="close"
      @confirm="confirmFn"
    ></vue-pickers>
  </div>
</template>
<script>
import NavBar from "components/NavBar";
import vuePickers from "components/customPick";
import {
  provs_data,
  citys_data,
  dists_data
} from "components/customPick/lib/areaData";
import { bankList } from "common/staticData";
import { isBankCode, isPhone, isShenfenCard } from "common/TollClass/func";
const testData = {
  userName: "廉亚龙",
  identifyId: "411421199512107218",
  bankAccount: "6221885061021380686",
  bankName: "",
  bankInfo: "",
  bankPhone: "17620800222",
  papers: "中国身份证"
};
export default {
  data() {
    this.bankName = [bankList[0]];
    this.bankInfo = [provs_data[0], citys_data[0], dists_data[0]];
    return {
      cardData: {
        userName: "",
        identifyId: "",
        bankAccount: "",
        bankName: "",
        bankInfo: "",
        bankPhone: "",
        papers: "中国身份证"
      },
      verify: true,
      pickType: "",
      show: false,
      columns: 1,
      link: false,
      defaultData: [],
      pickData: {}
    };
  },
  components: {
    NavBar,
    vuePickers
  },
  methods: {
    // 点击添加按钮
    addBankCard() {
      this.verify = true;
      for (var keys in this.cardData) {
        let value = this.cardData[keys];
        switch (keys) {
          case "userName":
            this.checkVal(value, "真实姓名", keys);
            break;
          case "identifyId":
            this.checkVal(value, "身份证号", keys, isShenfenCard);
            break;
          case "recordBankCard":
            this.checkVal(value, "银行卡号", keys, isBankCode);
            break;
          case "bankName":
            this.checkVal(value, "所属银行", keys);
            break;
          case "bankInfo":
            this.checkVal(value, "开户城市", keys);
            break;
          case "bankPhone":
            this.checkVal(value, "手机号", keys, isPhone);
            break;
          default:
            break;
        }
        if (!this.verify) {
          return;
        }
      }
      this.handlePost();
    },
    //请求添加
    handlePost() {
      this.$http({
        url: "/v1/user/card/add",
        data: this.cardData,
        method: "post"
      }).then(res => {
        if (res.status == 200) {
          this.$toast("开户成功！");
          this.clickLeft();
        }
      });
    },
    //表单验证函数
    checkVal(val, str, ref, verif) {
      if (!val) {
        this.$toast(`${str}不能为空！`);
      } else if (verif) {
        if (verif(val)) {
          this.$toast(verif(val));
        } else {
          this.verify = true;
          return;
        }
      } else {
        if (val.length < 2) {
          this.$toast(`${str}输入不合法！`);
        } else {
          this.verify = true;
          return;
        }
      }
      this.verify = false;
      this.$refs[ref].focus();
    },
    clickLeft() {
      this.$router.back();
    },
    close() {
      this.show = false;
    },
    //pick 点击确认按钮
    confirmFn(val) {
      if (this.pickType == "bankList") {
        this.defaultData = [val.select1];
        this.bankName = [val.select1];
        this.cardData.bankName = val.select1.text;
      } else if (this.pickType == "address") {
        this.defaultData = [val.select1, val.select2, val.select3];
        this.bankInfo = [val.select1, val.select2, val.select3];
        this.cardData.bankInfo =
          val.select1.text + " " + val.select2.text + " " + val.select3.text;
      }
      this.show = false;
    },
    //点击出现选择 根据参数显示不同数据
    toShow(type) {
      if (type == "bankList") {
        this.link = false;
        this.columns = 1;
        this.pickData = {
          data1: bankList
        };
        if (this.defaultData.length > 1) {
          this.defaultData = this.bankName;
        }
      } else if (type == "address") {
        this.link = true;
        this.columns = 3;
        this.pickData = {
          data1: provs_data,
          data2: citys_data,
          data3: dists_data
        };
        console.log(this.pickData);
        if (this.defaultData.length < 3) {
          this.defaultData = this.bankInfo;
        }
      }
      this.pickType = type;
      this.show = true;
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
