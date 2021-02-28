<template>
  <div id="app">
    <p>Solanalotto</p>
    <div>
      <ul>
        <li>
          <label>Private key:</label>
          <input v-model="privateKey">
          <p v-if="privateKeyError">{{ privateKeyError }}</p>
        </li>
        <li>
          <label>Program id:</label>
          <input v-model="programId">
        </li>
      </ul>
      <p v-if="sol">{{ sol }} SOL</p>
    </div>
    <CreateLottery :privateKey="privateKey" :programId="programId" />
    <Lotteries :lotteries="lotteries" :userAccountPubkey="userAccountPubkey" @enter="onEnter" />
  </div>
</template>

<script>
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { privateKeyByteArrayStringToAccount, getAccountInfo, getLotteriesForProgramId, enterLottery, receiveLotteryWinnings } from './lottery'
import CreateLottery from './components/CreateLottery.vue'
import Lotteries from './components/Lotteries.vue'

export default {
  name: 'App',
  data: function() {
    return {
      userAccount: null,
      userAccountInfo: null,
      privateKey: '',
      privateKeyError: null,
      programId: '',
      lotteries: []
    };
  },
  components: {
    CreateLottery,
    Lotteries
  },
  watch: {
    programId: async function() {
      await this.fetchLotteries();
    },
    privateKey: async function(value) {
      this.privateKeyError = null;
      this.userAccount = null;
      try {
        this.userAccount = privateKeyByteArrayStringToAccount(value);
        this.userAccountInfo = await getAccountInfo(this.userAccount);
      }
      catch(e) {
        this.privateKeyError = e.message;
      }
    }
  },
  computed: {
    userAccountPubkey: function() {
      return this.userAccount?.publicKey.toBase58();
    },
    sol: function() {
      return this.userAccountInfo?.lamports / LAMPORTS_PER_SOL;
    }
  },
  methods: {
    onEnter: async function(lottery) {
      const lotteryInfo = await enterLottery(
        this.privateKey,
        lottery.lotteryAccountPubkey,
        this.programId
      );
      console.log(lotteryInfo);
      await this.fetchLotteries();
      this.userAccountInfo = await getAccountInfo(this.userAccount);
    },
    onReceive: async function(lottery) {
      const lotteryInfo = await receiveLotteryWinnings(
        this.privateKey,
        lottery.lotteryAccountPubkey,
        this.programId,
      );
      console.log(lotteryInfo);
      await this.fetchLotteries();
      this.userAccountInfo = await getAccountInfo(this.userAccount);
    },
    fetchLotteries: async function() {
      const lotteries = await getLotteriesForProgramId(this.$data.programId);
      console.log(lotteries);
      this.lotteries = lotteries;
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
ul {
  list-style-type: none;
}
</style>
