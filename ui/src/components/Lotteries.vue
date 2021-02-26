<template>
  <div class="hello">
    <h1>Lotteries</h1>
    <p>
        Ongoing lotteries
    </p>
    <div>
      <ul v-for="lottery in lotteries" :key="lottery.pubkey">
        <li>Lottery account <a href="Explorer">{{ lottery.pubkey }}</a></li>
        <li>Ticket price: {{ lottery.ticketPrice }} SOL</li>
        <li>Entrants: {{ lottery.entrant_count }}/{{ lottery.max_entrant_count }}</li>
        <li v-if="lottery.winnerPubkey">Winner <a href="">{{ lottery.winnerPubkey }}</a></li>
        <button v-if="!lottery.winnerPubkey">Enter</button>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      lotteries: [
        {pubkey: '0x19d12s', ticketPrice: 100, winnerPubkey: null, entrant_count: 2, max_entrant_count: 5},
        {pubkey: '0x10924A', ticketPrice: 4.2, winnerPubkey: null, entrant_count: 1, max_entrant_count: 5},
        {pubkey: '0x10921A', ticketPrice: 4.2, winnerPubkey: '0x12890734', entrant_count: 5, max_entrant_count: 5}
    ]};
  }
}
</script>