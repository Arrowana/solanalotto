<template>
  <div class="hello">
    <h1>Lotteries</h1>
    <p>
        Ongoing lotteries
    </p>
    <div>
      <ul v-for="(lottery, index) in lotteries" :key="index">
        <li>Lottery account <a :href="`https://explorer.solana.com/address/${lottery.lotteryAccountPubkey}?customUrl=http://127.0.0.1:8899&cluster=custom`">{{ lottery.lotteryAccountPubkey.slice(0, 8) }}...</a></li>
        <li>Ticket price: {{ lottery.ticketPrice / 1000000000 }} SOL</li>
        <li>Winnings: {{ lottery.ticketPrice / 1000000000 * lottery.max_entrant_count}} SOL</li>
        <li>Entrants: {{ lottery.entrants.length }}/{{ lottery.max_entrant_count }}</li>
        <li v-if="lottery.winnerAccountPubkey">Winner <a href="">{{ lottery.winnerAccountPubkey }}</a></li>
        <button v-if="!lottery.winnerAccountPubkey" v-on:click="enter(lottery)">Enter</button>
      </ul>
      <p v-if="lotteries.length == 0">No lottery</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['lotteries'],
  methods: {
    enter: function(lottery) {
      console.log(`From lottery`);
      this.$emit('enter', lottery);
    }
  }
}
</script>