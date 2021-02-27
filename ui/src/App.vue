<template>
  <div id="app">
    <p>Solanalotto</p>
    <div>
      <ul>
        <li>
          <label>Private key:</label>
          <input v-model="privateKey">
        </li>
        <li>
          <label>Program id:</label>
          <input v-model="programId">
        </li>
      </ul>
    </div>
    <CreateLottery :privateKey="privateKey" :programId="programId" />
    <Lotteries />
  </div>
</template>

<script>
import CreateLottery from './components/CreateLottery.vue'
import Lotteries from './components/Lotteries.vue'

export default {
  name: 'App',
  data: function() { return {privateKey: '', programId: ''}; },
  components: {
    CreateLottery,
    Lotteries
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
ul {
  list-style-type: none;
}
</style>
