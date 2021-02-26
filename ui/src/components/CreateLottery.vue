<template>
  <div>
    <h1>New lottery</h1>
    <label>Ticket price:</label><input v-model="ticketPrice"> SOL
    <button v-on:click="create" :disabled="!canCreate()">Create</button>
    <p v-if="!canCreate()">Private key and program id required</p>
  </div>
</template>

<script>
export default {
  data: function() { return {ticketPrice: 1}; },
  props: {
    privateKey: {type: String, required: true},
    programId: {type: String, required: true}
  },
  methods: {
    create: function() {
      // TODO
    },
    canCreate: function() {
      return this.$propsprivateKey !== '' && this.$props.programId !== '';
    }
  }
}
</script>