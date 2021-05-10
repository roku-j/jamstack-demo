<template lang="pug">
.p-single(v-if="data.title")
  h1
    |{{data.title}}
  p
    |{{data.category.name}}
  .p-single__body(v-html="data.content")
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
  data() {
    return {
      data: {}
    };
  },
  async created() {
    const query = this.$route.query;
    if (query.id === undefined || query.draftKey === undefined) {
      return;
    }
    const { data } = await axios.get(
      ``,
      { headers: { 'X-API-KEY': "" }}
    )
    console.log(data);
    this.data = data;
  },
}
</script>
