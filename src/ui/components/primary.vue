<template>
  <div id="simple" :class="{ 'lights-out': darkMode }">
    <div class="icon-search">
      <i class="icon icon--search"></i>
      <div class="icon-search--container input">
        <label for="#isearch" style="display: none;"></label>
        <input type="text" 
               id="isearch"
               class="input__field"
               placeholder="What Brand Are You Looking For?"
               v-model="isearch"
               @blur="confirmSearch"/>
        <i @click="clearQuery" class="icon icon--close" v-if="isearch !== ''"></i>
      </div>
      <button class="btn btn-square show-on-mobile"
              type="button"
              @click="showFavourites = !showFavourites"
              :title="showFavourites ? 'Hide Favourites' : 'Show Favourites'">
              <i class="icon" :class="showFavourites ? 'icon--star-on icon--blue' : 'icon--star-off'"></i>
      </button>
    </div>
    <div class="icon-actions">
      <div class="icon-actions__sort">
        Sort
        <div class="icon-actions__select">
          <b @click="sortOpen=!sortOpen">{{ filterByColour ? 'By Colour' : 'Alphabetically' }} <span class="select-menu__icon"></span></b>
          <ul class="select-options" :class="sortOpen ? 'opened' : ''">
            <li v-if="filterByColour" @click.stop="sortByName">Alphabetically</li>
            <li v-if="!filterByColour" @click.stop="sortByColour">By Colour</li>
          </ul>
        </div>
      </div>
      <div class="icon-actions__ver">
        v{{version}}
      </div>
    </div>
    <div class="loader" v-if="!loaded">
      <img
        src="https://cdn.glitch.com/94a91acb-521d-41e5-be37-e8843474659f%2Floading.9f5a9a60.gif"
        alt="loading icon"
      />
    </div>
    <transition name="fade" mode="out-in">
      <div class="grid-wrap favourites-grid" v-if="showFavourites">
        <p v-if="favouritedIcons.length < 1">Add some icons to your Favourites</p>
        <div class="icon-grid">
          <div class="icon-grid--item"
            :class="{selected: (filterByColour ? idx : icon.icons_index) === selectedIcon}"
            v-for="(icon, idx) in favouritedIcons"
            :style="'background-color: #' + icon.hex"
            :key="icon.icons_index + '-fav'"
            :data-iconindex="icon.icons_index + '-fav'"
            @click="selectIcon(icon.title, icon.icons_index)">
            <span :style="$options.filters.contrast(icon.hex) === 'color: #ffffff' ? 'filter: invert(1)' : ''">
              <img :src="icon.title | svgname" :alt="icon.title" />
            </span>
            <h3 :style="icon.hex | contrast">{{ icon.title }}</h3>
            <p :style="icon.hex | contrast">#{{ icon.hex }}</p>
            <i class="favourite-badge icon icon--star-on" :class="$options.filters.contrast(icon.hex) === 'color: #ffffff' ? 'icon--white' : ''"></i>
          </div>
        </div>
      </div>
    </transition>
    <div class="grid-wrap" v-show="loaded">
      <div class="icon-grid" :style="loadButtonStyle">
        <div class="icon-grid--item"
          :class="{selected: (filterByColour ? idx : icon.icons_index) === selectedIcon}"
          v-for="(icon, idx) in filteredIcons.slice(0, itemsLoaded)"
          :title="icon.title"
          :style="'background-color: #' + icon.hex"
          :key="icon.icons_index"
          :data-iconindex="icon.icons_index"
          @click="filterByColour ? selectIcon(icon.title, idx) : selectIcon(icon.title, icon.icons_index)">
          <span :style="$options.filters.contrast(icon.hex) === 'color: #ffffff' ? 'filter: invert(1)' : ''">
            <img :src="icon.title | svgname" :alt="icon.title" />
          </span>
          <h3 :style="icon.hex | contrast">{{ icon.title }}</h3>
          <p :style="icon.hex | contrast">#{{ icon.hex }}</p>
        </div>
        <transition name="fade">
          <div class="icon-grid--item load-more button button--secondary"
              @click="loadMore"
              v-if="itemsLoaded < icons.length && isearch === ''">
            Load {{ specialTrigger ? 'Everything' : 'More' }}
          </div>
        </transition>
      </div>
    </div>
    <transition name="popup" mode="in-out">
      <selection-banner
        :llave="handleIcons(selectedIcon).title"
        :selected="selectedIcon"
        v-if="selectedIcon !== null"
        :identity="handleIcons(selectedIcon)"
        :color-target="handleIcons(selectedIcon).hex"
        :rgb-target="handleIcons(selectedIcon).rgb"
        :icon-target="handleIcons(selectedIcon).title | svgname"
        :icon-name="handleIcons(selectedIcon).title | svgname | sanitizeURL"
      >
      </selection-banner>
    </transition>
  </div>
</template>

<script>
const SimpleIconsSource = 'https://cdn.jsdelivr.net/npm/simple-icons@4.8.0';

export default {
  data() {
    return {
      version: '3.0',
      loaded: false,
      icons: [],
      favouritedIcons: [],
      selectedIcon: null,
      itemsLoaded: 15,
      isearch: '',
      filterByColour: false,
      specialTrigger: false,
      sortOpen: false,
      showFavourites: false,
      showMobileSorts: false,
      darkMode: false,
      SimpleIconsSource: 'https://cdn.jsdelivr.net/npm/simple-icons@4.8.0'
    };
  },
  filters: {
    contrast(hex) {
      let threshold = 130;
      let contrastcolor;

      function hexToR(h) {
        return parseInt(cutHex(h).substring(0, 2), 16);
      }
      function hexToG(h) {
        return parseInt(cutHex(h).substring(2, 4), 16);
      }
      function hexToB(h) {
        return parseInt(cutHex(h).substring(4, 6), 16);
      }
      function cutHex(h) {
        return h.charAt(0) == '#' ? h.substring(1, 7) : h;
      }

      let hRed = hexToR(hex);
      let hGreen = hexToG(hex);
      let hBlue = hexToB(hex);

      let cBrightness = (hRed * 299 + hGreen * 587 + hBlue * 114) / 1000;

      if (cBrightness > threshold) {
        contrastcolor = '#000000';
      } else {
        contrastcolor = '#ffffff';
      }

      return 'color: ' + contrastcolor.toString();
    },
    svgname(icon) {
      let newName,
        hasSpace = icon.indexOf(' ') > -1,
        hasSmartquote = icon.indexOf('’') > -1,
        hasNormalquote = icon.indexOf("'") > -1,
        hasAmp = icon.indexOf('&') > -1,
        hasPlus = icon.indexOf('+') > -1,
        hasExcl = icon.indexOf('!') > -1,
        hasPeriod = icon.indexOf('.') > -1,
        periodIsFirst = icon.indexOf('.') === 0;
      let url = SimpleIconsSource + '/icons/';

      if (hasSpace) {
        return url + icon.toLowerCase().replace(/\s/g, '') + '.svg';
      } else if (hasSmartquote) {
        return url + icon.toLowerCase().replace('’', '') + '.svg';
      } else if (hasNormalquote) {
        return url + icon.toLowerCase().replace("'", '') + '.svg';
      } else if (hasAmp) {
        return url + icon.toLowerCase().replace('&', '-and-') + '.svg';
      } else if (hasPlus) {
        return url + icon.toLowerCase().replace(/[+]/g, 'plus') + '.svg';
      } else if (hasExcl) {
        return url + icon.toLowerCase().replace('!', '') + '.svg';
      } else if (hasPeriod) {
        if (periodIsFirst) {
          return url + icon.toLowerCase().replace('.', 'dot-') + '.svg';
        } else {
          return url + icon.toLowerCase().replace('.', '-dot-') + '.svg';
        }
      } else {
        return url + icon.toLowerCase() + '.svg';
      }
    },
    sanitizeURL(url) {
      return url.slice(url.lastIndexOf('/') + 1, url.length);
    },
  },
  computed: {
    filteredIcons() {
      let searchTerm = this.isearch;

      return this.icons.filter((icon) => {
        let parts = searchTerm.trim().split(' ');

        for (let part of parts) {
          let searchRegex = new RegExp(part, 'i');

          if (!(searchRegex.test(icon.title) || searchRegex.test(icon.hex))) {
            return false;
          }
        }

        return true;
      });
    },
    favoriteIcons() {
      return this.icons.filter((icon) => {
        if(this.selectedIcon === null) {
          return false;
        } else {
          if(!icon.fav) {
            return false;
          }
          return true;
        }
      });
    },
    loadButtonStyle() {
      let style = '';
      let loadHeight = 30,
          gap = 10,
          padding = loadHeight + gap;

      return 'padding-bottom: ' + padding + 'px';
    },
    
  },
  methods: {
    getSimple() {
      this.$http.get(this.SimpleIconsSource + '/_data/simple-icons.json').then((res) => {
        this.icons = res.data.icons;
        // Assigns an initial index and hue to the recieved array for more accurate sorting and searching
        for (let i = 0; i < this.icons.length; i++) {
          this.icons[i].icons_index = i;
          this.icons[i].hsl = this.getHSL(this.icons[i].hex);
          this.icons[i].rgb = this.getRGB(this.icons[i].hex);
        }
        this.loaded = true;
      }, (error) => {
        console.log(error);
      });
    },
    sortByColour() {
      // Trying to sort my icon array by colour, by converting the hex value,
      // apllying the HSL value from the hex and then splitting those values
      // to make a "descending" order of colour. The issue is that the
      // numbers being generated by ".sort()"
      this.icons.sort((a, b) => {
        let aHSL = a.hsl.split(','),
          bHSL = b.hsl.split(',');

        return (
          parseInt(aHSL[0] - bHSL[0]) -
          (aHSL[1] - bHSL[1]) -
          (aHSL[2] - bHSL[2])
        );
      });
      this.filterByColour = true;
      this.selectedIcon = null;
      this.sortOpen = false;
    },
    sortByName() {
      this.icons.sort((a, b) => {
        return a.icons_index - b.icons_index;
      });
      this.filterByColour = false;
      this.selectedIcon = null;
      this.sortOpen = false;
    },
    selectIcon(name, idx) {
      let iconIsSame = this.selectedIcon === idx;
      let noIcon = this.selectedIcon === null;
      let parsedName = encodeURIComponent(name.trim().toLowerCase());

      if (iconIsSame && !noIcon) {
        this.selectedIcon = null;
      } else {
        this.selectedIcon = null;
        setTimeout(() => {
          this.selectedIcon = this.selectedIcon === idx ? null : idx;
        }, 100);
      }
    },
    loadMore() {
      let loadInt = Math.floor(document.getElementsByClassName('icon-grid')[0].clientWidth / document.getElementsByClassName('icon-grid--item')[0].clientWidth) * 2;

      if (this.specialTrigger) {
        this.itemsLoaded = this.icons.length;
      } else {
        if (this.itemsLoaded < this.icons.length)
          this.itemsLoaded = loadInt + this.itemsLoaded;
      }
      return;
    },
    confirmSearch() {
      let url = window.location.href,
        typedSomething = this.isearch !== '',
        searchQueryExists = window.location.search !== '',
        query = window.location.href.substring(
          window.location.href.indexOf('=') + 1
        );
      return;
    },
    getHSL(hex) {
      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex),
        r = parseInt(result[1], 16),
        g = parseInt(result[2], 16),
        b = parseInt(result[3], 16);

      (r /= 255), (g /= 255), (b /= 255);

      let max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      let h,
        s,
        l = (max + min) / 2;

      if (max == min) {
        h = s = 0; // achromatic
      } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }

      s = s * 100;
      s = Math.round(s);
      l = l * 100;
      l = Math.round(l);
      h = Math.round(360 * h);

      return h + ',' + s + ',' + l;
    },
    getRGB(hex) {
      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    },
    enableDarkMode() {
      this.darkMode = !this.darkMode;
      this.meta_theme();
    },
    clearQuery() {
      this.isearch = '';
      this.selectedIcon = null;
    },
    favToggle() {
      this.showFavourites = !this.showFavourites;
    },
    handleIcons(idx) {
      let arr = this.icons || this.favouritedIcons;
      return arr[idx];
    },
    updateFavourites() {
      let favourites = this.favouritedIcons;
      if ((this.favouritedIcons.length > 0) && this.loaded) {
        parent.postMessage(
          { pluginMessage: { type: "update-faves", favourites } },
          "*"
        );
      } else if((this.favouritedIcons.length === 0) && this.loaded) {
        favourites = [];
        parent.postMessage(
          { pluginMessage: { type: "update-faves", favourites } },
          "*"
        );
      } else {
        parent.postMessage(
          { pluginMessage: { type: "get-faves" } },
          "*"
        );
      }
    }
  },
  mounted() {
    // initiated the document
    onmessage = (event) => {
      let data = event.data.pluginMessage;
      if (data) {
        this.favouritedIcons = data;
      } else {
        this.updateFavourites();
      }
    }

    this.getSimple();

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Shift') {
        this.specialTrigger = true;
      }
    });
    window.addEventListener('keyup', (event) => {
      this.specialTrigger = false;
    });
  },
  components: {
    'selection-banner': {
      props: ['llave', 'selected', 'colorTarget', 'rgbTarget', 'iconTarget', 'iconName', 'identity'],
      template: `
          <div class="notification-toast selection">
            <div class="bubble">
              <div class="bubble-actions">
                <button class="button button--secondary" type="button" @click="placeColor(rgbTarget)"><copy-icon /> Use Colour</button>
                <button class="button button--secondary" type="button" @click="favouriteToggle()"><star-icon :filled="faved" /> {{faved ? 'Favourited':'Favourite'}}</button>
                <button type="button" @click="placeIcon()" class="button button--primary"><download-icon /> Place Icon</button>
              </div>
            </div>
          </div>
        `,
      data() {
        return {
          svgData: '',
          faved: false
        };
      },
      mounted() {
        this.faved = this.$parent.favouritedIcons.some((e) => e.icons_index === this.identity.icons_index);
        this.getRawSVG(this.iconTarget);
      },
      computed: {
        rawSVG() {
          this.$http.get(this.iconTarget).then((s) => {
            return s.data;
          });
        },
      },
      methods: {
        placeColor(str) {
          let color = str;
          
          parent.postMessage(
            { pluginMessage: { type: "create-color", color } },
            "*"
          );
        },
        placeIcon() {
          let rawsvg = this.svgData;
          let title = this.llave;
          parent.postMessage(
            { pluginMessage: { type: "create-icon", rawsvg, title } },
            "*"
          );
        },
        getRawSVG: async function(url) {
          this.$http.get(url).then((s) => {
            this.svgData = s.data;
          });
        },
        favouriteToggle() {
          if (this.faved) {
            this.faved = false;
            this.$parent.favouritedIcons.splice(this.$parent.favouritedIcons.findIndex(e => e.icons_index === this.identity.icons_index),1);
            this.$parent.updateFavourites();
          } else {
            this.faved = true;
            this.$parent.favouritedIcons.push(this.identity)
            this.$parent.updateFavourites();
          }
        }
      },
      components: {
        'copy-icon': {
          template: `
              <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            `,
        },
        'download-icon': {
          template: `
              <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/></svg>
            `,
        },
        'checkmark-icon': {
          template: `
              <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            `,
        },
        'star-icon' : {
          props: ['filled'],
          template: `
              <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" :fill="filled ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          `
        }
      },
    },
  },
};
</script>

<style lang="scss">
@import '../sass/parts/config.scss';

:root {
  --theme: 'light';
  --accent: #{$a};
}

* {
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
  font-family: $fontfam;
  @include theme('light');
  font-size: font(22px, 16px, 1920px, 786px);
  margin: 0;
  @include respond-to('mobile') {
    font-size: font(22px, 16px, 786px, 320px);
  }
}

a {
  text-decoration: none;
  color: darken($accent, 10%);
  font-weight: 700;
  &:hover,
  &:focus {
    border-bottom: $border-width + 0px dashed #ccc;
  }
  &:visited {
    font-style: italic;
    border-bottom: $border-width + 0px dashed $accent;
  }
}

code {
  border-radius: 2px;
  padding: 3px 5px;
  font-size: 1em;
  font-weight: 800;
  color: inherit;
  background-color: rgba(setcolor($selectedTheme, fg), 0.05);
}

.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 3.5em;
  font-weight: 700;
  padding: $gap + 0px;
  width: 100%;
  text-align: center;
}
.button--primary:enabled:active {
  border: none !important;
}
.button,
.btn {
  position: relative;
  @include buttonDefault();
  z-index: 1;
  &:focus,
  &:hover {
    outline: none;
    background-color: #F0F0F0;
  }
  &--primary {
    color: #fff;
    background-color: $accent;
    &:focus,
    &:hover {
      background-color: darken($accent, 15%);
    }
  }
  &-secondary {
    color: $accent;
    background-color: setcolor($selectedTheme, bg);
    border: 4px solid $accent;
    &:focus,
    &:hover {
      background-color: darken(setcolor($selectedTheme, bg), 10%);
      border-color: darken($accent, 15%);
      color: darken($accent, 15%);
    }
  }
  &-default {
    color: inherit;
    background-color: rgba(setcolor($selectedTheme, fg), 0.055);
    user-select: none;
    border: 1px solid #eee;
    &:focus,
    &:hover {
      background-color: setcolor($selectedTheme, bg);
    }
  }
  &-square {
    padding: 0;
    text-align: center;
    min-width: $searchbar + 0px;
    min-height: $searchbar + 0px;
  }
  svg,
  img {
    display: inline-block;
    vertical-align: middle;
    width: auto;
    height: 1em;
  }
}

.show-on-mobile {
  // display: none;
  position: absolute;
  top: -100px;
  right: -100px;
  visibility: hidden;
  opacity: 0;
  @include respond-to('mobile') {
    position: relative;
    top: 0;
    right: 0;
    display: block;
    visibility: visible;
    opacity: 1;
  }
}
.hide-on-mobile {
  @include respond-to('mobile') {
    // display: none;
    visibility: hidden;
    opacity: 0;
  }
  display: block;
  visibility: visible;
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: $far $curve all;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.popup-enter-active,
.popup-leave-active {
  transition: $near $snap all;
}
.popup-enter,
.popup-leave-to {
  opacity: 0;
  transform: translatey(100%);
}

#simple {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  .block {
    cursor: pointer;
    width: 100%;
    height: 100px;
    flex-basis: 100px;
    border: 2px solid #ececec;
    border-radius: 3px;
    margin: $gap + 0px;
    padding: ($gap * 2)+0px;
    text-align: center;
  }
  .si-credits {
    width: 100%;
    font-size: 0.8em;
    text-align: center;
  }
}
.icon-search {
  $bg: setcolor($selectedTheme, bg);
  position: relative;
  display: flex;
  width: 100%;
  padding: 5px 0;
  background-color: rgba($bg, 1);
  border-bottom: 1px solid rgba(0,0,0,.1);
  z-index: 2;
  
  .input {
    padding-top: 0;
    padding-bottom: 0;
    border: none !important;
    margin: 0;
  }

  button {
    background: none;
    margin-right: ($gap / 2) + 0px;
    margin-left: ($gap / 2) + 0px;
    z-index: 1;
    &.active {
      box-shadow:0 0 0 $border-width + 0px $accent;
      color: setcolor($selectedTheme, fg);
      background-color: darken(setcolor($selectedTheme, bg), 10%);
    }
    @include respond-to('mobile') {
      &.hide-on-mobile {
        $newGap: $gap/2;
        position: absolute;
        right: 0px;
        background-color: setcolor($selectedTheme, bg);
        transition: $near $snap opacity;

        &:nth-of-type(1) {
          top: ($searchbar + $newGap)+0px;
          transform: translateY(-($searchbar + $newGap)+0px);
        }
        &:nth-of-type(2) {
          top: (($searchbar * 2) + ($newGap * 2))+0px;
          transform: translateY(-(($searchbar * 2) + ($newGap * 2))+0px);
        }
      }
      &.open {
        display: block;
        visibility: visible;
        opacity: 1;
        transition: $near $snap all;
        &:nth-of-type(1),
        &:nth-of-type(2) {
          transform: translateY(0);
          margin-top: ($gap/2)+0px;
        }
      }
    }
    i {
      display: block;
      width: $searchbar + 0px;
      height: $searchbar + 0px;
    }
  }
  &--container {
    position: relative;
    width: 100%;
    height: $searchbar + 0px;
    font-family: $fontfam;
    font-weight: 900;

    input {
      position: relative;
      width: 100%;
      height: 100%;
      font-family: inherit;
      font-weight: 400;
      border: 1px solid rgba(#eee, 0);
      border-radius: 3px;
      padding: 0;
      z-index: 1;
      &:focus {
        outline: none;
        // background-color: setcolor($selectedTheme, bg);
        // border-color: #eee;
      }
    }

    i {
      cursor: pointer;

      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: $searchbar + 0px;
      height: $searchbar + 0px;
      opacity: 0.54;
      user-select: none;
      z-index: 1;
      &:hover {
        opacity: 1;
      }
    }
  }

  .id-text {
    position: absolute;
    left: 0;
    bottom: 5px;
    padding-left: ($searchbar + ($gap * 2))+0px;
    display: block;
    text-align: right;
    margin: 0;
    z-index: 1;
    opacity: 0.54;
  }
}
.icon-actions {
  $bg: setcolor($selectedTheme, bg);
  position: relative;
  display: flex;
  width: 100%;
  padding: 0px $gap + 0px;
  font-size: 12px;
  background-color: rgba($bg, 1);
  border-bottom: 1px solid rgba(0,0,0,.1);
  min-height: 40px;
  z-index: 2;

  &__sort {
    display: flex;
    align-items: center;
    font-size: inherit;
    border-right: 1px solid rgba(0,0,0,.1);
    .select-menu__button {
      font-size: inherit;
      margin-left: .5rem;
      color: $a;
    }
  }
  &__select {
    cursor: default;
    user-select: none;
    position: relative;
    display: flex;
    align-items: center;
    margin-left: .2rem;
    margin-right: .2rem;

    b {
      display: flex;
      align-items: center;  
      color: $a;
      padding: ($gap/2) + 0px ($gap/3) + 0px;
      padding-right: 0;
      font-weight: normal;
      border-radius: 3px;
      &:hover {
        background-color: #F0F0F0;
      }
      span {
        position: relative;
        opacity: 1;
        display: inline-block;
        width: 20px;
        height: 20px;
      }
    }
    .select-options {
      position: absolute;
      top: 100%;
      left: 0;
      margin: 0;
      padding:0;
      list-style-type: none;
      border: 1px solid rgba(0,0,0,.1);
      background-color: rgba($bg, 1);
      border-radius: 3px;
      margin-top: ($gap/3)+0px;
      overflow: hidden;
      transform: translateY(-100%);
      visibility: hidden;
      opacity: 0;
      transition: $near $curve all;
      &.opened {
        transform: translateY(0%);
        opacity: 1;
        visibility: visible;
      }
      li {
        padding: ($gap/2) + 0px $gap + 0px;
        &:hover {
          background-color: #F0F0F0;
        }
      }
    }
  }
  &__ver {
    margin-left:auto;
    font-size: 10px;
    align-self: center;
  }
}

.grid-wrap {
  position: relative;
  padding: $gap + 0px;
  &:not(.favourites-grid) {
    overflow-x: hidden;
    overflow-y: auto;
    @include custom-scrollbar();
  }
  &.favourites-grid {
    background-color: #F0F0F0;
    p {
      font-size: 12px;
      text-align: center;
      padding: 0px;
      margin: 0;
      font-weight: 600;
    }
  }
}

.icon-grid {
  --grid-min-width: 90px;

  position: relative;
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(var(--grid-min-width), 1fr));
  grid-auto-rows: min-content;
  grid-column-gap: $gap + 0px;
  grid-row-gap: $gap + 0px;
  grid-auto-flow: dense;

  &--item {
    cursor: pointer;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: var(--grid-min-width);
    padding: .5rem;
    border-radius: 6px;
    text-align: center;
    overflow: hidden;
    outline-offset: ($gap/2 - ($border-width/2))+0px;
    user-select: none;
    > * {
      margin-top: 0;
    }
    &.load-more {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
    }
    &.selected {
      box-shadow: inset 0 0 0 1px $a,
                  inset 0 0 0 4px #fff;
    }
    span {
      display: inline-block;
      width: 100%;
      img {
        width: 30px;
      }
    }
    h3 {
      font-size: 10px;
      opacity: .5;
      font-weight: 400;
    }
    p {
      font-size: 12px;
      margin-bottom: 0;
    }
    .favourite-badge {
      position: absolute;
      top: 0;
      right: 0;
      border-radius: 4px;
    }
  }
}

.notification-toast {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 1;
  // padding: ($gap/2)+0px;
  &.selection {
    .bubble {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      &-icon {
        width: auto;
        height: 55px;
      }
      &-actions {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
      }
    }
  }
  &.copied {
    .bubble {
      border: 5px solid darken($accent, 10%);
    }
  }
  .bubble {
    @include theme($selectedTheme);
    background-color: rgba(setcolor($selectedTheme, bg), 0.9);
    @supports (backdrop-filter: blur(10px)) {
      backdrop-filter: saturate(180%) blur(10px);
    }
    text-align: center;
    padding: ($gap/2)+0px;
    font-size: 1.5rem;
    font-weight: 900;
    p {
      margin: 0;
    }
    &-actions {
      button {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1 1 40%;
        min-width: unset;
        margin: ($gap/2)+0px;
        &.button--primary {
          width: 100%;
        }
        svg {
          margin-right: .2rem;
        }
      }
    }
  }
}

.lights-out {
  @include theme('dark');
  .btn {
    &-secondary {
      background-color: setcolor('dark', bg);
    }
    &-default {
      background-color: rgba(setcolor('dark', fg), 0.055);
      &:focus,
      &:hover {
        background-color: setcolor('dark', bg);
      }
    }
  }
  .icon-search {
    &:before {
      filter: invert(1);
    }
    &:after {
      background-color: rgba(setcolor('dark', bg), 0.9);
    }
  }
  button {
    &.active {
      color: setcolor('dark', fg);
      background-color: darken(setcolor('dark', bg), 10%);
    }
  }
  input {
    color: inherit;
    background-color: rgba(setcolor('dark', fg), 0.055);
    &:focus {
      color: inherit;
      background-color: setcolor('dark', bg);
    }
  }
  code {
    background-color: rgba(setcolor('dark', fg), 0.3);
  }
  .notification-toast {
    .bubble {
      @include theme('dark');
      background-color: rgba(setcolor('dark', bg), 0.9);
      &-details {
        img {
          filter: invert(1);
        }
      }
    }
  }
  @include respond-to('mobile') {
    .hide-on-mobile {
      color: setcolor('dark', fg) !important;
      background-color: setcolor('dark', bg) !important;
    }
  }
}
</style>
