<template>
  <div id="app">
    <p>Hello</p>
    <div>
      <label>Private key</label>
      <input v-model="privateKey">
      <label>Program id</label>
      <input v-model="programId">
      <label>Program id</label>
    </div>
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
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
</style>
