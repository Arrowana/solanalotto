<template>
  <v-card>
    <v-card-title>New lottery</v-card-title>
    <v-row no-gutters>
      <v-col cols="12" sm="6" md="8">
        <v-container>
          <v-text-field label="Ticket price" v-model="ticketPrice" type="number"></v-text-field>
        </v-container>
      </v-col>
      <v-col cols="6" md="4">
        <v-container>
          <v-btn v-on:click="create" :disabled="!canCreate()">Create</v-btn>
        </v-container>
      </v-col>
    </v-row>
  </v-card>
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
      this.$emit('create');
    },
    canCreate: function() {
      return this.$propsprivateKey !== '' && this.$props.programId !== '';
    }
  }
}
</script>