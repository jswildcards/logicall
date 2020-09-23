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
  components: {
    HelloWorld
  },
  data: function () {
    return {
      products: []
    }
  },
  mounted: async function () {
    const products = await fetch('/api/products?page[number]=2&page[size]=5')
      .then(res => res.json())
      .then(res => res?.data ?? { err: 'Unable to fetch resources' })

    this.products = products
    console.log(this.products)
  }
}
</script>
