<template lang="pug">
.p-home
  h2(v-if="categoryId").p-home__head
    |カテゴリー名: {{thisCategory.name}}
  div(v-else).p-home__cats
    |カテゴリー一覧:
    ul
      li(v-for="cat in categoryList")
        nuxtLink(:to="`category/${cat.id}/page/1`")
          |{{ cat.name }}

  ul.p-home-list
    li.p-home-list__item(v-for="content in contents" :key="content.id")
      nuxtLink(:to="`/${content.id}`")
        .p-home-list__item-thum
          Picture(:pc="content.thumbnail")
        .p-home-list__item-ttl
          |{{ content.title }}
  ul.p-home__pager
    li(v-for="p in pager" :key="p" :class="{active: page === `${p + 1}` }").p-home__pager-item
      nuxtLink(:to="`/page/${p + 1}`")
        |{{p + 1}}

</template>

<style lang="scss">
.p-home {
  width: 100%;
  max-width: 1280px;
  padding: 0 20px;
  margin: 0 auto;
  &__head {
    margin-bottom: 30px;
    font-size: 2.4rem;
  }
  &__cats {
    margin-bottom: 30px;
    font-size: 20px;
    ul {
      display: flex;
      width: 100%;
    }
    li {
      &:not(:first-of-type) {
        margin-left: 20px;
      }
      a {
        text-decoration: underline;
      }
    }

  }
  &__pager {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 100px;
  }
  &__pager-item {
    display: block;
    width: 40px;
    height: 40px;
    border: 1px solid #000;
    &.active {
      background-color: #000;
      color: #fff;
    }
    a {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &:nth-of-type(n + 1) {
      margin-left: 20px;
    }
  }

  .p-home-list {
    width: 100%;
    display: grid;
    gap: 30px 20px;
    grid: auto / repeat(3,1fr);
    &__item {
      width: 100%;
      img {
        width: 100%;
      }
    }
  }
}
</style>

<script>
import axios from 'axios';
import Picture from '~/components/Picture.vue'
export default {
  components: {
    Picture
  },
  // 外部から取得したデータをコンポーネントで使用する時に使用する組み込み関数
  // ページ初期化時に呼び出される
  // コンポーネントがインスタンスされる前に実行されるので thisが使えない→代わりに第１引数のcontextを利用
  // returnした値はコンポーネントのテンプレートで使用可能
  async asyncData({params,$config}) {
    const page = params.p || '1';
    const categoryId = params.categoryId;
    const limit = 6;
    const { data } = await axios.get(
      `${$config.endPointNews}/?limit=${limit}&offset=${(page - 1) * limit}${categoryId === undefined ? '' : `&filters=category[equals]${categoryId}`}`,
      { headers: { 'X-API-KEY': $config.apiKey }}
    )
    const categoryList = await axios.get(
      $config.endPointCat,
      {
        headers: { 'X-API-KEY': $config.apiKey },
      }
    );
    const thisCategory =
      categoryId !== undefined
        ? categoryList.data.contents.find((content) => content.id === categoryId)
        : undefined;
    return {
      ...data,
      page,
      thisCategory,
      categoryList: categoryList.data.contents,
      categoryId,
      pager: [...Array(Math.ceil(data.totalCount / limit)).keys()],
    }
  },
}
</script>

<style lang="scss" scoped>
.p-home {
  font-size: 1rem;
  min-height: 80vh;
}
.p-home-list {
  &__link {
    font-size: 1rem;
  }
}
</style>
