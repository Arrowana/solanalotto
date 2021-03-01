<template>
  <div>
    <h1>New lottery</h1>
    <v-text-field label="Ticket price" v-model.number="ticketPrice" type="number"></v-text-field> SOL
    <v-btn v-on:click="create" :disabled="!canCreate()">Create</v-btn>
    <p v-if="!canCreate()">Private key and program id required</p>
  </div>
</template>

<script>
import { initLottery } from '../lottery'

export default {
  data: function() { return {ticketPrice: 1}; },
  props: {
    privateKey: {type: String, required: true},
    programId: {type: String, required: true}
  },
  methods: {
    create: async function() {
      const lotteryInfo = await initLottery(
        this.$props.privateKey,
        this.$data.ticketPrice,
        this.$props.programId
      );

      console.log(`lotteryInfo: ${lotteryInfo.ticketPrice}`);
    },
    canCreate: function() {
      return this.$propsprivateKey !== '' && this.$props.programId !== '';
    }
  }
}
</script>