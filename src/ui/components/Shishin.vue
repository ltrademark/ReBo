<template>
  <div class="gg-app">
    <div class="gg-app--tabs">
      <ul>
        <li v-for="(view, idx) in views" :key="view" class="gg-tab" :class="{'gg-tab_active' : currentView == idx}" @click="toggleView(idx)">{{view}}</li>
      </ul>
    </div>
    <div class="gg-app--view">
      <div class="gg-app--view_cols"  v-if="currentView == 0">
        <div class="gg-row">
          <div class="gg-input gg-input--num">
            <i class="gg-icons gg-icons--margin-left"></i>
            <input type="number" min="1" max="1000" v-if="!colMarginsLinked" v-model.number="gPosition.marginLeft" @keyup.enter="inputActivity ? addGuides() : ''" placeholder="Margin" />
            <input type="number" min="1" max="1000" v-if="colMarginsLinked" v-model.number="gPosition.marginLRlinked" @keyup.enter="inputActivity ? addGuides() : ''" placeholder="Margin" />
          </div>
          <div class="gg-input gg-input--link" :class="{'linked' : colMarginsLinked}">
            <i class="icon " :class="colMarginsLinked ? 'icon--link-connected icon--blue' : 'icon--link-broken'" @click="colMarginsLinked=!colMarginsLinked"></i>
          </div>
          <div class="gg-input gg-input--num">
            <i class="gg-icons gg-icons--margin-right"></i>
            <input type="number" min="1" max="1000" v-if="!colMarginsLinked" v-model.number="gPosition.marginRight" @keyup.enter="inputActivity ? addGuides() : ''" placeholder="Margin" />
            <input type="number" min="1" max="1000" v-if="colMarginsLinked" v-model.number="gPosition.marginLRlinked" @keyup.enter="inputActivity ? addGuides() : ''" placeholder="Margin" />
          </div>
        </div>
        <div class="gg-row">
          <div class="gg-input gg-input--slide">
            <i class="gg-icons gg-icons--columns"></i>
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
            <i class="gg-icons gg-icons--margin-top"></i>
            <input type="number" min="1" max="1000" v-if="!rowMarginsLinked" v-model.number="gPosition.marginTop" @keyup.enter="inputActivity ? addGuides() : ''" placeholder="Margin" />
            <input type="number" min="1" max="1000" v-if="rowMarginsLinked" v-model.number="gPosition.marginTBlinked" @keyup.enter="inputActivity ? addGuides() : ''" placeholder="Margin" />
          </div>
          <div class="gg-input gg-input--link" :class="{'linked' : rowMarginsLinked}">
            <i class="icon " :class="rowMarginsLinked ? 'icon--link-connected icon--blue' : 'icon--link-broken'" @click="rowMarginsLinked=!rowMarginsLinked"></i>
          </div>
          <div class="gg-input gg-input--num">
            <i class="gg-icons gg-icons--margin-bottom"></i>
            <input type="number" min="1" max="1000" v-if="!rowMarginsLinked" v-model.number="gPosition.marginBottom" @keyup.enter="inputActivity ? addGuides() : ''" placeholder="Margin" />
            <input type="number" min="1" max="1000" v-if="rowMarginsLinked" v-model.number="gPosition.marginTBlinked" @keyup.enter="inputActivity ? addGuides() : ''" placeholder="Margin" />
          </div>
        </div>
        <div class="gg-row">
          <div class="gg-input gg-input--slide">
            <i class="gg-icons gg-icons--rows"></i>
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
            <b class="icon-button" @click="removeItem(idx)">
              <span class="icon icon--trash"></span>
            </b>
          </li>
        </ul>
        <p class="gg-app--view_saved-guideslist--isEmpty" v-if="storedData.length < 1">You haven't saved any guides... yet 😉</p>
      </div>
    </div>
    <div class="gg-app--controls" v-if="currentView < 2">
      <div class="gg-app--controls_top">
        <div @click="addIndividualGuide('edgeLeft')" class="gg-icons gg-icons--left-edge" title="Add Guide to Left Edge"></div>
        <div @click="addIndividualGuide('centerVer')" class="gg-icons gg-icons--center-ver" title="Add Guide to the center vertically"></div>
        <div @click="addIndividualGuide('edgeRight')" class="gg-icons gg-icons--right-edge" title="Add Guide to Right Edge"></div>
        <div @click="clearAll()" class="gg-icons gg-icons--clear" title="Clear All Guides"></div>
        <div @click="addIndividualGuide('edgeTop')" class="gg-icons gg-icons--top-edge" title="Add Guide to Top Edge"></div>
        <div @click="addIndividualGuide('centerHor')" class="gg-icons gg-icons--center-hor" title="Add to the center horizontally"></div>
        <div @click="addIndividualGuide('edgeBottom')" class="gg-icons gg-icons--bottom-edge" title="Add Guide to Bottom Edge"></div>
      </div>
      <div class="gg-app--controls_bottom">
        <button class="button" @click="inputActivity ? addGuides() : ''" :class="inputActivity ? 'button--primary' : 'button--disabled'">Add Guides</button>
        <div class="additional-controls button button--secondary" @click="actionTrayOpen=!actionTrayOpen" v-if="inputActivity">
          <i class="gg-icons gg-icons--caret-up" :style="actionTrayOpen ? 'transform: rotate(180deg)' : ''"></i>
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
  export default {
    data() {
      return {
        currentView: 0,
        views: ['Columns', 'Rows', 'Saved Guides'],
        frameWidth: null,
        frameHeight: null,
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
          console.log(value, size, value.length)
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
            this.frameWidth = data.frameWidth
            this.frameHeight = data.frameHeight
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
        let allData= [];
        let margins= [];
        let columns= [];
        let rows= [];
        this.getFrameDimensions();
        setTimeout(()=>{
          if(this.currentView == 0) {
            // we columns
            if(this.inputActivity) {
              // some values are filled out, lets filter out which
              // margins first
              if(this.colMarginsLinked) {
                if (this.gPosition.marginLRlinked) {
                  let marginLeft = [{
                    axis: "X",
                    offset: this.gPosition.marginLRlinked
                  }];
                  let marginRight = [{
                    axis: "X",
                    offset: this.frameWidth - this.gPosition.marginLRlinked
                  }];
                  margins = [...marginLeft, ...marginRight]
                }
              } else {
                if(this.gPosition.marginLeft) {
                  let marginLeft = {
                    axis: "X",
                    offset: this.gPosition.marginLeft
                  };
                  margins.push(marginLeft)
                }
                if(this.gPosition.marginRight) {
                  let marginRight = {
                    axis: "X",
                    offset: this.frameWidth - this.gPosition.marginRight
                  };
                  margins.push(marginRight)
                }
              }
              // now lets check columns
              if(this.gPosition.gridCols > 0) {
                let getLeftMargin = this.colMarginsLinked ? this.gPosition.marginLRlinked ? this.gPosition.marginLRlinked : this.gPosition.marginLeft : this.gPosition.marginLeft;
                let getWidth = !this.colMarginsLinked ? (this.gPosition.marginRight ? (this.frameWidth - this.gPosition.marginRight) : this.frameWidth) - (getLeftMargin ? getLeftMargin : 0) : (this.frameWidth - this.gPosition.marginLRlinked) - getLeftMargin;
                let getColumn = getWidth / this.gPosition.gridCols;

                for(let i = 1; i < this.gPosition.gridCols; i++) {
                  let smartOffset = getLeftMargin ? Math.round(getColumn * i + getLeftMargin) : Math.round(getColumn * i);
                  let colPos = {
                    axis: "X",
                    offset: smartOffset
                  };
                  columns.push(colPos)
                }
              } else {
                //ignore
              }
              allData = [...margins, ...columns];
              this.tempData = allData;
              parent.postMessage({ pluginMessage: { type: "add-guides", data: allData } }, "*");
            } else {
              return;
            }
          } else if(this.currentView == 1) {
            // we rows now
            if(this.inputActivity) {
              // some values are filled out, lets filter out which
              // margins first
              if(this.rowMarginsLinked) {
                if (this.gPosition.marginTBlinked) {
                  let marginTop = [{
                    axis: "Y",
                    offset: this.gPosition.marginTBlinked
                  }];
                  let marginBottom = [{
                    axis: "Y",
                    offset: this.frameHeight - this.gPosition.marginTBlinked
                  }];
                  margins = [...marginTop, ...marginBottom]
                }
              } else {
                if(this.gPosition.marginTop) {
                  console.log(this.gPosition.marginTop)
                  let marginTop = {
                    axis: "Y",
                    offset: this.gPosition.marginTop
                  };
                  margins.push(marginTop)
                }
                if(this.gPosition.marginBottom) {
                  let marginBottom = {
                    axis: "Y",
                    offset: this.frameHeight - this.gPosition.marginBottom
                  };
                  margins.push(marginBottom)
                }
              }
              // now lets check Rows
              if(this.gPosition.gridRows > 0) {
                let getTopMargin = this.rowMarginsLinked ? this.gPosition.marginTBlinked ? this.gPosition.marginTBlinked : this.gPosition.marginTop : this.gPosition.marginTop;
                let getBottomMargin = this.rowMarginsLinked ? this.gPosition.marginTBlinked ? this.gPosition.marginTBlinked : this.gPosition.marginBottom : this.gPosition.marginBottom;
                let getHeight = !this.rowMarginsLinked ? (this.gPosition.marginBottom ? (this.frameHeight - this.gPosition.marginBottom) : this.frameHeight) - (getTopMargin ? getTopMargin : 0) : (this.frameHeight - this.gPosition.marginTBlinked) - getTopMargin;
                let getRow = getHeight / this.gPosition.gridRows;
                
                for(let i = 1; i < this.gPosition.gridRows; i++) {
                  let smartOffset = getTopMargin ? Math.round(getRow * i + getTopMargin) : Math.round(getRow * i);
                  let rowPos = {
                    axis: "Y",
                    offset: smartOffset
                  };
                  rows.push(rowPos)
                }
              } else {
                //ignore
              }
              allData = [...margins, ...rows];
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
    }
  };
</script>

<style lang="scss">
  @import "../sass/parts/config.scss";
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
    user-select: none;
    overflow: hidden;

    &--tabs {
      position: relative;
      width: 100%;
      border-bottom: 1px solid #EEEEEE;

      ul {
        display: flex;
        width: 100%;
        margin: 0;
        padding: 0;
        list-style-type: none;

        .gg-tab {
          cursor: default;
          display: block;
          width: 100%;
          text-align: center;
          font-size: 12px;
          font-weight: 600;
          padding: 10px 5px;
          color: #787878;
          &_active {
            color: var(--accent);
          }
          &:last-child {
            border-left: 1px solid #EEEEEE;
          }
        }
      }
    }
    &--view {
      position: relative;
      padding: 10px;
      &_saved {
        height: calc(100% - 56px);
        overflow-y: auto;
        overflow-x: hidden;
        @include custom-scrollbar($c: #787878);
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
              .icon {
                opacity: 1;
              }
            }
            p {
              position: relative;
              width: 100%;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              z-index: 1;
            }
            .icon {
              opacity: 0;
              position: absolute;
              top: 50%;
              right: 0;
              transform: translateY(-50%);
              z-index: 2;
              &:hover {
                background-position: 0 -4em;
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
    }
    &--controls {
      position: relative;
      &_bottom,
      &_top {
        position: relative;
        display: flex;
        width: 100%;
        padding: 10px;
      }
      &_top {
        justify-content: space-between;
        background-color: #EFEFEF;
        div {
          cursor: pointer;
        }
      }
      &_bottom {
        > .button + .button {
          margin-left: 5px;
          padding: 5px;
          .gg-icons {
            background-size: 35px;
          }
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
      background-color: #EFEFEF;
      visibility: hidden;
      opacity: 0;
      transition: 225ms $curve all;
      box-shadow: 0 -.5rem .5rem rgba(#000,.1);
      border-radius: 10px 10px 0 0;
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
        background-color: rgba(#000, .7);
      }
      &_body {
        position: relative;
        width: 100%;
        padding: 10px;
        background-color: #fff;
        border-radius: 10px 10px 0 0;
        input {
          padding: 5px 0;
        }
      }
      &_footer {
        position: relative;
        display: flex;
        width: 100%;
        padding: 10px;
        background-color: #fff;
        border-top: 1px solid #eee;
        border-radius: 0 0 10px 10px;
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
    width: 100%;
    & + & {
      margin-top: 10px;
    }
  }

  .gg-input {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 5px;
    background: #EFEFEF;
    border-radius: 3px;
    & + & {
      margin-left: 5px;
    }
    > * + * {
      margin-left: .2rem;
    }
    &--link {
      background: none;
      justify-content: center;
      flex-shrink: 2;
      padding: 0;
      &.linked {
        background: #EFEFEF;
      }
    }
    &--slide {
      font-size: 12px;
      b {
        min-width: 22px;
        font-weight: normal;
        text-align: center;
        padding: 2px;
        background-color: #DEDEDE;
        border-radius: 3px;
        margin-right: 4px;
      }
      .range-track {
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
          border-radius: 2px;
          background-color: #DEDEDE;
        }
        input {
          margin: 0;
        }
      }
    }
  }
</style>