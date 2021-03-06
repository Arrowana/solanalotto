<template>
  <v-app id="app" :style="{ background: $vuetify.theme.themes['dark'].background }">
    <v-app-bar app>
      <v-row class="mt-6">
        <v-col>
          <v-toolbar-title>Solanalotto</v-toolbar-title>
        </v-col>
        <v-col></v-col>
        <v-col>sollet.io <v-btn v-on:click="connect">Connect</v-btn></v-col>
        <v-col>
          <v-select v-model="cluster" label="Cluster" :items="clusters"></v-select>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-spacer />
    <v-main>
      <v-container>
        <v-img src="@/assets/solanalotto-neon.jpeg" max-width="25%" class="mx-auto"></v-img>
      </v-container>

      <v-container>
        <p v-if="this.userPublicKey !== null">Pubkey: {{ this.userPublicKey.toBase58() }}</p>
        <v-alert border="left" color="red" type="warning" dark v-else>Connect wallet to reveal balance and interact with lotteries</v-alert>
        <p v-if="sol !== null">{{ sol }} SOL</p>
        <v-checkbox v-model="customProgramId" label="Choose program ID"></v-checkbox>
        <v-text-field v-if="customProgramId" v-model="programId" label="Custom program ID"></v-text-field>
      </v-container>
      <v-container>
        <CreateLottery :canCreate="this.userPublicKey !== null" @create="onCreate" />
      </v-container>
      <v-container>
        <v-row>
          <Lotteries :lotteries="lotteries" :userAccountPubkey="this.userPublicKey !== null && this.userPublicKey.toBase58()" @enter="onEnter" @receive="onReceive" />
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js';
import Wallet from '@project-serum/sol-wallet-adapter';
import { changeEndpoint, getAccountInfo, getLotteriesForProgramId, initLottery, enterLottery, receiveLotteryWinnings } from './lottery';
import CreateLottery from './components/CreateLottery.vue';
import Lotteries from './components/Lotteries.vue';

// TODO: Pull that out to config file
const endpoints = {
  'devnet': {
    url: clusterApiUrl('devnet'),
    programId: '3zAfBWGppVofNk9Cqfziob3QTLT2BPECmpmj2P66eWNJ'
  },
  'localnet': {
    url: 'http://127.0.0.1:8899',
    programId: '72MgRTDhBWRveLLJn7D1uz21D4bW76PJd6q1oFGVxbmK'
  }
};

const wallet = new Wallet('https://www.sollet.io');
wallet.on('disconnect', () => console.log('Disconnected'));

export default {
  name: 'App',
  data: function() {
    return {
      cluster: 'devnet',
      userPublicKey: null,
      programId: '',
      customProgramId: false,
      lotteries: null,
      sol: null
    };
  },
  components: {
    CreateLottery,
    Lotteries
  },
  created: function() {
    wallet.on('connect', publicKey => {
      console.log('Connected to ' + publicKey.toBase58());
      this.userPublicKey = publicKey;
    });
    wallet.on('disconnect', () => {
      this.userPublicKey = null;
    });
  },
  watch: {
    cluster: {
      immediate: true,
      handler: async function(value) {
        this.lotteries = null; // We have changed cluster, discard lotteries
        changeEndpoint(endpoints[value].url);
      }
    },
    customProgramId: {
      immediate: true,
      handler: function(value) {
        if (!value) {
          this.programId = endpoints[this.cluster].programId;
        }
      }
    },
    programId: {
      immediate: true,
      handler: async function() {
        await this.fetchLotteries();
      }
    },
    userPublicKey: async function() {
      this.updateUser();
    }
  },
  computed: {
    userAccountPubkey: function() {
      return this.userPublicKey?.toBase58();
    },
    clusters: function() {
      return Object.keys(endpoints);
    },
    theme: function() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    },
  },
  methods: {
    connect: async function() {
      await wallet.connect();
    },
    onEnter: async function(lottery) {
      const lotteryInfo = await enterLottery(
        wallet,
        lottery.lotteryAccountPubkey,
        this.programId
      );
      console.log(lotteryInfo);
      await this.fetchLotteries();
      await this.updateUser();
    },
    onReceive: async function(lottery) {
      const lotteryInfo = await receiveLotteryWinnings(
        wallet,
        lottery.lotteryAccountPubkey,
        this.programId,
      );
      console.log(lotteryInfo);
      await this.fetchLotteries();
       await this.updateUser();
    },
    onCreate: async function(ticketPrice) {
      const lotteryInfo = await initLottery(
        wallet,
        ticketPrice,
        this.programId
      );

      console.log(`lotteryInfo: ${lotteryInfo.ticketPrice}`);
      await this.fetchLotteries();
      await this.updateUser();
    },
    fetchLotteries: async function() {
      this.lotteries = null;
      const lotteries = await getLotteriesForProgramId(this.$data.programId);
      console.log(lotteries);
      this.lotteries = lotteries;
    },
    updateUser: async function() {
      const userAccountInfo = await getAccountInfo(this.userPublicKey);
      this.sol = userAccountInfo?.lamports / LAMPORTS_PER_SOL ?? null;
    }
  }
}
</script>
