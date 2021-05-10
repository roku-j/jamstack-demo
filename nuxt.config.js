require('dotenv').config();
const { ENDPOINT_NEWS, API_KEY, ENDPOINT_CAT } = process.env;
import axios from 'axios';

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // 公開してはだめな環境変数を格納できる
  // サーバー側からしか参照できない
  // $configから参照できる
  privateRuntimeConfig: {
    apiKey: API_KEY,
    endPointNews: ENDPOINT_NEWS,
    endPointCat: ENDPOINT_CAT
  },

  // 公開しても良いような環境変数を格納できる、サーバー、クライアントどちらでも利用可能
  // $configから参照できる
  // 開発時にはクライアントサイドで環境変数が必要になるため productionではundfinedになるように設定
  publicRuntimeConfig: {
    apiKey: process.env.NODE_ENV !== 'production' ? API_KEY : undefined,
    endPointNews: process.env.NODE_ENV !== 'production' ? ENDPOINT_NEWS : undefined,
    endPointCat: process.env.NODE_ENV !== 'production' ? ENDPOINT_CAT : undefined
  },

  //
  router: {
    // ルートを拡張する
    extendRoutes(routes,resolve) {
      // index.vueをページャー用（/page/_p/）に再利用する
      routes.push({
        path: '/page/:p',
        component: resolve(__dirname, 'pages/index.vue'),
        name: 'page',
      });
      // カテゴリー一覧ページ
      routes.push({
        path: '/category/:categoryId/',
        component: resolve(__dirname, 'pages/index.vue'),
        name: 'categoriesRoot',
      });
      routes.push({
        path: '/category/:categoryId/page/:p',
        component: resolve(__dirname, 'pages/index.vue'),
        name: 'categories',
      });
    }
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'jamstack-demo',
    htmlAttrs: {
      lang: 'ja'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // GlobalなCSS・SCSSファイルの読み込み
  css: [
    '@/assets/scss/style.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  // nuxt.generate()時の設定
  generate: {
    // 動的なパラメーターを持つルートを生成したい場合に設定する
    // (v2.13移行は何も設定しなくてもnuxtが自動でクロールしてルートを生成してくれる
    // ページ内にリンクが無いページを生成したいときのみ書けば良い)
    async routes() {
      const limit = 6;
      const range = (start,end) => [...Array(end - start + 1)].map((_, i) => start + i);
      // 各ページを実装
      const pages = await axios.get(
        `${ENDPOINT_NEWS}/?limit=0`,
        {
          headers: { 'X-API-KEY': API_KEY }
        }
      )
      .then((res) => {
        return range(1, Math.ceil(res.data.totalCount / limit)).map((p) => ({
          route: `/page/${p}`,
        }))
      });
      // カテゴリー一覧
      const categories = await axios
        .get(
          ENDPOINT_CAT,
          { headers: { 'X-API-KEY': API_KEY }}
        )
        .then(({ data }) => {
          return data.contents.map((content) => content.id);
        });
      const categoryPages = await Promise.all(
        categories.map((cat) =>
          axios
            .get(
              `${ENDPOINT_NEWS}?limit=1&fields=id&filters=category[equals]${cat}`,
              {
                headers: {
                  'X-API-KEY': API_KEY,
                },
              }
            )
            .then((res) => {
              return range(1, Math.ceil(res.data.totalCount / limit)).map((p) => ({
                route: `/category/${cat}/page/${p}`,
              }));
            })
        )
      );
      const flattenCategoryPages = [].concat.apply([], categoryPages);
      return [...pages, ...flattenCategoryPages];
    }
  }
}
