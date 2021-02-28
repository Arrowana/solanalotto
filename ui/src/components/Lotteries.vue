<template>
  <div class="hello">
    <h1>Lotteries</h1>
    <p>
        Ongoing lotteries
    </p>
    <div>
      <ul v-for="(lottery, index) in lotteries" :key="index">
        <li>Lottery account <a :href="`https://explorer.solana.com/address/${lottery.lotteryAccountPubkey}?customUrl=http://127.0.0.1:8899&cluster=custom`">{{ lottery.lotteryAccountPubkey.slice(0, 8) }}...</a></li>
        <li>Ticket price: {{ lottery.ticketPrice / LAMPORTS_PER_SOL }} SOL</li>
        <li>Winnings: {{ lottery.ticketPrice / LAMPORTS_PER_SOL * lottery.max_entrant_count}} SOL</li>
        <li>Entrants: {{ lottery.entrants.length }}/{{ lottery.max_entrant_count }}</li>
        <li v-if="lottery.winnerAccountPubkey">Winner <a href="">{{ lottery.winnerAccountPubkey }}</a></li>
        <li v-if="userAccountPubkey && userAccountPubkey === lottery.winnerAccountPubkey"><button id="claim" v-on:click="receive(lottery)">Claim</button></li>
        <button v-if="userAccountPubkey && !lottery.winnerAccountPubkey && !lottery.entrants.includes(userAccountPubkey)" v-on:click="enter(lottery)">Enter</button>
        <p v-if="lottery.entrants.includes(userAccountPubkey)">Entered</p>
      </ul>
      <p v-if="lotteries.length == 0">No lottery</p>
    </div>
  </div>
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