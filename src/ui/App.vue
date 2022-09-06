<template>
  <guide-plugin></guide-plugin>
</template>

<script>
import "../figma/figma-ds/js/selectMenu";
import "../figma/figma-ds/js/iconInput";
import "../figma/figma-ds/js/disclosure";

import guidePlugin from "./components/Shishin";

export default {
  data() {
    return {};
  },

  components: {
    guidePlugin
  },

  mounted() {
    // Initialize the figma-ds components
    window.selectMenu.init();
    window.iconInput.init();
    window.disclosure.init();
  }
};
</script>

<style lang="scss">
@import "../figma/figma-ds/figma-plugin-ds";
@import "./sass/all.scss"
</style>
