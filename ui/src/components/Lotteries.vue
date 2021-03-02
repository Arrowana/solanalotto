<template>
  <v-container>
    <h1>Lotteries</h1>
    <p>
        Ongoing lotteries
    </p>
    <v-card v-for="(lottery, index) in lotteries" :key="index" tile elevation="3" outlined>
        <v-card-title>Lottery account
          <a :href="`https://explorer.solana.com/address/${lottery.lotteryAccountPubkey}?customUrl=http://127.0.0.1:8899&cluster=custom`">{{ lottery.lotteryAccountPubkey.slice(0, 8) }}...</a>
        </v-card-title>

        <v-card-text>
          <v-list-item>Ticket price: {{ lottery.ticketPrice / LAMPORTS_PER_SOL }} SOL</v-list-item>
          <v-list-item>Winnings: {{ lottery.ticketPrice / LAMPORTS_PER_SOL * lottery.max_entrant_count}} SOL</v-list-item>
          <v-list-item>Entrants: {{ lottery.entrants.length }}/{{ lottery.max_entrant_count }}</v-list-item>
          <v-list-item v-if="lottery.winnerAccountPubkey">Winner <a href="">{{ lottery.winnerAccountPubkey }}</a></v-list-item>
        </v-card-text>

        <v-card-actions>
          <v-btn v-if="userAccountPubkey && userAccountPubkey === lottery.winnerAccountPubkey" color="green lighten-1" v-on:click="receive(lottery)">Claim</v-btn>
          <v-btn v-if="userAccountPubkey && !lottery.winnerAccountPubkey && !lottery.entrants.includes(userAccountPubkey)" v-on:click="enter(lottery)">Enter</v-btn>
          <v-btn v-if="lottery.entrants.includes(userAccountPubkey)" disabled>Entered</v-btn>
        </v-card-actions>
    </v-card>

    <p v-if="lotteries.length == 0">No lottery</p>
  </v-container>
</template>

<script>
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

export default {
  props: ['lotteries', 'userAccountPubkey'],
  data: function() {
    return {
      LAMPORTS_PER_SOL: LAMPORTS_PER_SOL
    };
  },
  methods: {
    enter: function(lottery) {
      this.$emit('enter', lottery);
    },
    receive: function(lottery) {
      this.$emit('receive', lottery);
    }
  }
}
</script>

<style scoped>
#claim {
  background-color: green;
}
</style>