<template lang="pug">
  header.c-header
    .c-header__logo
      nuxtLink(to="/")
        |JAMSTACK DEMO
</template>

<style lang="scss">
.c-header {
  width: 100%;
  padding: 15px 0;
  background-color: #fff;
  display: flex;
  justify-content: center;
  background-color: #212121;
  &__logo {
    color: #fff;
    font-size: 24px;
  }
}
</style>
