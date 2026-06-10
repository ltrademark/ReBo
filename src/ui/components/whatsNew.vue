<template>
  <div class="mini-modal">
   <div class="mini-modal--body">
    <div class="brand-group">
     <img src="https://static.basedcdn.com/madebyLTM/src/assets/rebo-icon.png" alt="logo" />
     <h3>ReBo</h3>
     <sup>Copyright &copy; 2026. Ltrademark&trade; All Rights Reserved</sup>
    </div>
    <h4>✨ Changes in v{{currentVer}}</h4>
    <ul>
     <li v-for="change in changelog" :key="change">{{ change }}</li>
    </ul>
   </div>
   <div class="mini-modal--footer">
    <a href="https://ltrademark.com" target="_blank">made with ❤ by Ltrademark</a>
    <a class="btn btn-secondary" href="https://github.com/ltrademark/ReBo/issues/new/choose" target="_blank">Report a bug</a>
   </div>
  </div>
</template>
<script>
 export default {
  data() {
   return {
    currentVer: this.$parent.version,
    changelog: [
     'New: Columns and Rows merged into a single Guides tab.',
     'New: Column Width and Gutter inputs — set a fixed column width and gutter; the grid centers itself in the available space.',
     'New: Row Height and Gutter inputs — same centered calculation for horizontal grids.',
     'New: Plugin window auto-resizes when the Width/Gutter rows appear or disappear.',
     'New: Get from Selection — capture the exact guides on any frame and save them as Fixed Guides (❖) for re-use.',
     'New: Fixed Guides are applied exactly as saved, bypassing any column/row calculations.',
     'Bug: Single-frame right and bottom margins were using stale dimensions from a previous selection.',
     'Bug: Guides could not be saved or deleted due to a Vue 3 reactive Proxy serialization error.',
     'Bug: Column grid outer edges (left of first column, right of last column) were missing, making margins appear as extra columns.',
     'Update: Upgraded to Vue 3.',
     'Update: Replaced Webpack with Vite — build time dropped from ~45s to ~6s.',
    ]
   }
  }
 }
</script>
<style lang="scss">
 @import '../sass/parts/config.scss';
 
 .mini-modal {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 40px;
  font-size: 12px;
  width: 100%;
  height: 100%;
  margin: auto;
  color: var(--figma-color-text);
  &-container {
   position: fixed;
   display: flex;
   inset: 0;
   z-index: 4;
  }
  &--backdrop {
   position: absolute;
   inset: 0;
   background-color: var(--figma-color-bg);
   opacity: .75;
   z-index: 5;
  }
  
  &--header {
   cursor: default;
   display: flex;
   align-items: center;
   width: 100%;
   padding: 1rem;
   border-bottom: 1px solid var(--figma-color-border);
   user-select: none;
   > h4 {
    margin: 0;
    font-size: 11px;
    font-weight: 700;
    font-family: sans-serif;
   }
   b {
    margin-left: auto;
    border-radius: var(--br, 3px);
    &:hover {
     background-color: var(--figma-color-bg-secondary);
    }
   }
  }
  &--body {
   position: relative;
   width: 100%;
   font-size: 10px;
   padding: 1rem;
   overflow-y: auto;
   overflow-x: hidden;
   @include custom-scrollbar($c: var(--figma-color-border));
   h4 {
    margin-bottom: 0;
    font-size: 12px;
   }
   ul {
    margin-block-start: 1rem;
    margin-block-end: 1rem;
    padding-inline-start: 2rem;
    li {
     + li {
      margin-top: .5rem;
     }
    }
   }
   .brand-group {
    display: flex;
    flex-flow: column;
    gap: .6rem;
    text-align: center;
    margin-bottom: 1rem;
    background-color: var(--figma-color-bg-secondary);
    border-radius: var(--br, 3px);
    padding: 1rem;
    user-select: none;
    > * {
     margin: 0;
    }
    img {
     display: block;
     width: 70px;
     height: auto;
     margin: auto;
    }
   }
  }
  &--footer {
   display: flex;
   align-items: center;
   width: 100%;
   padding: 1rem;
   border-top: 1px solid var(--figma-color-border);
   user-select: none;
   a {
    font-size: 10px;
    color: var(--figma-color-text);
    font-weight: normal;
    min-width: unset;
    &:hover {
     border: none;
    }
    &.btn {
      padding: 0 5px;
    }
    + a {
     color: var(--accent);
     margin-left: auto;
    }
   }
  }
 }
</style>