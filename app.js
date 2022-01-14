// GLOBAL SELECTIONS AND VARIABLES

const colorDivs = document.querySelectorAll('.color')
const generateBtn = document.querySelector('.generate')
const sliders = document.querySelectorAll('input[type="range"]')
const currentHexes = document.querySelectorAll('.color h2')
const popup = document.querySelector('.copy-container')
const adjustButton = document.querySelectorAll('.adjust')
const closeAdjustments = document.querySelectorAll('.close-adjustment')
const sliderContainer = document.querySelectorAll('.sliders')
const lockButton = document.querySelectorAll('.lock')
let initialColors
//THS IS FOR LOCAL STORAGE
let savedPalettes = []

// EVENT LISTENERS

sliders.forEach(slider => {
    slider.addEventListener('input', hslControls)
})

colorDivs.forEach((div, index) => {
    div.addEventListener('change', () => {
        updateTextUI(index)
    })
})

currentHexes.forEach(hex => {
    hex.addEventListener('click', () => {
        copyToClipboard(hex)
    })
})

popup.addEventListener('transitionend', () => {
    const popupBox = popup.children[0]
    popup.classList.remove('active')
    popupBox.classList.remove('active')
})

adjustButton.forEach((button, index) => {
    button.addEventListener('click', () => {
        openAdjustmentPanel(index)
    })
})

closeAdjustments.forEach((button, index) => {
    button.addEventListener('click', () => {
        closeAdjustmentPanel(index)
    })
})

// FUNCTIONS

// COLOR GENERATOR

function generateHex() {
    const hexColor = chroma.random()
    return hexColor
}

function randomColors() {
    initialColors = []
    colorDivs.forEach((div, index) => {
        const hexText = div.children[0]
        const randomColor = generateHex()
        initialColors.push(chroma(randomColor.hex()))
        // ADD HEX TO TEXT
        div.style.backgroundColor = randomColor
        hexText.innerText = randomColor
        // CHECK CONTRAST
        checkTextContrast(randomColor, hexText)
        // INITIAL COLORIZE SLIDERS
        const color = chroma(randomColor)
        const sliders = div.querySelectorAll('.sliders input')
        const hue = sliders[0]
        const brightness = sliders[1]
        const saturation = sliders[2]
        colorizeSliders(color, hue, brightness, saturation)
    })
    resetInputs()
    // CHECK BUTTON CONTRAST
    adjustButton.forEach((button, index) => {
        
    })
}

function checkTextContrast(color, text) {
    const luminance = chroma(color).luminance()
    if(luminance > 0.5) {
        text.style.color = 'black'
    } else {
        text.style.color = 'white'
    }
}

function colorizeSliders(color, hue, brightness, saturation) {
    // SATURATION
    const noSat = color.set('hsl.s, 0')
    const fullSat = color.set('hsl.s, 1')
    const scaleSat = chroma.scale([noSat, color, fullSat])
    // BRIGHTNESS
    const midBright = color.set('hsl.l, 0.5')
    const scaleBright = chroma.scale(['black', midBright, 'white'])
    // UPDATE INPUT COLORS
    saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)}, ${scaleSat(1)})`
    brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(0)}, ${scaleBright(1)})`
    hue.style.backgroundImage = `linear-gradient(to right, rgb(204, 75, 75), rgb(204, 204, 75), rgb(75, 204, 75), rgb(75, 204, 204), rgb(75, 75, 204), rgb(204, 75, 204), rgb(204, 75, 75))`
}

function hslControls(e) {
    const index =
        e.target.getAttribute('data-bright') ||
        e.target.getAttribute('data-saturation') ||
        e.target.getAttribute('data-hue')

        let sliders = e.target.parentElement.querySelectorAll('input[type="range"]')
        const hue = sliders[0]
        const brightness = sliders[1]
        const saturation = sliders[2]

        const bgColor = initialColors[index]

        let color = chroma(bgColor)
            .set('hsl.s, saturation.value')
            .set('hsl.l, brightness.value')
            .set('hsl.h, hue.value')

        colorDivs[index].style.backgroundColor = color

        colorizeSliders(color, hue, brightness, saturation)
}

function updateTextUI(index) {
    const activeDiv = colorDivs[index]
    const color = chroma(activeDiv.style.backgroundColor)
    const textHex = activeDiv.querySelector('h2')
    const icons = activeDiv.querySelectorAll('.controls button')
    textHex.innerText = color.hex()
    // CHECK CONTRAST
    checkTextContrast(color, textHex)
    for (icon of icons) {
        checkTextContrast(color, icon)
    }
}

function resetInputs() {
    const sliders = document.querySelectorAll('.sliders input')
    sliders.forEach(slider => {
        if(slider.name === 'hue') {
            const hueColor = initialColors[slider.getAttribute('data-hue')]
            const hueValue = chroma(hueColor).hsl()[0]
            slider.value = Math.floor(hueValue)
        }
        if(slider.name === 'brightness') {
            const brightColor = initialColors[slider.getAttribute('data-bright')]
            const brightValue = chroma(brightColor).hsl()[2]
            slider.value = Math.floor(brightValue * 100) / 100
        }
        if(slider.name === 'saturation') {
            const satColor = initialColors[slider.getAttribute('data-sat')]
            const satValue = chroma(satColor).hsl()[1]
            slider.value = Math.floor(satValue * 100) / 100
        }
    })
}

function copyToClipboard(hex) {
    const el = document.createElement('textarea')
    el.value = hex.innerText
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    // POPUP ANIMATION
    const popupBox = popup.children[0]
    popup.classList.add('active')
    popupBox.classList.add('active')
}

function openAdjustmentPanel(index) {
    sliderContainers[index].classList.toggle('active')
}

function closeAdjustmentPanel(index) {
    sliderContainers[index].classList.remove('active')
}

randomColors()

// SAVE TO PALETTE AND LOCAL STORAGE

const saveBtn = document.querySelector('.save')
const submitBtn = document.querySelector('.submit-save')
const closeBtn = document.querySelector('.close-save')
const saveContainer = document.querySelector('.save-container')
const saveInput = document.querySelector('.save-container input')
const libraryContainer = document.querySelector('.library-container')
const libraryBtn = document.querySelector('.library')
const closeLibraryBtn = document.querySelector('.close-library')

// EVENT LISTENERS

saveBtn.addEventListener('click', openPalette)
closeSave.addEventListener('click', closePalette)
submitSave.addEventListener('click', closePalette)
libraryBtn.addEventListener('click', openLibrary)
closeLibraryBtn.addEventListener('click', closeLibrary)

function openPalette(e) {
    const popup = saveContainer.children[0]
    saveContainer.classList.add('active')
    popup.classList.add('active')
}

function closePalette(e) {
    const popup = saveContainer.children[0]
    saveContainer.classList.remove('active')
    popup.classList.remove('active')
}

function savePalette(e) {
    saveContainer.classList.remove(active)
    popup.classList.remove(active)
    const name = saveInput.value
    const colors = []
    currentHexes.forEach(hex => {
        colors.push(hex.innerText)
    })

    let paletteNr
    if (paletteObjects) {
        paletteNr = paletteObjects.length
    } else {
        paletteNr = savedPalettes.length
    }




    // GENERATE OBJECT
    let paletteNr = savedPalettes.length
    let paletteObj = {name, colors, nr: paletteNr}
    savedPalettes.push(paletteObj)
    // SAVE TO LOCAL STORAGE
    savetoLocal(paletteObj)
    saveInput.value = ''
    // GENERATE PALETTE FOR LIBRARY
    const palette = document.createElement('div')
    palette.classList.add('custom-palette')
    const title = document.createElement('h4')
    title.innerText = paletteObj.name
    const preview = document.createElement('div')
    preview.classList.add('small-preview')
    paletteObj.colors.forEach(smallColor => {
        const smallDiv = document.createElement('div')
        smallDiv.style.backgroundColor = smallColor
        preview.appendChild(smallDiv)
    })
    const paletteBtn = document.createElement('button')
    paletteBtn.classList.add('pick-palette-btn')
    paletteBtn.classList.add(paletteObj.nr)
    paletteBtn.innerText = 'Select'

    //EVENT LISTENER PALETTE BTN
    paletteBtn.addEventListener('click', e => {
        closeLibrary()
        const paletteIndex = e.target.classList[1]
        initialColors = []
        savedPalettes[paletteIndex].colors.forEach((color, index) => {
            initialColors.push(color)
            colorDivs[index].style.backgroundColor = color
            const text = colorDivs[index].children[0]
        })
    })

    // APPEND TO LIBRARY
    palette.appendChild(title)
    palette.appendChild(preview)
    palette.appendChild(paletteBtn)
    libraryContainer.children[0].appendChild(palette)
}

function savetoLocal(paletteObj) {
    let localPalettes
    if(localStorage.getItem('palettes') === null) {
        localPalettes = []
    } else {
        localPalettes = JSON.parse(localStorage.getItem('palettes'))
    }
    localPalettes.push(paletteObj)
    localStorage.setItem('palettes', JSON.stringify(localPalettes))
}

function openLibrary() {
    const popup = libraryContainer.children[0]
    libraryContainer.classList.add('active')
    popup.classList.add('active')
}

function closeLibrary() {
    const popup = libraryContainer.children[0]
    libraryContainer.classList.remove('active')
    popup.classList.remove('active')
}

function getLocal() {
    if(localStorage.getItem('palettes') === null) {
        localStorage = []
    } else {
        const paletteObjects = JSON.parse(localStorage.getItem('palettes'))
        paletteObjects.forEach(paletteObj => {
            
        })
    }
}