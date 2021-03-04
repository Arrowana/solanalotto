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
export default {
  data: function() { return {ticketPrice: 1}; },
  props: {
    privateKey: {type: String, required: true},
    programId: {type: String, required: true}
  },
  methods: {
    create: async function() {
      this.$emit('create', this.ticketPrice);
    },
    canCreate: function() {
      return this.$propsprivateKey !== '' && this.$props.programId !== '';
    }
  }
}
</script>