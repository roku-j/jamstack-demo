<template lang="pug">
picture
  img(:src="`${pc.url}?w=400&fm=webp`",:width="pc.width",:height="pc.height")
</template>

<style lang="scss" scoped>
img {
  max-width: 100%;
  height: auto;
}
</style>

<script>
export default {
  props:[
    "pc",
    "sp"
  ]
}
</script>
