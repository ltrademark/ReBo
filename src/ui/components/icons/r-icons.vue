<template>
  <div class="r-icon" :class="addClasses" v-html="require(`./parts/${this.fixedName}.svg`).default"></div>
</template>
<script>
  export default {
    props: {
      name: {
        type: String
      },
      addClasses: {
        type: String
      }
    },
    computed: {
      fixedName() {
        return this.name.toLowerCase();
      }
    }
  }
</script>
<style lang="scss">
  .r-icon {
    display: inline-block;
    vertical-align: -.15em;
    color: var(--figma-color-text);
  }
  svg {
    display: block;
    color: inherit;
    height: 1em;
    width: auto;
    transition: 335ms ease-in-out all;
    .accented-st {
      fill: none;
      stroke: var(--accent);
      stroke-width: 2;
      stroke-linecap:round;
    }
    .accented-fl {
      fill: var(--accent);
      stroke: none;
    }
    .st {
      stroke: currentColor;
      stroke-width: 1;
      stroke-linecap:round;
      fill: none;
      &.ui-danger {
        stroke: var(--red);
      }
    }
    .fl {
      fill: currentColor;
      stroke: none;
      &.ui-danger {
        fill: var(--red);
      }
    }
  }
</style>