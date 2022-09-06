/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
let action = ['Add Margins', 'Split Center', 'Clear All Guides'],
    direction = ['Horizontally', 'Vertically'];

// startUI();

figma.parameters.on('input', ({ parameters, key, query, result }: ParameterInputEvent ) => {
  console.log('parameter mode running ', key, query, parameters)
  switch (key) {
    case 'actions':
      result.setSuggestions(action.filter((s) => s.includes(query)));
      // if(parameters.actions !== 'Clear All Guides') {}
      break;
    case 'direction':
      result.setSuggestions(direction.filter((s) => s.includes(query)));
      break;
    case 'spacing':
      result.setLoadingMessage('');
      break;
    default:
      return;
  }
});

figma.on('run', ({ parameters }: RunEvent) => {
  if(parameters) {
    console.log('parameter actions running ', parameters)
    switch(parameters.actions) {
      case 'Add Margins':
        switch (parameters.direction) {
          case 'Horizontally':
            if(figma.currentPage.selection.length > 0) {
              let frameWidth = figma.currentPage.selection[0].width;
              let marginLeft = {
                axis: "X",
                offset: parseInt(parameters.spacing)
              };
              let marginRight = {
                axis: "X",
                offset: (frameWidth - parseInt(parameters.spacing))
              };
              let margins = [...[marginLeft], ...[marginRight]]
              figma.currentPage.selection.forEach((sel) => {
                let selection = sel as FrameNode;
                let guideData = margins;
                if(selection.type === "FRAME") {
                  addGuides(selection, guideData);
                } else {
                  makeFrames(selection);
                  addGuides(selection.parent, guideData);
                }
              });
            } else {
              figma.notify('Please select a Frame');
            }
            break;
          case 'Vertically':
            if(figma.currentPage.selection.length > 0) {
              let frameHeight = figma.currentPage.selection[0].height;
              let marginTop = {
                axis: "Y",
                offset: parseInt(parameters.spacing)
              };
              let marginBottom = {
                axis: "Y",
                offset: (frameHeight - parseInt(parameters.spacing))
              };
              let margins = [...[marginTop], ...[marginBottom]]
              figma.currentPage.selection.forEach((sel) => {
                let selection = sel as FrameNode;
                let guideData = margins;
                if(selection.type === "FRAME") {
                  addGuides(selection, guideData);
                } else {
                  makeFrames(selection);
                  addGuides(selection.parent, guideData);
                }
              });
            } else {
              figma.notify('Please select a Frame');
            }
            break;
          default:
            return;
        }
        break;
      case 'Split Center':
        switch (parameters.direction) {
          case 'Horizontally':
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
              figma.notify('Please select a Frame');
            }
            break;
          case 'Vertically':
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
              figma.notify('Please select a Frame');
            }
            break;
          default:
            return;
        }
        break;
      case 'Clear All Guides':
        if(figma.currentPage.selection.length > 0) {
          figma.currentPage.selection.forEach((sel) => {
            let selection = sel as FrameNode;
            selection.guides = [];
          })
        } else {
          figma.notify('Please select a Frame');
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
  console.log(guide)
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
async function startUI() {
  figma.showUI(__html__, { 
    width: 300, 
    height: 225,
    themeColors: true
  });
  figma.ui.onmessage = async msg => {
    switch (msg.type) {
      case 'add-guides':
        if(figma.currentPage.selection.length > 0) {
          figma.currentPage.selection.forEach((sel) => {
            let selection = sel as FrameNode;
            let guideData = msg.data;
            if(selection.type === "FRAME") {
              addGuides(selection, guideData);
            } else {
              makeFrames(selection);
              addGuides(selection.parent, guideData);
            }
          });
        } else {
          figma.notify('Please select a Frame');
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
          figma.notify('Please select a Frame');
        }
        break;
      case 'save-guides':
        let savedGuides = [];
        // console.log(savedGuides)
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
          figma.currentPage.selection.forEach((sel) => {
            let selection = sel as FrameNode;
            selection.guides = [];
          })
        } else {
          figma.notify('Please select a Frame');
        }
        break;
      case 'request-dimensions':
        if(figma.currentPage.selection.length > 0) {
          let frameWidth = figma.currentPage.selection[0].width;
          let frameHeight = figma.currentPage.selection[0].height;
        
          figma.ui.postMessage({'frameWidth': frameWidth, 'frameHeight': frameHeight});
        } else {
          figma.notify('Please Select a Frame');
        }
        break;
      case 'cancel':
        figma.closePlugin();
        break;
    }
  };
}