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
        <v-text-field v-model="privateKey" label="Account private key" :error-messages="privateKeyError ? [privateKeyError] : []" :rules="privateKeyRules"></v-text-field>
        <p v-if="userAccountPubkey">Pubkey: {{ userAccountPubkey }}</p>
        <v-checkbox v-model="customProgramId" label="Choose program ID"></v-checkbox>
        <v-text-field v-if="customProgramId" v-model="programId" label="Custom program ID"></v-text-field>
        <p v-if="sol !== null">{{ sol }} SOL</p>
        <p v-else>Enter private key to reveal SOL balance</p>
      </v-container>
      <v-container>
        <CreateLottery :privateKey="privateKey" :programId="programId" @create="onCreate" />
      </v-container>
      <v-container>
        <v-row>
          <Lotteries :lotteries="lotteries" :userAccountPubkey="userAccountPubkey" @enter="onEnter" @receive="onReceive" />
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

// TODO: Pull that out to config file and make it change on cluster
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
      userAccountInfo: null,
      privateKey: '',
      privateKeyError: null,
      programId: '',
      lotteries: null,
      privateKeyRules: [
        (value) => !!value | 'Required.'
      ],
      customProgramId: false,
      sol: null
    };
  },
  components: {
    CreateLottery,
    Lotteries
  },
  created: function() {
    console.log('created');
    wallet.on('connect', publicKey => {
      console.log('Connected to ' + publicKey.toBase58());
      this.userPublicKey = publicKey;
    });
  },
  watch: {
    cluster: {
      immediate: true,
      handler: async function(value) {
        this.lotteries = null;
        changeEndpoint(endpoints[value].url);
        // if (this.userAccountInfo) {
        //   this.userAccountInfo = await getAccountInfo(this.userAccount);
        // }
      },
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
    // privateKey: async function(value) {
    //   this.privateKeyError = null;
    //   this.userAccount = null;
    //   this.sol = null;
    //   try {
    //     this.userAccount = privateKeyByteArrayStringToAccount(value);
    //     this.updateUserAccountInfo(this.userAccount);
    //   }
    //   catch(e) {
    //     this.privateKeyError = e.message;
    //   }
    // }
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
      console.log('connect');
      await wallet.connect();
      console.log('connected?');
    },
    onEnter: async function(lottery) {
      const lotteryInfo = await enterLottery(
        wallet,
        lottery.lotteryAccountPubkey,
        this.programId
      );
      console.log(lotteryInfo);
      await this.fetchLotteries();
      //await this.updateUserAccountInfo(this.userAccount);
    },
    onReceive: async function(lottery) {
      const lotteryInfo = await receiveLotteryWinnings(
        wallet,
        lottery.lotteryAccountPubkey,
        this.programId,
      );
      console.log(lotteryInfo);
      await this.fetchLotteries();
      await this.updateUserAccountInfo(this.userAccount);
    },
    onCreate: async function(ticketPrice) {
      const lotteryInfo = await initLottery(
        wallet,
        ticketPrice,
        this.programId
      );

      console.log(`lotteryInfo: ${lotteryInfo.ticketPrice}`);
      await this.fetchLotteries();
      await this.updateUserAccountInfo(this.userAccount);
    },
    fetchLotteries: async function() {
      this.lotteries = null;
      const lotteries = await getLotteriesForProgramId(this.$data.programId);
      console.log(lotteries);
      this.lotteries = lotteries;
    },
    updateUserAccountInfo: async function(userAccount) {
      const userAccountInfo = await getAccountInfo(userAccount);
      this.sol = userAccountInfo?.lamports / LAMPORTS_PER_SOL ?? null;
      this.userAccountInfo = userAccountInfo;
    }
  }
}
</script>
