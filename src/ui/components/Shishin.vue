<template>
  <div class="gg-app">
    <div class="gg-app--tabs">
      <ul>
        <template v-for="(view, idx) in views" :key="view">
          <li v-if="idx !== views.length - 1" class="gg-tab" :class="{'gg-tab_active' : currentView == idx}" @click="toggleView(idx)">{{view}}</li>
        </template>
        <li class="gg-tab version-tab" :class="{'gg-tab_active' : currentView == 2}" @click="toggleView(2)" key="whats-new"><icon name="question"></icon></li>
      </ul>
    </div>
    <div class="gg-app--view">
      <div class="gg-app--view_guides" v-if="currentView == 0">
        <div class="gg-row">
          <div class="gg-input gg-input--num">
            <icon name="margin-left"></icon>
            <input type="number" min="1" max="1000" v-if="!colMarginsLinked" v-model.number="gPosition.marginLeft" @keyup.enter="inputActivity ? addGuides() : ''" placeholder="Margin" />
            <input type="number" min="1" max="1000" v-if="colMarginsLinked" v-model.number="gPosition.marginLRlinked" @keyup.enter="inputActivity ? addGuides() : ''" placeholder="Margin" />
          </div>
          <div class="gg-input gg-input--link" :class="{'linked' : colMarginsLinked}" @click="colMarginsLinked=!colMarginsLinked">
            <icon :name="colMarginsLinked ? 'linked' : 'unlinked'"></icon>
          </div>
          <div class="gg-input gg-input--num">
            <icon name="margin-right"></icon>
            <input type="number" min="1" max="1000" v-if="!colMarginsLinked" v-model.number="gPosition.marginRight" @keyup.enter="inputActivity ? addGuides() : ''" placeholder="Margin" />
            <input type="number" min="1" max="1000" v-if="colMarginsLinked" v-model.number="gPosition.marginLRlinked" @keyup.enter="inputActivity ? addGuides() : ''" placeholder="Margin" />
          </div>
        </div>
        <div class="gg-row">
          <div class="gg-input gg-input--slide">
            <icon name="columns"></icon>
            <b>{{ gridColumnsCount }}</b>
            {{gPosition.gridCols !== 1 ? 'Columns' : 'Column'}}
            <div class="range-track">
              <input type="range" v-model.number="gPosition.gridCols" name="gridColumns" min="0" max="12" step="1">
            </div>
          </div>
        </div>
        <div class="gg-row" v-if="gPosition.gridCols > 1">
          <div class="gg-input gg-input--num">
            <icon name="width"></icon>
            <input type="number" min="1" max="10000" v-model.number="gPosition.colWidth" @keyup.enter="inputActivity ? addGuides() : ''" placeholder="Width" />
          </div>
          <div class="gg-input gg-input--num">
            <icon name="gutter-col"></icon>
            <input type="number" min="0" max="10000" v-model.number="gPosition.gutterCol" @keyup.enter="inputActivity ? addGuides() : ''" placeholder="Gutter" />
          </div>
        </div>
        <hr class="gg-divider">
        <div class="gg-row">
          <div class="gg-input gg-input--num">
            <icon name="margin-top"></icon>
            <input type="number" min="1" max="1000" v-if="!rowMarginsLinked" v-model.number="gPosition.marginTop" @keyup.enter="inputActivity ? addGuides() : ''" placeholder="Margin" />
            <input type="number" min="1" max="1000" v-if="rowMarginsLinked" v-model.number="gPosition.marginTBlinked" @keyup.enter="inputActivity ? addGuides() : ''" placeholder="Margin" />
          </div>
          <div class="gg-input gg-input--link" :class="{'linked' : rowMarginsLinked}" @click="rowMarginsLinked=!rowMarginsLinked">
            <icon :name="rowMarginsLinked ? 'linked' : 'unlinked'"></icon>
          </div>
          <div class="gg-input gg-input--num">
            <icon name="margin-bottom"></icon>
            <input type="number" min="1" max="1000" v-if="!rowMarginsLinked" v-model.number="gPosition.marginBottom" @keyup.enter="inputActivity ? addGuides() : ''" placeholder="Margin" />
            <input type="number" min="1" max="1000" v-if="rowMarginsLinked" v-model.number="gPosition.marginTBlinked" @keyup.enter="inputActivity ? addGuides() : ''" placeholder="Margin" />
          </div>
        </div>
        <div class="gg-row">
          <div class="gg-input gg-input--slide">
            <icon name="rows"></icon>
            <b>{{ gridRowsCount }}</b>
            {{gPosition.gridRows !== 1 ? 'Rows' : 'Row'}}
            <div class="range-track">
              <input type="range" v-model.number="gPosition.gridRows" name="gridRows" min="0" max="12" step="1">
            </div>
          </div>
        </div>
        <div class="gg-row" v-if="gPosition.gridRows > 1">
          <div class="gg-input gg-input--num">
            <icon name="height"></icon>
            <input type="number" min="1" max="10000" v-model.number="gPosition.rowHeight" @keyup.enter="inputActivity ? addGuides() : ''" placeholder="Height" />
          </div>
          <div class="gg-input gg-input--num">
            <icon name="gutter-row"></icon>
            <input type="number" min="0" max="10000" v-model.number="gPosition.gutterRow" @keyup.enter="inputActivity ? addGuides() : ''" placeholder="Gutter" />
          </div>
        </div>
      </div>
      <div class="gg-app--view_saved" v-if="currentView == 1">
        <ul class="gg-app--view_saved-guideslist" :class="{'open' : actionTrayOpen}" v-if="storedData.length > 0">
          <li v-for="(guide, idx) in storedData" class="button button--secondary" :key="idx">
            <span v-if="guide.type === 'raw'" class="guide-type-icon" title="Fixed Guides">❖</span>
            <span v-if="guide.preset" class="preset-chip">PRESET</span>
            <p @click.stop="addSavedGuide(idx)">{{guide.name}}</p>
            <b class="icon-button" @click="removeItem(idx)" :title="`Delete ${guide.name}`">
              <icon name="trash"></icon>
            </b>
          </li>
        </ul>
        <p class="gg-app--view_saved-guideslist--isEmpty" v-if="storedData.length < 1">You haven't saved any guides... yet 😉</p>
      </div>
      <div class="gg-app--view_whatsnew" v-if="currentView == 2">
        <whats-new></whats-new>
      </div>
    </div>
    <div class="gg-app--controls" v-if="currentView < 1">
      <div class="gg-app--controls_top">
        <div @click="addIndividualGuide('edgeLeft')" title="Add Guide to Left Edge">
          <icon name="left-edge"></icon>
        </div>
        <div @click="addIndividualGuide('centerVer')" title="Add Guide to the center vertically">
          <icon name="center-v"></icon>
        </div>
        <div @click="addIndividualGuide('edgeRight')" title="Add Guide to Right Edge">
          <icon name="right-edge"></icon>
        </div>
        <div @click="clearAll()" title="Clear All Guides">
          <icon name="clear"></icon>
        </div>
        <div @click="addIndividualGuide('edgeTop')" title="Add Guide to Top Edge">
          <icon name="top-edge"></icon>
        </div>
        <div @click="addIndividualGuide('centerHor')" title="Add to the center horizontally">
          <icon name="center-h"></icon>
        </div>
        <div @click="addIndividualGuide('edgeBottom')" title="Add Guide to Bottom Edge">
          <icon name="bottom-edge"></icon>
        </div>
      </div>
      <div class="gg-app--controls_bottom">
        <button class="button" @click="inputActivity ? addGuides() : ''" :class="inputActivity ? 'button--primary' : 'button--secondary button--disabled'">Add Guides</button>
        <div class="additional-controls button button--secondary" @click="actionTrayOpen=!actionTrayOpen">
          <icon name="caret" :style="actionTrayOpen ? 'transform: rotate(180deg)' : ''"></icon>
        </div>
        <ul class="gg-app--actions" :class="{'open' : actionTrayOpen}">
          <li class="button button--secondary" @click="getGuidesFromSelection()">Get from Selection</li>
          <li class="button" @click="resetFields()" :class="inputActivity ? 'button--secondary' : 'button--disabled'">Reset Fields</li>
          <li class="button" @click="openSaveModal()" :class="inputActivity ? 'button--secondary' : 'button--disabled'">Save Current Guides</li>
        </ul>
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <div class="gg-app--modal" v-if="saving">
        <div class="gg-app--modal_body">
          <input type="text" placeholder="Name your guides..." v-model="saveName" @keyup.enter="saveGuides()"/>
        </div>
        <div class="gg-app--modal_footer">
          <div class="button" @click="saveGuides()" :class="saveName ? 'button--primary' : 'button--disabled'">Save</div>
          <div class="button button--secondary" @click="cancelSave()">Cancel</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import whatsNew from './whatsNew';
  import icon from './icons/r-icons';

  export default {
    data() {
      return {
        version: '6.0',
        currentView: 0,
        views: ['Guide Config', 'Saved', 'ℹ️'],
        frameWidth: null,
        frameHeight: null,
        frames: [],
        colMarginsLinked: true,
        rowMarginsLinked: true,
        gPosition: {
          marginLeft: '',
          marginRight: '',
          marginLRlinked: '',
          marginTop: '',
          marginBottom: '',
          marginTBlinked: '',
          gridCols: 0,
          gridRows: 0,
          colWidth: '',
          gutterCol: '',
          rowHeight: '',
          gutterRow: ''
        },
        actionTrayOpen: false,
        pendingAddGuides: false,
        rawGuidesFromSelection: null,
        storedData: [],
        tempData: [],
        saveName: '',
        saving: false,
        saved: false
      };
    },
    mounted() {
      window.onmessage = (event) => {
        let data = event.data.pluginMessage;
        if (!data) return;
        if (data.frames !== undefined) {
          this.frames = data.frames;
          this.frameWidth = data.frames[0].width;
          this.frameHeight = data.frames[0].height;
          if (this.pendingAddGuides) {
            this.pendingAddGuides = false;
            this.computeAndSendGuides();
          }
        }
        if (data.storedData !== undefined) {
          this.storedData = data.storedData;
        }
        if (data.rawGuidesFromSelection !== undefined) {
          this.rawGuidesFromSelection = data.rawGuidesFromSelection;
          this.actionTrayOpen = false;
          this.saving = true;
        }
      };
      this.getSavedGuides();
      window.addEventListener('keydown', (event) => {
        let ctrlPressed = event.ctrlKey;
        let shiftPressed = event.shiftKey;
        let sPressed = event.keyCode === 83;
        let trying2save = ctrlPressed && shiftPressed && sPressed;
        if (trying2save && this.inputActivity) {
          this.saving = true;
        }
      });
    },
    computed: {
      inputActivity() {
        if(this.currentView == 0) {
          let colMarginPopulated = this.colMarginsLinked
            ? this.gPosition.marginLRlinked !== ''
            : (this.gPosition.marginLeft !== '' || this.gPosition.marginRight !== '');
          let rowMarginPopulated = this.rowMarginsLinked
            ? this.gPosition.marginTBlinked !== ''
            : (this.gPosition.marginTop !== '' || this.gPosition.marginBottom !== '');
          return colMarginPopulated || rowMarginPopulated || this.gPosition.gridCols > 0 || this.gPosition.gridRows > 0;
        }
        return false;
      },
      gridColumnsCount() {
        return this.gPosition.gridCols > 0 ? this.gPosition.gridCols : 'No'
      },
      gridRowsCount() {
        return this.gPosition.gridRows > 0 ? this.gPosition.gridRows : 'No'
      }
    },
    watch: {
      'gPosition.gridCols'() { this.updateUIHeight(); },
      'gPosition.gridRows'() { this.updateUIHeight(); },
    },
    methods: {
      updateUIHeight() {
        let height = 313;
        if (this.gPosition.gridCols > 1) height += 40;
        if (this.gPosition.gridRows > 1) height += 40;
        parent.postMessage({ pluginMessage: { type: 'resize', height } }, '*');
      },
      getFrameDimensions() {
        parent.postMessage({ pluginMessage: { type: "request-dimensions" } }, "*");
      },
      toggleView(num){
        switch(num) {
          case 0:
            this.currentView = 0;
            break;
          case 1:
            this.getSavedGuides();
            this.currentView = 1;
            break;
          case 2:
            this.currentView = 2;
            break;
          default:
            break;
        }
      },
      clearAll() {
        parent.postMessage({ pluginMessage: { type: 'clear-all' } }, '*');
      },
      addIndividualGuide(dirType) {
        parent.postMessage({ pluginMessage: { type: 'split' , dirType} }, '*');
      },
      addGuides() {
        if (!this.inputActivity) return;
        this.pendingAddGuides = true;
        this.getFrameDimensions();
      },
      computeAndSendGuides() {
        if (this.currentView !== 0 || !this.inputActivity) return;
        let allData = [];
        this.frames.forEach(e => {
          let frameGuides = [];
          const xMargins = this.marginsX(e.width);
          const yMargins = this.marginsY(e.height);
          const cols = this.columns(e.width);
          const rows = this.rows(e.height);
          if (xMargins) frameGuides = frameGuides.concat(xMargins);
          if (yMargins) frameGuides = frameGuides.concat(yMargins);
          if (cols) frameGuides = frameGuides.concat(cols);
          if (rows) frameGuides = frameGuides.concat(rows);
          allData.push(frameGuides);
        });
        this.tempData = allData;
        parent.postMessage({ pluginMessage: { type: "add-guides", data: allData } }, "*");
      },
      marginsX(width) {
        let frameWidth = width;
        if (this.colMarginsLinked) {
          if (this.gPosition.marginLRlinked !== '') {
            let marginLeft = {
              axis: "X",
              offset: this.gPosition.marginLRlinked
            };
            let marginRight = {
              axis: "X",
              offset: frameWidth - this.gPosition.marginLRlinked
            };
            return [marginLeft, marginRight]
          }
        } else {
          let margins = []
          if (this.gPosition.marginLeft !== '') {
            let marginLeft = {
              axis: "X",
              offset: this.gPosition.marginLeft
            };
            margins.push(marginLeft)
          }
          if (this.gPosition.marginRight !== '') {
            let marginRight = {
              axis: "X",
              offset: frameWidth - this.gPosition.marginRight
            };
            margins.push(marginRight)
          }
          return margins
        }
      },
      marginsY(height) {
        let frameHeight = height;
        if (this.rowMarginsLinked) {
          if (this.gPosition.marginTBlinked !== '') {
            let marginTop = {
              axis: "Y",
              offset: this.gPosition.marginTBlinked
            };
            let marginBottom = {
              axis: "Y",
              offset: frameHeight - this.gPosition.marginTBlinked
            };
            return [marginTop, marginBottom]
          }
        } else {
          let margins = [];
          if (this.gPosition.marginTop !== '') {
            let marginTop = {
              axis: "Y",
              offset: this.gPosition.marginTop
            };
            margins.push(marginTop)
          }
          if (this.gPosition.marginBottom !== '') {
            let marginBottom = {
              axis: "Y",
              offset: frameHeight - this.gPosition.marginBottom
            };
            margins.push(marginBottom)
          }
          return margins
        }
      },
      columns(width) {
        let frameWidth = width;
        const numCols = this.gPosition.gridCols;
        if (numCols <= 0) return;
        let getLeftMargin = this.colMarginsLinked ? this.gPosition.marginLRlinked ? this.gPosition.marginLRlinked : this.gPosition.marginLeft : this.gPosition.marginLeft;
        let getWidth = !this.colMarginsLinked ? (this.gPosition.marginRight ? (frameWidth - this.gPosition.marginRight) : frameWidth) - (getLeftMargin ? getLeftMargin : 0) : (frameWidth - this.gPosition.marginLRlinked) - getLeftMargin;

        const cw = this.gPosition.colWidth;
        const gw = this.gPosition.gutterCol;

        if ((cw || gw) && numCols > 1) {
          const colW = cw || ((getWidth - (numCols - 1) * gw) / numCols);
          const gutW = gw || 0;
          const totalGridWidth = numCols * colW + (numCols - 1) * gutW;
          const centerX = (getLeftMargin || 0) + getWidth / 2;
          const startX = centerX - totalGridWidth / 2;
          const guides = [];
          for (let i = 0; i < numCols; i++) {
            const colStart = startX + i * (colW + gutW);
            const colEnd = colStart + colW;
            guides.push({ axis: "X", offset: Math.round(colStart) });
            guides.push({ axis: "X", offset: Math.round(colEnd) });
          }
          return guides;
        }

        let getColumn = getWidth / numCols;
        let indColumns = [];
        for (let i = 1; i < numCols; i++) {
          let smartOffset = getLeftMargin ? Math.round(getColumn * i + getLeftMargin) : Math.round(getColumn * i);
          indColumns.push({ axis: "X", offset: smartOffset });
        }
        return indColumns;
      },
      rows(height) {
        let frameHeight = height;
        const numRows = this.gPosition.gridRows;
        if (numRows <= 0) return;
        let getTopMargin = this.rowMarginsLinked ? this.gPosition.marginTBlinked ? this.gPosition.marginTBlinked : this.gPosition.marginTop : this.gPosition.marginTop;
        let getHeight = !this.rowMarginsLinked ? (this.gPosition.marginBottom ? (frameHeight - this.gPosition.marginBottom) : frameHeight) - (getTopMargin ? getTopMargin : 0) : (frameHeight - this.gPosition.marginTBlinked) - getTopMargin;

        const rh = this.gPosition.rowHeight;
        const gr = this.gPosition.gutterRow;

        if ((rh || gr) && numRows > 1) {
          const rowH = rh || ((getHeight - (numRows - 1) * gr) / numRows);
          const gutH = gr || 0;
          const totalGridHeight = numRows * rowH + (numRows - 1) * gutH;
          const centerY = (getTopMargin || 0) + getHeight / 2;
          const startY = centerY - totalGridHeight / 2;
          const guides = [];
          for (let i = 0; i < numRows; i++) {
            const rowStart = startY + i * (rowH + gutH);
            const rowEnd = rowStart + rowH;
            guides.push({ axis: "Y", offset: Math.round(rowStart) });
            guides.push({ axis: "Y", offset: Math.round(rowEnd) });
          }
          return guides;
        }

        let getRow = getHeight / numRows;
        let indRows = [];
        for (let i = 1; i < numRows; i++) {
          let smartOffset = getTopMargin ? Math.round(getRow * i + getTopMargin) : Math.round(getRow * i);
          indRows.push({ axis: "Y", offset: smartOffset });
        }
        return indRows;
      },
      addSavedGuide(dataID){
        let guide = this.storedData[dataID];
        if (guide.type === 'raw') {
          parent.postMessage({ pluginMessage: { type: "apply-raw-guides", guides: guide.guides.map(g => ({ axis: g.axis, offset: g.offset })) } }, "*");
          return;
        }
        this.gPosition = guide.data;
        this.currentView = 0;
        this.addGuides();
        // console.log(this.gPosition);
        // parent.postMessage({ pluginMessage: { type: "add-guides", data: guide.data } }, "*");
      },
      removeItem(dataID){
        this.storedData.splice(dataID, 1);
        parent.postMessage({ pluginMessage: { type: "update-saved-guides", savedGuides: JSON.parse(JSON.stringify(this.storedData)) } }, "*");
        this.getSavedGuides();
      },
      saveGuides(){
        if (!this.saveName) return;
        let savedData;
        if (this.rawGuidesFromSelection) {
          savedData = {
            name: this.saveName,
            type: 'raw',
            guides: this.rawGuidesFromSelection.map(g => ({ axis: g.axis, offset: g.offset }))
          };
        } else if (this.inputActivity) {
          savedData = {
            name: this.saveName,
            view: this.currentView,
            data: { ...this.gPosition }
          };
        } else {
          return;
        }
        parent.postMessage({ pluginMessage: { type: "save-guides", savename: this.saveName, savedata: savedData } }, "*");
        this.rawGuidesFromSelection = null;
        this.saving = false;
        this.saveName = '';
      },
      openSaveModal() {
        this.rawGuidesFromSelection = null;
        this.saving = true;
      },
      cancelSave() {
        this.saving = false;
        this.rawGuidesFromSelection = null;
        this.saveName = '';
      },
      saveGuidesOLD() {
        this.actionTrayOpen = false;
        if(this.inputActivity) {
          let savedData = {
            name: this.saveName,
            data: this.tempData
          };
          parent.postMessage({ pluginMessage: { type: "save-guides", savename: this.saveName, savedata: savedData} }, "*");
          this.saving = false;
          this.saveName = '';
          this.saved = true;
          setTimeout(()=>{
            this.saved = false;
          }, 3000);
        }
      },
      getSavedGuides() {
        parent.postMessage({ pluginMessage: { type: "get-saved-guides" } }, "*");
      },
      getGuidesFromSelection() {
        this.actionTrayOpen = false;
        parent.postMessage({ pluginMessage: { type: "get-guides-from-selection" } }, "*");
      },
      resetFields() {
        let blanks = {
          marginLeft: '',
          marginRight: '',
          marginLRlinked: '',
          marginTop: '',
          marginBottom: '',
          marginTBlinked: '',
          gridCols: 0,
          gridRows: 0,
          colWidth: '',
          gutterCol: '',
          rowHeight: '',
          gutterRow: ''
        };
        this.actionTrayOpen = false;
        this.gPosition = blanks;
      },
      async getPL(el) {
        await el.requestPointerLock();
      },
      exitPL() {
        console.log('should be exiting now')
        document.exitPointerLock();
        // document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
      },
      lockChangeAlert() {
        console.log(document.pointerLockElement)
        if (document.pointerLockElement) {
          console.log('The pointer lock status is now locked');
          document.addEventListener("mousemove", this.updatePosition, false);
        } else {
          console.log('The pointer lock status is now unlocked');
          document.removeEventListener("mousemove", this.updatePosition, false);
        }
      },
      updatePosition(e) {
        console.log('drag left to right', e.movementX)
      }
    },
    components: {
      icon,
      whatsNew
    }
  };
</script>

<style lang="scss">
  @import "../sass/parts/config.scss";
      
  * {
    box-sizing: border-box;
  }
  html,
  body {
    width: 100%;
    height: 100%;
    font-family: $fontfam;
    background-color: var(--figma-color-bg);
    color: var(--figma-color-text);
    font-size: font(22px, 16px, 786px, 320px);
    margin: 0;
  }

  body {
    margin: 0;
  }
  input,
  button {
    display: inline-block;
    width: 100%;
    margin: 0.2rem;
  }
  input {
    position: relative;
    font-size: 12px;
    color: currentColor;
    border: none;
    outline: none;
    background: none;
    margin: 0;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  .gg-app {
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    height: 100%;
    user-select: none;
    overflow: hidden;

    &:not(:has(.gg-app--controls)){
      grid-template-rows: auto 1fr;
      .gg-app--view {
        &:has(.gg-app--view_whatsnew) {
          padding: 0;
        }
      }
    }
    &--tabs {
      position: relative;
      width: 100%;
      border-bottom: 1px solid var(--figma-color-border);

      ul {
        display: flex;
        width: 100%;
        margin: 0;
        padding: 0;
        list-style-type: none;

        .gg-tab {
          cursor: default;
          display: flex;
          width: 100%;
          justify-content: center;
          align-items: center;
          text-align: center;
          font-size: 12px;
          font-weight: 600;
          padding: 10px 5px;
          white-space: nowrap;
          color: var(--figma-color-text);
          &_active {
            --figma-color-text: var(--accent);
          }
          & + .gg-tab {
            border-left: 1px solid var(--figma-color-border);
          }
          &.version-tab {
            display: flex;
            width: 35px;
            gap: 2px;
            flex-shrink: 0;
          }
        }
      }
    }
    &--view {
      position: relative;
      padding: 10px;
      overflow-y: auto;

      &:has(.gg-app--view_saved) {
        padding: 0;
        overflow: hidden;
      }
      
      &_saved {
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 10px;
        @include custom-scrollbar($c: var(--figma-color-border));
        &-guideslist {
          margin: 0;
          padding: 0;
          li {
            position: relative;
            width: 100%;
            + li {
              margin-top: 5px;
            }
            &:hover {
              .icon-button {
                opacity: 1;
              }
            }
            .guide-type-icon {
              position: absolute;
              top: 50%;
              left: 5px;
              translate: 0 -50%;
              flex-shrink: 0;
              font-size: 9px;
              opacity: 0.5;
              cursor: default;
            }
            .preset-chip {
              position: absolute;
              top: 50%;
              left: 5px;
              translate: 0 -50%;
              flex-shrink: 0;
              font-size: 8px;
              font-weight: 700;
              letter-spacing: 0.06em;
              text-transform: uppercase;
              padding: 1px 4px;
              border-radius: 2px;
              background-color: var(--figma-color-bg-brand-tertiary, rgba(24, 160, 251, 0.15));
              color: var(--figma-color-text-brand, #18a0fb);
              cursor: default;
              line-height: 1.5;
            }
            p {
              position: relative;
              flex: 1;
              min-width: 0;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              margin: 0;
              z-index: 1;
            }
            .icon-button {
              opacity: 0;
              font-size: 19px;
              .r-icon {
                position: absolute;
                top: 50%;
                right: 0;
                transform: translateY(-50%);
                display: flex;
                justify-content: center;
                align-items: center;
                width: 28px;
                height: 28px;
                border-radius: var(--br, 3px);
                z-index: 2;
                &:hover {
                  color: rgba(var(--red), 1);
                  background-color: rgba(var(--red), .2);
                }
              }
            }
          }
          .quick-add {
            margin-top: 5px;
          }
          &--isEmpty {
            text-align: center;
            font-size: 12px;
            opacity: .67;
            font-weight: 700;
          }
        }
      }
      &_whatsnew {
        height: 100%;
      }
    }
    &--controls {
      position: relative;
      &_bottom,
      &_top {
        position: relative;
        display: flex;
        gap: 5px;
        width: 100%;
        padding: 10px;
      }
      &_top {
        padding: 5px;
        justify-content: space-between;
        background-color: var(--figma-color-bg-secondary);
        div {
          cursor: default;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          aspect-ratio: 1/1;
          padding: 3px;
          font-size: 20px;
          border-radius: var(--br, 3px);
          &:hover {
            background-color: var(--figma-color-bg-tertiary);
          }
        }
      }
      &_bottom {
        > .button + .button {
          padding: 5px;
        }
        .additional-controls  {
          font-size: 20px;
        }
      }
    }
    &--actions {
      position: absolute;
      bottom: 100%;
      left: 0;
      right: 0;
      transform: translateY(100%);
      padding: 10px;
      display: flex;
      flex-direction: column;
      margin: 0;
      background-color: var(--figma-color-bg-secondary);
      visibility: hidden;
      opacity: 0;
      transition: 225ms $curve all;
      box-shadow: 0 -.5rem .5rem rgba(#000,.1);
      border-radius: var(--br, 3px) var(--br, 3px) 0 0;
      &.open {
        transform: translateY(0);
        visibility: visible;
        opacity: 1;
      }
      li {
        cursor: default;
        + li {
          margin-top: 5px;
        }
      }
    }
    &--modal {
      position: absolute;
      bottom: 5px;
      left: 5px;
      right: 5px;
      z-index: 2;
      &:before {
        content:'';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--figma-color-bg);
        opacity: .7;
      }
      &_body {
        position: relative;
        width: 100%;
        padding: 10px;
        background-color: var(--figma-color-bg);
        border-radius: var(--br, 3px) var(--br, 3px) 0 0;
        input {
          padding: 5px 0;
          color: currentColor;
        }
      }
      &_footer {
        position: relative;
        display: flex;
        width: 100%;
        padding: 10px;
        background-color: var(--figma-color-bg);
        border-top: 1px solid var(--figma-color-border);
        border-radius: 0 0 var(--br, 3px) var(--br, 3px);
        .button {
          width: 100%;
          + .button {
            margin-left: 5px;
          }
        }
      }
    }
  }
  
  .gg-divider {
    border: none;
    border-top: 1px solid var(--figma-color-border);
    margin: 8px 0;
  }

  .gg-row {
    display: flex;
    gap: 10px;
    width: 100%;
    & + & {
      margin-top: 10px;
    }
  }

  .gg-input {
    display: flex;
    align-items: center;
    gap: 5px;
    width: 100%;
    padding: 5px;
    color: var(--figma-color-text);
    background: var(--figma-color-bg-secondary);
    border-radius: var(--br, 3px);
    input {
      color: currentColor;
    }
    &--link {
      background: none;
      justify-content: center;
      width: 30px;
      flex-shrink: 0;
      font-size: 20px;
      padding: 0;
      &.linked {
        background: var(--figma-color-bg-secondary);
      }
    }
    &--num {
      .r-icon {
        font-size: 20px;
      }
    }
    &--slide {
      font-size: 12px;
      b {
        min-width: 22px;
        font-weight: normal;
        text-align: center;
        padding: 2px;
        background-color: var(--figma-color-bg-tertiary);
        border-radius: var(--br, 3px);
        margin-right: 4px;
      }
      .range-track {
        --track-bg: var(--figma-color-bg-tertiary);
        position: relative;
        width: 100%;
        max-width: 150px;
        margin-left: auto;

        &:before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          transform: translateY(-50%);
          height: 2px;
          border-radius: var(--br, 3px);
          background-color: var(--track-bg);
        }
        input {
          margin: 0;
        }
      }
      .r-icon {
        font-size: 20px;
      }
    }
  }
</style>