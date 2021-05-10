<template lang="pug">
  .layout
    .l-header
      Header
    .l-content
      Nuxt
    .l-footer
      Footer
  </div>
</template>


<style lang="scss">
.l-content {
  min-height: 90vh;
  padding: 50px 0;
}


</style>

<script>
import Header from '@/components/Header';
import Footer from '@/components/Footer';
export default {
  components: {
    Header,
    Footer
  }
}
</script>

