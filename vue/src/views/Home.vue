<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  data: function() {
    return {
      customers: []
    };
  },
  components: {
    HelloWorld
  },
  mounted: function() {
    fetch('/api/customers').then(res => res.json()).then(res => this.customers = res).then(console.log);
  }
}
</script>
