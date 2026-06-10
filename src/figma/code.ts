/* eslint-disable */
/// <reference types="@figma/plugin-typings" />
figma.parameters.on('input', ({ key, result }: ParameterInputEvent ) => {
  if (figma.currentPage.selection.length === 0) {
    result.setError('Please select one or more nodes first')
    return
  }
  switch (key) {
    case 'reboQuery':
      let menu = [
        { name: 'Split Horizontally', data: 'split-center--h' },
        { name: 'Split Vertically', data: 'split-center--v' },
        { name: 'Clear all Guides', data: 'clear' },
      ];
      result.setSuggestions(menu);
      break;
    default:
      return;
  }
});

figma.on('run', ({ command, parameters }: RunEvent) => {
  if(parameters) {
    switch(parameters.reboQuery) {
      case 'split-center--v':
        if(figma.currentPage.selection.length > 0) {
          figma.currentPage.selection.forEach((sel) => {
            let selection = sel as FrameNode;
            if(selection.type === "FRAME") {
              let dimensions = {
                width: selection.width,
                height: selection.height
              };
              let guide = [{
                axis: "X",
                offset: dimensions.width/2
              }];
              addGuides(selection, guide);
            } else {
              makeFrames(selection);
            }
          });
        } else {
          figma.notify('🪟 Please select a Frame');
        }
        break;
      case 'split-center--h':
        if(figma.currentPage.selection.length > 0) {
          figma.currentPage.selection.forEach((sel) => {
            let selection = sel as FrameNode;
            if(selection.type === "FRAME") {
              let dimensions = {
                width: selection.width,
                height: selection.height
              };
              let guide = [{
                axis: "Y",
                offset: dimensions.height/2
              }];
              addGuides(selection, guide);
            } else {
              makeFrames(selection);
            }
          });
        } else {
          figma.notify('🪟 Please select a Frame');
        }
        break;
      case 'clear':
        if(figma.currentPage.selection.length > 0) {
          figma.currentPage.selection.forEach((sel) => {
            let selection = sel as FrameNode;
            selection.guides = [];
          })
        } else {
          figma.notify('🪟 Please select a Frame');
        }
        break;
      default:
        return;
    }
    figma.closePlugin();
  } else {
    startUI();
  }
});

function addGuides(sel: any, guide: any) {
  const selection = sel;
  selection.guides = selection.guides.concat(guide);
}
function makeFrames(sel: any) {
  const nodes: SceneNode[] = [];
  const selection = sel;
  if(selection.parent.name !== "Frame") {
    figma.notify('Converting Selection(s) into Frame(s)');
    let newFrame = figma.createFrame();
    let objX = selection.x,
        objY = selection.y,
        objW = selection.width,
        objH = selection.height;

    newFrame.x = objX;
    newFrame.y = objY;
    newFrame.resizeWithoutConstraints(objW, objH)
    newFrame.appendChild(selection);
    nodes.push(newFrame)
    selection.x = 0;
    selection.y = 0;
  }
  figma.currentPage.selection = nodes;
}
function clearAll(sel: any) {
  const selection = sel;
  selection.forEach((cs: any) => {
    let selFrame = cs as FrameNode;
    selFrame.guides = [];
  })
}

async function startUI() {
  figma.showUI(__html__, {
    width: 300,
    height: 330,
    themeColors: true
  });
  figma.ui.onmessage = async msg => {
    // console.log(figma.setCurrentPageAsync(figma.currentPage))
    switch (msg.type) {
      case 'add-guides':
        if(figma.currentPage.selection.length > 0) {
          figma.currentPage.selection.forEach((sel, idx) => {
            let selection = sel as FrameNode;
            let guideData = msg.data;

            if(selection.type === "FRAME") {
              addGuides(selection, guideData[idx]);
            } else {
              makeFrames(selection);
              addGuides(selection.parent, guideData[idx]);
            }
          });
        } else {
          figma.notify('🪟 Please select a Frame');
        }
        break;
      case 'split':
        if(figma.currentPage.selection.length > 0) {
          figma.currentPage.selection.forEach((sel)=>{
            let selection = sel as FrameNode;
            if(selection.type === "FRAME") {
              let splitDir = msg.dirType;
              let dimensions = {
                width: selection.width,
                height: selection.height
              };
              if(splitDir === 'edgeTop') {
                let guide = [{
                  axis: "Y",
                  offset: 0
                }];
                addGuides(selection, guide);
              }
              if(splitDir === 'edgeLeft') {
                let guide = [{
                  axis: "X",
                  offset: 0
                }];
                addGuides(selection, guide);
              }
              if(splitDir === 'edgeRight') {
                let guide = [{
                  axis: "X",
                  offset: dimensions.width
                }];
                addGuides(selection, guide);
              }
              if(splitDir === 'edgeBottom') {
                let guide = [{
                  axis: "Y",
                  offset: dimensions.height
                }];
                addGuides(selection, guide);
              }
              if(splitDir === 'centerHor') {
                let guide = [{
                  axis: "Y",
                  offset: dimensions.height/2
                }];
                addGuides(selection, guide);
              }
              if(splitDir === 'centerVer') {
                let guide = [{
                  axis: "X",
                  offset: dimensions.width/2
                }];
                addGuides(selection, guide);
              }
            } else {
              // uh oh, make this into a frame
              makeFrames(selection);
            }
          });
        } else {
          // Can only add to frames
          figma.notify('🪟 Please select a Frame');
        }
        break;
      case 'save-guides':
        let savedGuides = [];
        const getStoredData = await figma.clientStorage.getAsync("storedData");
        if (getStoredData) {
          savedGuides = getStoredData;
          savedGuides.push(msg.savedata)
          const setSavedData = await figma.clientStorage.setAsync("storedData", savedGuides);
          setSavedData;
        } else {
          savedGuides.push(msg.savedata)
          const setSavedData = await figma.clientStorage.setAsync("storedData", savedGuides);
          setSavedData;
        }
        figma.notify(`${msg.savename} was Saved ✨`);
        break;
      case 'get-saved-guides':
        const getGuides = await figma.clientStorage.getAsync("storedData");
        if (getGuides) {
          figma.ui.postMessage({"storedData" : getGuides});
        }
        break;
      case 'update-saved-guides':
        const setSavedData = await figma.clientStorage.setAsync("storedData", msg.savedGuides);
        setSavedData;
        break;
      case 'clear-all':
        if(figma.currentPage.selection.length > 0) {
          clearAll(figma.currentPage.selection)
        } else {
          figma.notify('🪟 Please select a Frame');
        }
        break;
      case 'request-dimensions':
        let dimensions: { width: number; height: number; }[] = [];
        if(figma.currentPage.selection.length > 0) {
          figma.currentPage.selection.forEach((sel) => {
            let selection = sel as FrameNode;
            let frameWidth = selection.width;
            let frameHeight = selection.height;
            let sizes = {
              'width': frameWidth,
              'height': frameHeight
            };
            dimensions.push(sizes);
          });
          figma.ui.postMessage({'frames': dimensions});
          // figma.ui.postMessage({'frameWidth': frameWidth, 'frameHeight': frameHeight});
        } else {
          figma.notify('🪟 Please select a Frame');
        }
        break;
      case 'get-guides-from-selection':
        if(figma.currentPage.selection.length > 0) {
          const sel = figma.currentPage.selection[0] as FrameNode;
          if(sel.type === "FRAME") {
            if(sel.guides.length === 0) {
              figma.notify('No guides found on this frame');
              break;
            }
            const fw = sel.width;
            const fh = sel.height;
            const xOffsets = sel.guides.filter(g => g.axis === "X").map(g => g.offset).sort((a, b) => a - b);
            const yOffsets = sel.guides.filter(g => g.axis === "Y").map(g => g.offset).sort((a, b) => a - b);

            let result: {[key: string]: number | string} = {
              marginLeft: '', marginRight: '', marginLRlinked: '',
              marginTop: '', marginBottom: '', marginTBlinked: '',
              gridCols: 0, gridRows: 0
            };

            if(xOffsets.length >= 2) {
              const left = xOffsets[0];
              const right = fw - xOffsets[xOffsets.length - 1];
              const interiorCols = xOffsets.length - 2;
              if(Math.round(left) === Math.round(right)) {
                result.marginLRlinked = Math.round(left);
              } else {
                result.marginLeft = Math.round(left);
                result.marginRight = Math.round(right);
              }
              result.gridCols = interiorCols > 0 ? interiorCols + 1 : 0;
            } else if(xOffsets.length === 1) {
              result.marginLeft = Math.round(xOffsets[0]);
            }

            if(yOffsets.length >= 2) {
              const top = yOffsets[0];
              const bottom = fh - yOffsets[yOffsets.length - 1];
              const interiorRows = yOffsets.length - 2;
              if(Math.round(top) === Math.round(bottom)) {
                result.marginTBlinked = Math.round(top);
              } else {
                result.marginTop = Math.round(top);
                result.marginBottom = Math.round(bottom);
              }
              result.gridRows = interiorRows > 0 ? interiorRows + 1 : 0;
            } else if(yOffsets.length === 1) {
              result.marginTop = Math.round(yOffsets[0]);
            }

            figma.ui.postMessage({ guidesFromSelection: result });
          } else {
            figma.notify('🪟 Please select a Frame');
          }
        } else {
          figma.notify('🪟 Please select a Frame');
        }
        break;
      case 'cancel':
        figma.closePlugin();
        break;
    }
  };
  figma.currentPage.setRelaunchData({ Relaunch: '' })
}