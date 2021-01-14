<template>
  <div class="app-wrapper">
    <Transcript /> 
  </div>
</template>

<script>
import Transcript from './components/Transcript.vue'

export default {
  name: 'App',
  components: {
    Transcript,
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box  ;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

</style>

<style scoped>
  .app-wrapper {
    width: 100vw;
    height: 100vh;
    background: rgb(170, 169, 169);
  }
  
</style>
