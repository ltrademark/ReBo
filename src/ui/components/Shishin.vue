<template>
  <div class="gg-app">
    <div class="gg-app--tabs">
      <ul>
        <li v-if="idx !== views.length - 1" v-for="(view, idx) in views" :key="view" class="gg-tab" :class="{'gg-tab_active' : currentView == idx}" @click="toggleView(idx)">{{view}}</li>
        <li class="gg-tab version-tab" :class="{'gg-tab_active' : currentView == 3}" @click="toggleView(3)" key="whats-new"><icon name="question"></icon></li>
      </ul>
    </div>
    <div class="gg-app--view">
      <div class="gg-app--view_cols"  v-if="currentView == 0">
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
      </div>
      <div class="gg-app--view_rows" v-if="currentView == 1">
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
      </div>
      <div class="gg-app--view_saved" v-if="currentView == 2">
        <ul class="gg-app--view_saved-guideslist" :class="{'open' : actionTrayOpen}" v-if="storedData.length > 0">
          <li v-for="(guide, idx) in storedData" class="button button--secondary" :key="idx">
            <p @click.stop="addSavedGuide(idx)">{{guide.name}}</p>
            <b class="icon-button" @click="removeItem(idx)" :title="`Delete ${guide.name}`">
              <icon name="trash"></icon>
            </b>
          </li>
        </ul>
        <p class="gg-app--view_saved-guideslist--isEmpty" v-if="storedData.length < 1">You haven't saved any guides... yet 😉</p>
      </div>
      <div class="gg-app--view_whatsnew" v-if="currentView == 3">
        <whats-new></whats-new>
      </div>
    </div>
    <div class="gg-app--controls" v-if="currentView < 2">
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
        <div class="additional-controls button button--secondary" @click="actionTrayOpen=!actionTrayOpen" v-if="inputActivity">
          <icon name="caret" :style="actionTrayOpen ? 'transform: rotate(180deg)' : ''"></icon>
        </div>
        <ul class="gg-app--actions" :class="{'open' : actionTrayOpen}">
          <li class="button" @click="resetFields()" :class="inputActivity ? 'button--secondary' : 'button--disabled'">Reset Fields</li>
          <li class="button" @click="saving=true" :class="inputActivity ? 'button--secondary' : 'button--disabled'">Save Current Guides</li>
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
          <div class="button button--secondary" @click="saving=false">Cancel</div>
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
        version: '5.0',
        currentView: 0,
        views: ['Columns', 'Rows', 'Saved Guides', 'ℹ️'],
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
          gridRows: 0
        },
        actionTrayOpen: false,
        storedData: [],
        tempData: [],
        saveName: '',
        saving: false,
        saved: false
      };
    },
    mounted() {
      this.getSavedGuides()
      window.addEventListener('keydown', (event) => {
        let ctrlPressed = event.ctrlKey;
        let shiftPressed = event.shiftKey;
        let sPressed = event.keyCode === 83;
        let trying2save = ctrlPressed && shiftPressed && sPressed;
        
        if (trying2save && this.inputActivity) {
          this.saving = true;
        } else {
          return;
        }
      });
      // document.addEventListener('pointerlockchange', this.lockChangeAlert, false);
      // document.addEventListener('mozpointerlockchange', this.lockChangeAlert, false);
    },
    computed: {
      inputActivity() {
        if(this.currentView == 0) {
          let margin1populated = this.colMarginsLinked ? this.gPosition.marginLRlinked !== '' : this.gPosition.marginLeft !== '',
              margin2populated = this.colMarginsLinked ? this.gPosition.marginLRlinked !== '' : this.gPosition.marginRight !== '',
              columnsDeclared = this.gPosition.gridCols > 0;
          let dataPopulated = margin1populated || margin2populated || columnsDeclared;
          if(dataPopulated) {
            return true
          } else {
            return false
          }
        } else if(this.currentView == 1) {
          let margin1populated = this.rowMarginsLinked ? this.gPosition.marginTBlinked !== '' : this.gPosition.marginTop !== '',
              margin2populated = this.rowMarginsLinked ? this.gPosition.marginTBlinked !== '' : this.gPosition.marginBottom !== '',
              rowsDeclared = this.gPosition.gridRows > 0;
          let dataPopulated = margin1populated || margin2populated || rowsDeclared;
          if(dataPopulated)
            return true
          else
            return false
        } else {
          return false
        }
      },
      gridColumnsCount() {
        return this.gPosition.gridCols > 0 ? this.gPosition.gridCols : 'No'
      },
      gridRowsCount() {
        return this.gPosition.gridRows > 0 ? this.gPosition.gridRows : 'No'
      }
    },
    filters: {
      sanitize(string) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            "/": '&#x2F;',
        };
        const reg = /[&<>"'/]/ig;
        return string.replace(reg, (match)=>(map[match]));
      },
      truncate(value, size) {
        if (!value) return '';
        value = value.toString();

        if (value.length <= size) {
          return value;
        } else {
          return value.substr(0, size) + '...';
        }
      }
    },
    methods: {
      getFrameDimensions() {
        parent.postMessage({ pluginMessage: { type: "request-dimensions" } }, "*");
        onmessage = (event) => {
          let data = event.data.pluginMessage;
          if (data) {
            this.frames = data.frames;
            this.frameWidth = data.frames[0].width
            this.frameHeight = data.frames[0].height
          }
        } 
      },
      toggleView(num){
        switch(num) {
          case 0:
            this.currentView = 0;
            break;
          case 1:
            this.currentView = 1;
            break;
          case 2:
            this.getSavedGuides();
            this.currentView = 2;
            break;
          case 3:
            this.currentView = 3;
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
        this.getFrameDimensions();
        let allData = [];
        let margins = [];
        let columns = [] = [];
        let rows = [] = [];
        setTimeout(()=>{
          if(this.currentView == 0) {
            // we columns
            if(this.inputActivity) {
              this.frames.forEach(e => {
                // margins first
                margins.push(this.marginsX(e.width))
                // now lets check columns
                columns.push(this.columns(e.width))
              });
              if(columns[0] !== undefined) {
                allData.push(columns)
              }
              if(margins[0] !== undefined) {
                allData.push(margins)
              }
              this.tempData = allData;
              parent.postMessage({ pluginMessage: { type: "add-guides", data: allData } }, "*");
            } else {
              return;
            }
          } else if(this.currentView == 1) {
            // we rows now
            if(this.inputActivity) {
              this.frames.forEach(e => {
                // margins first
                margins.push(this.marginsY(e.height))
                // now lets check Rows
                rows.push(this.rows(e.height))
              });
              if(rows[0] !== undefined) {
                allData.push(rows)
              }
              if(margins[0] !== undefined) {
                allData.push(margins)
              }
              this.tempData = allData;
              parent.postMessage({ pluginMessage: { type: "add-guides", data: allData } }, "*");
            } else {
              return;
            }
          } else if(this.currentView == 2) {
            // looking at saved guides
            // parent.postMessage({ pluginMessage: { type: "add-guides", data: allData } }, "*");
          } else {
            return;
          }
        },10);
      },
      marginsX(width) {
        let frameWidth = width;
        if (this.colMarginsLinked) {
          if (this.gPosition.marginLRlinked) {
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
          if (this.gPosition.marginLeft) {
            let marginLeft = {
              axis: "X",
              offset: this.gPosition.marginLeft
            };
            margins.push(marginLeft)
          }
          if (this.gPosition.marginRight) {
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
          if (this.gPosition.marginTBlinked) {
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
          if (this.gPosition.marginTop) {
            let marginTop = {
              axis: "Y",
              offset: this.gPosition.marginTop
            };
            margins.push(marginTop)
          }
          if (this.gPosition.marginBottom) {
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
        if (this.gPosition.gridCols > 0) {
          let getLeftMargin = this.colMarginsLinked ? this.gPosition.marginLRlinked ? this.gPosition.marginLRlinked : this.gPosition.marginLeft : this.gPosition.marginLeft;
          let getWidth = !this.colMarginsLinked ? (this.gPosition.marginRight ? (frameWidth - this.gPosition.marginRight) : frameWidth) - (getLeftMargin ? getLeftMargin : 0) : (frameWidth - this.gPosition.marginLRlinked) - getLeftMargin;
          let getColumn = getWidth / this.gPosition.gridCols;
          let indColumns = [];

          for (let i = 1; i < this.gPosition.gridCols; i++) {
            let smartOffset = getLeftMargin ? Math.round(getColumn * i + getLeftMargin) : Math.round(getColumn * i);
            let colPos = {
              axis: "X",
              offset: smartOffset
            };
            indColumns.push(colPos)
          }
          return indColumns
        } else {
          //ignore
        }
      },
      rows(height) {
        let frameHeight = height;
        if (this.gPosition.gridRows > 0) {
          let getTopMargin = this.rowMarginsLinked ? this.gPosition.marginTBlinked ? this.gPosition.marginTBlinked : this.gPosition.marginTop : this.gPosition.marginTop;
          let getHeight = !this.rowMarginsLinked ? (this.gPosition.marginBottom ? (frameHeight - this.gPosition.marginBottom) : frameHeight) - (getTopMargin ? getTopMargin : 0) : (frameHeight - this.gPosition.marginTBlinked) - getTopMargin;
          let getRow = getHeight / this.gPosition.gridRows;
          let indRows = [];

          for (let i = 1; i < this.gPosition.gridRows; i++) {
            let smartOffset = getTopMargin ? Math.round(getRow * i + getTopMargin) : Math.round(getRow * i);
            let rowPos = {
              axis: "Y",
              offset: smartOffset
            };
            indRows.push(rowPos)
          }
          return indRows
        } else {
          //ignore
        }
      },
      addSavedGuide(dataID){
        let guide = this.storedData[dataID];
        this.gPosition = guide.data;
        this.currentView = guide.view;
        
        this.addGuides();
        // console.log(this.gPosition);
        // parent.postMessage({ pluginMessage: { type: "add-guides", data: guide.data } }, "*");
      },
      removeItem(dataID){
        this.storedData.splice(dataID, 1);
        parent.postMessage({ pluginMessage: { type: "update-saved-guides", savedGuides : this.storedData } }, "*");
        this.getSavedGuides();
      },
      saveGuides(){
        this.actionTrayOpen = false;
        if(this.inputActivity) {
          let savedData = {
            name: this.saveName,
            view: this.currentView,
            data: this.gPosition
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
        // grabs array from code.ts // client storage
        onmessage = (event) => {
          let data = event.data.pluginMessage;
          if (data) {
            this.storedData = data.storedData // whatever the response from code.ts was.
          }
        } 
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
          gridRows: 0
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
    display: block;
    height: 100%;
    user-select: none;
    overflow: hidden;

    &:not(:has(.gg-app--controls)){
      .gg-app--view {
        height: calc(100% - 36px);
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
      &_saved {
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
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
            p {
              position: relative;
              width: 100%;
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