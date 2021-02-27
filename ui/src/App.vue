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
    </div>
    <CreateLottery :privateKey="privateKey" :programId="programId" />
    <Lotteries :lotteries="lotteries" :userAccountPubkey="userAccountPubkey" @enter="onEnter" />
  </div>
</template>

<script>
import { privateKeyByteArrayStringToPublicKey, getLotteriesForProgramId, enterLottery } from './lottery'
import CreateLottery from './components/CreateLottery.vue'
import Lotteries from './components/Lotteries.vue'

export default {
  name: 'App',
  data: function() {
    return {
      userAccountPubkey: null,
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
    privateKey: function(value) {
      try {
        this.privateKeyError = null;
        this.userAccountPubkey = privateKeyByteArrayStringToPublicKey(value).toBase58();
      }
      catch(e) {
        this.privateKeyError = e.message;
        this.userAccountPubkey = null;
      }
    }
  },
  methods: {
    onEnter: async function(lottery) {
      console.log(`The parent gets ${lottery}`);
      const lotteryInfo = await enterLottery(
        this.privateKey,
        lottery.lotteryAccountPubkey,
        this.programId
      );
      console.log(lotteryInfo);
      await this.fetchLotteries();
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
