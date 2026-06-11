/* eslint-disable */
/// <reference types="@figma/plugin-typings" />

const DEFAULT_PRESETS = [
  {
    name: 'Simple Outline',
    preset: true,
    view: 0,
    data: {
      marginLeft: 0, marginRight: 0, marginLRlinked: 0,
      marginTop: 0, marginBottom: 0, marginTBlinked: 0,
      gridCols: 0, gridRows: 0,
      colWidth: '', gutterCol: '', rowHeight: '', gutterRow: ''
    }
  },
  {
    name: '12-Column Grid',
    preset: true,
    view: 0,
    data: {
      marginLeft: 0, marginRight: 0, marginLRlinked: 0,
      marginTop: '', marginBottom: '', marginTBlinked: '',
      gridCols: 12, gridRows: 0,
      colWidth: 120, gutterCol: 24, rowHeight: '', gutterRow: ''
    }
  },
  {
    name: 'Standard Magazine Page',
    preset: true,
    view: 0,
    data: {
      marginLeft: 48, marginRight: 48, marginLRlinked: 48,
      marginTop: 64, marginBottom: 64, marginTBlinked: 64,
      gridCols: 4, gridRows: 0,
      colWidth: '', gutterCol: 16, rowHeight: '', gutterRow: ''
    }
  }
];
figma.parameters.on('input', async ({ key, result }: ParameterInputEvent ) => {
  if (figma.currentPage.selection.length === 0) {
    result.setError('Please select one or more nodes first')
    return
  }
  switch (key) {
    case 'reboQuery':
      result.setLoadingMessage('Loading options...');
      const stored = await figma.clientStorage.getAsync("storedData") || [];
      const staticOptions = [
        { name: 'Clear all Guides', data: 'clear' },
        { name: 'Split Horizontally', data: 'split-center--h' },
        { name: 'Split Vertically', data: 'split-center--v' },
      ];
      const guideOptions = stored.map((g: any, i: number) => ({ name: `Apply Saved Guide: ${g.name}`, data: i }));
      result.setSuggestions([...staticOptions, ...guideOptions]);
      break;
    default:
      return;
  }
});

figma.on('run', async ({ command, parameters }: RunEvent) => {
  if(parameters) {
    const query = parameters.reboQuery as any;
    if(typeof query === 'number') {
      const stored = await figma.clientStorage.getAsync("storedData") || [];
      const guide = stored[query];
      if(!guide) { figma.notify('Saved guide not found'); figma.closePlugin(); return; }
      if(figma.currentPage.selection.length > 0) {
        figma.currentPage.selection.forEach((sel) => {
          const selection = sel as FrameNode;
          if(selection.type === "FRAME") {
            if(guide.type === 'raw') {
              addGuides(selection, guide.guides);
            } else {
              const pos = guide.data;
              const w = selection.width, h = selection.height;
              const guides: { axis: string; offset: number }[] = [];
              if(pos.marginLeft !== '') guides.push({ axis: 'X', offset: Number(pos.marginLeft) });
              if(pos.marginRight !== '') guides.push({ axis: 'X', offset: w - Number(pos.marginRight) });
              if(pos.marginTop !== '') guides.push({ axis: 'Y', offset: Number(pos.marginTop) });
              if(pos.marginBottom !== '') guides.push({ axis: 'Y', offset: h - Number(pos.marginBottom) });
              if(pos.gridCols > 1) {
                const gutW = Number(pos.gutterCol) || 0;
                const colW = pos.colWidth !== '' ? Number(pos.colWidth) : (w - (pos.marginLeft !== '' ? Number(pos.marginLeft) : 0) - (pos.marginRight !== '' ? Number(pos.marginRight) : 0) - gutW * (pos.gridCols - 1)) / pos.gridCols;
                const totalW = pos.gridCols * colW + (pos.gridCols - 1) * gutW;
                const startX = w / 2 - totalW / 2;
                for(let i = 0; i < pos.gridCols; i++) {
                  const colStart = startX + i * (colW + gutW);
                  guides.push({ axis: 'X', offset: Math.round(colStart) });
                  guides.push({ axis: 'X', offset: Math.round(colStart + colW) });
                }
              }
              addGuides(selection, guides);
            }
          }
        });
        figma.notify(`Applied "${guide.name}" ✨`);
      } else {
        figma.notify('🪟 Please select a Frame');
      }
      figma.closePlugin();
      return;
    }
    switch(query) {
      case 'split-center--v':
        if(figma.currentPage.selection.length > 0) {
          figma.currentPage.selection.forEach((sel) => {
            if(isGuidable(sel)) {
              addGuides(sel, [{ axis: "X", offset: sel.width/2 }]);
            } else if(figma.editorType === 'figma') {
              makeFrames(sel);
            }
          });
        } else {
          figma.notify('🪟 Please select a Frame');
        }
        break;
      case 'split-center--h':
        if(figma.currentPage.selection.length > 0) {
          figma.currentPage.selection.forEach((sel) => {
            if(isGuidable(sel)) {
              addGuides(sel, [{ axis: "Y", offset: sel.height/2 }]);
            } else if(figma.editorType === 'figma') {
              makeFrames(sel);
            }
          });
        } else {
          figma.notify('🪟 Please select a Frame');
        }
        break;
      case 'clear':
        if(figma.currentPage.selection.length > 0) {
          figma.currentPage.selection.forEach((sel) => {
            if(isGuidable(sel)) sel.guides = [];
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
    if('guides' in cs) cs.guides = [];
  })
}
function isGuidable(node: SceneNode): node is FrameNode {
  return 'guides' in node;
}

async function startUI() {
  figma.showUI(__html__, {
    width: 300,
    height: 313,
    themeColors: true
  });
  figma.ui.onmessage = async msg => {
    // console.log(figma.setCurrentPageAsync(figma.currentPage))
    switch (msg.type) {
      case 'add-guides':
        if(figma.currentPage.selection.length > 0) {
          figma.currentPage.selection.forEach((sel, idx) => {
            let guideData = msg.data;
            if(isGuidable(sel)) {
              addGuides(sel, guideData[idx]);
            } else if(figma.editorType === 'figma') {
              makeFrames(sel);
              addGuides(sel.parent, guideData[idx]);
            }
          });
        } else {
          figma.notify('🪟 Please select a Frame');
        }
        break;
      case 'split':
        if(figma.currentPage.selection.length > 0) {
          figma.currentPage.selection.forEach((sel)=>{
            if(isGuidable(sel)) {
              let splitDir = msg.dirType;
              if(splitDir === 'edgeTop')    addGuides(sel, [{ axis: "Y", offset: 0 }]);
              if(splitDir === 'edgeLeft')   addGuides(sel, [{ axis: "X", offset: 0 }]);
              if(splitDir === 'edgeRight')  addGuides(sel, [{ axis: "X", offset: sel.width }]);
              if(splitDir === 'edgeBottom') addGuides(sel, [{ axis: "Y", offset: sel.height }]);
              if(splitDir === 'centerHor')  addGuides(sel, [{ axis: "Y", offset: sel.height/2 }]);
              if(splitDir === 'centerVer')  addGuides(sel, [{ axis: "X", offset: sel.width/2 }]);
            } else if(figma.editorType === 'figma') {
              makeFrames(sel);
            }
          });
        } else {
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
        let storedGuides = await figma.clientStorage.getAsync("storedData");
        if (!storedGuides || storedGuides.length === 0) {
          storedGuides = DEFAULT_PRESETS;
          await figma.clientStorage.setAsync("storedData", storedGuides);
        }
        figma.ui.postMessage({ storedData: storedGuides });
        break;
      case 'restore-presets':
        const existing = await figma.clientStorage.getAsync("storedData") || [];
        const restored = [...DEFAULT_PRESETS, ...existing];
        await figma.clientStorage.setAsync("storedData", restored);
        figma.ui.postMessage({ storedData: restored });
        figma.notify('Default presets restored ✨');
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
          const sel = figma.currentPage.selection[0];
          if(isGuidable(sel)) {
            if(sel.guides.length === 0) {
              figma.notify('No guides found on this frame');
              break;
            }
            const rawGuides = sel.guides.map(g => ({ axis: g.axis, offset: g.offset }));
            figma.ui.postMessage({ rawGuidesFromSelection: rawGuides });
          } else {
            figma.notify('🪟 Please select a Frame');
          }
        } else {
          figma.notify('🪟 Please select a Frame');
        }
        break;
      case 'apply-raw-guides':
        if(figma.currentPage.selection.length > 0) {
          figma.currentPage.selection.forEach((sel) => {
            if(isGuidable(sel)) addGuides(sel, msg.guides);
          });
        } else {
          figma.notify('🪟 Please select a Frame');
        }
        break;
      case 'resize':
        figma.ui.resize(300, msg.height);
        break;
      case 'cancel':
        figma.closePlugin();
        break;
    }
  };
  figma.currentPage.setRelaunchData({ Relaunch: '' })
}