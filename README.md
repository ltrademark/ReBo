![ReBo](https://static.basedcdn.com/madebyLTM/src/assets/rebo-icon.png)
# ReBo | Guides for Figma

A Figma plugin to help you create and manage guides in your project. You can find the plugin [here](https://www.figma.com/community/plugin/949842685113537477/rebo).

## 💫 Features

✨ Easily add mirrored margin bounds to your frames
✨ Create Columns for a quick column (or row) grid
✨ Save your guides for use later
✨ Quick-guide shortcuts to add center margins
✨ Multi-frame guides clear
✨ KeyCombo! `Control` + `Shift` + `S` to save your current guides

## 📦 Development
1. Clone Repo
2. Run `yarn` to install packages & dependencies
3. With hopefully no errors, run `yarn dev` to start running the plugin.
4. Run the plugin in Figma to test (be sure to have that console open, just in case).

---

## ✅ To Do
- Update Vue to vue3 and find replacement for deprecated packages
- Eventually Merge columns and rows into a single primary tab.
- Add "get guides from selection" function for "saved guides".

## 🗑️ Completed
- ~~implement parameter input~~
- ~~update to support themes (dark/light/system)~~
- ~~finish quick-add actions~~
- ~~finalize UI~~
- ~~import icons~~
- ~~wire up tray action~~
- ~~create "linked" state in margins~~
- ~~Wire up ALL actions~~
- ~~Logic and test margins~~
- ~~Logic and text columns/rows with gutters (these will likely depend on margins)~~
- ~~test push all settings (per view) into figma UI~~
- ~~add localStorage for users saved guides~~
- ~~Optimize Saved data and applying saved guides.~~
- ~~squash bugs~~
- ~~maybe swap params for a perma re-launch button instead~~
  - ~~or just oversimplify actions/params~~

---

## 🪲 Active Bugs
- ~~when adding a saved guide to a new frame, some guides are out of bounds.~~
- ~~selecting multiple frames and applying margins only respects one frame~~
- ~~local client storage for saved guides needs looking at~~