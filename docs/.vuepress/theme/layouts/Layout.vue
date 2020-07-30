<template>
  <Layout>
    <div slot="page-bottom" class="footer">
      <p>
        <span class="item">Copyright © {{ new Date().getFullYear() }}</span> 
        <span class="item">Moshpit Technologies Pvt. Ltd.</span>
      </p>
    </div>
  </Layout>
</template>

<script>
import Layout from '@vuepress/theme-default/layouts/Layout.vue'
export default {
  components: {
    Layout
  },
  mounted() {
    // Fix scrolling to the referenced element upon initial page load
    const hash = document.location.hash;
    if (hash.length > 1) {
      const id = hash.substring(1)
      const element = document.getElementById(id)
      if (element) element.scrollIntoView()
    }
  }
}
</script>

<style scoped>
.footer {
  text-align: center;
  color: #4e6e8e;
  padding: 0 2rem;
}
.footer .item {
  white-space: nowrap;
}
</style>