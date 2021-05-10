<template lang="pug">
.p-single
  h1
    |{{title}}
  p
    |{{category.name}}
  .p-single__body(v-html="content")

  .p-single__top
    nuxtLink(to="/")
      |TOPにもどる

</template>

<style lang="scss">
.p-single {
  font-size: 18px;
  line-height: 2;
  max-width: 1280px;
  padding: 0 20px;
  margin: 0 auto;
  &__top {
    text-align: center;
    font-size: 20px;
    text-decoration: underline;
    margin-top: 200px;
  }
}
</style>

<script>
import axios from 'axios';
export default {
  async asyncData({params,$config}) {
    const {data}  = await axios.get(
      `${$config.endPointNews}/${params.slug}`,
      { headers: { 'X-API-KEY': $config.apiKey }}
    );
    return {
      ...data
    }
  },
  created() {
    console.log(this.$config);
  }
}
</script>
