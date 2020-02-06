'use strict'

function PaperSizes () {

  const SIZES = [
    [ 'Half-Letter', 140, 216, 'North American', 'Common' ],
    [ 'Letter', 216, 279, 'North American', 'Common' ],
    [ 'Legal', 216, 356, 'North American', 'Common' ],
    [ 'Junior-Legal', 127, 203, 'North American', 'Common' ],
    [ 'Ledger/Tabloid', 279, 432, 'North American', 'Common' ],
    [ 'Postcard', 101.6, 152.4, 'North American', 'Common' ],
    [ 'Poster-Small', 280, 430, 'North American', 'Common' ],
    [ 'Poster', 460, 610, 'North American', 'Common' ],
    [ 'Poster-Large', 610, 910, 'North American', 'Common' ],
    [ 'Business-Card', 50.8, 88.9, 'North American', 'Common' ],
    [ 'ANSI-a', 216, 279, 'North American', 'Uncommon' ],
    [ 'ANSI-b', 279, 432, 'North American', 'Uncommon' ],
    [ 'ANSI-c', 432, 559, 'North American', 'Uncommon' ],
    [ 'ANSI-d', 559, 864, 'North American', 'Uncommon' ],
    [ 'ANSI-e', 864, 1118, 'North American', 'Uncommon' ],
    [ 'Arch-a', 229, 305, 'North American', 'Uncommon' ],
    [ 'Arch-b', 305, 457, 'North American', 'Uncommon' ],
    [ 'Arch-c', 457, 610, 'North American', 'Uncommon' ],
    [ 'Arch-d', 610, 914, 'North American', 'Uncommon' ],
    [ 'Arch-e', 914, 1219, 'North American', 'Uncommon' ],
    [ 'Arch-e1', 762, 1067, 'North American', 'Uncommon' ],
    [ 'Arch-e2', 660, 965, 'North American', 'Uncommon' ],
    [ 'Arch-e3', 686, 991, 'North American', 'Uncommon' ],
    [ '2R', 64, 89, 'Photo Print' ],
    [ '3R', 89, 127, 'Photo Print' ],
    [ '4R', 102, 152, 'Photo Print' ],
    [ '5R', 127, 178, 'Photo Print' ],
    [ '6R', 152, 203, 'Photo Print' ],
    [ '8R', 203, 254, 'Photo Print' ],
    [ '10R', 254, 305, 'Photo Print' ],
    [ '11R', 279, 356, 'Photo Print' ],
    [ '12R', 305, 381, 'Photo Print' ],
    [ 'A0', 841, 1189, 'International', 'A Series' ],
    [ 'A1', 594, 841, 'International', 'A Series' ],
    [ 'A2', 420, 594, 'International', 'A Series' ],
    [ 'A3', 297, 420, 'International', 'A Series' ],
    [ 'A4', 210, 297, 'International', 'A Series' ],
    [ 'A5', 148, 210, 'International', 'A Series' ],
    [ 'A6', 105, 148, 'International', 'A Series' ],
    [ 'A7', 74, 105, 'International', 'A Series' ],
    [ 'A8', 52, 74, 'International', 'A Series' ],
    [ 'A9', 37, 52, 'International', 'A Series' ],
    [ 'A10', 26, 37, 'International', 'A Series' ],
    [ '2A0', 1189, 1682, 'International', 'A Series' ],
    [ '4A0', 1682, 2378, 'International', 'A Series' ],
    [ 'B0', 1000, 1414, 'International', 'B Series' ],
    [ 'B1', 707, 1000, 'International', 'B Series' ],
    [ 'B1+', 720, 1020, 'International', 'B Series' ],
    [ 'B2', 500, 707, 'International', 'B Series' ],
    [ 'B2+', 520, 720, 'International', 'B Series' ],
    [ 'B3', 353, 500, 'International', 'B Series' ],
    [ 'B4', 250, 353, 'International', 'B Series' ],
    [ 'B5', 176, 250, 'International', 'B Series' ],
    [ 'B6', 125, 176, 'International', 'B Series' ],
    [ 'B7', 88, 125, 'International', 'B Series' ],
    [ 'B8', 62, 88, 'International', 'B Series' ],
    [ 'B9', 44, 62, 'International', 'B Series' ],
    [ 'B10', 31, 44, 'International', 'B Series' ],
    [ 'B11', 22, 32, 'International', 'B Series' ],
    [ 'B12', 16, 22, 'International', 'B Series' ],
    [ 'C0', 917, 1297, 'International', 'C Series' ],
    [ 'C1', 648, 917, 'International', 'C Series' ],
    [ 'C2', 458, 648, 'International', 'C Series' ],
    [ 'C3', 324, 458, 'International', 'C Series' ],
    [ 'C4', 229, 324, 'International', 'C Series' ],
    [ 'C5', 162, 229, 'International', 'C Series' ],
    [ 'C6', 114, 162, 'International', 'C Series' ],
    [ 'C7', 81, 114, 'International', 'C Series' ],
    [ 'C8', 57, 81, 'International', 'C Series' ],
    [ 'C9', 40, 57, 'International', 'C Series' ],
    [ 'C10', 28, 40, 'International', 'C Series' ],
    [ 'C11', 22, 32, 'International', 'C Series' ],
    [ 'C12', 16, 22, 'International', 'C Series' ]
  ];

  this.buildMenuTemplate = function(onClick) {
    const menuDict = {}
    for (const paper of SIZES) {
      const category = paper[3]
      const subcategory = paper[4]
      if (paper[4]) {
        const categoryDict = menuDict[category] || {}
        const subcategoryArray = categoryDict[subcategory] || []
        subcategoryArray.push({name: paper[0], dims: [paper[1], paper[2]]})
        categoryDict[subcategory] = subcategoryArray
        menuDict[category] = categoryDict
      } else {
        const categoryArray = menuDict[category] || []
        categoryArray.push({name: paper[0], dims: [paper[1], paper[2]]})
        menuDict[category] = categoryArray
      }
    }

    const menuTemplate = {
      label: "Paper Size"
    }
    const categories = []
    for (const category of Object.keys(menuDict)) {
      const categoryDict = {
        label: category
      }
      const submenu = []
      if (Array.isArray(menuDict[category])) {
        for (const menuitem of menuDict[category]) {
          submenu.push({label: menuitem.name, click: onClick.bind(null, menuitem.dims)})
        }
      } else {
        for (const subcategory of Object.keys(menuDict[category])) {
          const subcategoryDict = {
            label: subcategory
          }
          const subsubmenu = []
          for (const menuitem of menuDict[category][subcategory]) {
            subsubmenu.push({label: menuitem.name, click: onClick.bind(null, menuitem.dims)})
          }
          subcategoryDict.submenu = subsubmenu
          submenu.push(subcategoryDict)
        }
      }
      categoryDict.submenu = submenu
      categories.push(categoryDict)
    }
    menuTemplate.submenu = categories
    return menuTemplate
  }
}
