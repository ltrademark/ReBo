<template>
  <div class="r-icon" :class="addClasses" v-html="svgContent"></div>
</template>
<script>
  const svgs = import.meta.glob('./parts/*.svg', { eager: true, query: '?raw', import: 'default' })

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
      },
      svgContent() {
        return svgs[`./parts/${this.fixedName}.svg`] || ''
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
        stroke: rgba(var(--red), 1);
      }
    }
    .fl {
      fill: currentColor;
      stroke: none;
      &.ui-danger {
        fill: rgba(var(--red), 1);
      }
    }
  }
</style>