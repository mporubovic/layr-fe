<template>
    <div class="whiteboard">
        
        <div class="canvas-container" id="canvas-container" @click="canvasMouseClick" v-touch:tap="canvasMouseClick">
            <!-- <canvas class="canvas" id="canvas"> -->
            <canvas class="canvas" :id="'canvas-'+content[0].id">

            </canvas>
        </div>            
        
        <div class="toolbar">
            <div class="toolbar-secondary">
                <div class="pen-tool-options" v-show="selectedTool === 'penTool'">
                    <color-selector :globalColor="globalColor" @colorSelected="colorSelected"></color-selector>
                </div>

                <div class="select-tool-options" v-show="selectedTool === 'selectionTool'">
                    Selection tool
                </div>

                <div class="shape-tool-options" v-show="selectedTool === 'shapeTool'">
                    <color-selector :globalColor="globalColor" @colorSelected="colorSelected"></color-selector>


                    <div class="toolbar-secondary-vertical-spacer"></div>
                    
                    <div class="shape-fill-selector">
                        <button class="shape-fill-button-empty shape-button-common" @click="shapeFillSelected('shapeFill')" :ref="'shapeFill'">
                            <img src="@/assets/programs/whiteboard/square-full.svg" title="Filled">
                        </button>   
                        <button class="shape-fill-button-full shape-button-common" @click="shapeFillSelected('shapeEmpty')" :ref="'shapeEmpty'">
                            <img src="@/assets/programs/whiteboard/square-empty.svg" title="No fill">
                        </button>
                    </div>
                    
                    <div class="toolbar-secondary-vertical-spacer"></div>

                    <div class="shape-selector">
                        <button class="shape-button-square shape-button-common" @click="shapeSelected('shapeSquare')" :ref="'shapeSquare'">
                            <img src="@/assets/programs/whiteboard/square.svg" title="Square" >
                        </button>
                        <button class="shape-button-circle shape-button-common" @click="shapeSelected('shapeCircle')" :ref="'shapeCircle'">
                            <img src="@/assets/programs/whiteboard/circle.svg" title="Circle" >
                        </button>
                        <button class="shape-button-triangle shape-button-common" @click="shapeSelected('shapeTriangle')" :ref="'shapeTriangle'">
                            <img src="@/assets/programs/whiteboard/triangle.svg" title="Triangle" >
                        </button>
                        <button class="shape-button-line shape-button-common" @click="shapeSelected('shapeLine')" :ref="'shapeLine'">
                            <img src="@/assets/programs/whiteboard/line-diagonal.svg" title="Line">
                        </button>
                        <!-- <button class="shape-button-arrow shape-button-common" @click="shapeSelected('shapeArrow')" :ref="'shapeArrow'" disabled>
                            <img src="@/assets/programs/whiteboard/arrow-right.svg" title="Arrow" >
                        </button> -->
                    </div>
                </div>

                <div class="text-tool-options" v-show="selectedTool === 'textTool'">
                    <color-selector :globalColor="globalColor" @colorSelected="colorSelected"></color-selector>
                </div>                
                
                <div class="settings-tool-options" v-show="selectedTool === 'settingsTool'">
                    
                    
                    
                    <div class="settings-grid">
                        <p class="settings-header-text">Grid</p>
                        <div class="settings-grid-controls">
                            <label for="gridCheckbox" style="color: white; margin-right: 8px">Show</label>
                            <input
                                @change="toggleGrid($event)"
                                type="checkbox"
                                class="settings-grid-toggle"
                                id="gridCheckbox"
                                :checked="gridCheckbox"
                            /> 
                            <label for="range" style="color: white; margin-right: 8px; margin-left: 15px">Size</label>

                            <input type="range" min="5" max="100" class="settings-grid-size" id="gridRangeValue" @input="gridSizeChange($event)">
                        </div>

                    </div>
                    
                    <div class="toolbar-secondary-horizontal-spacer"></div>
                    
                    <div class="settings-misc">
                        <button class="tool-button-common settings-button-export" @click="exportCanvas" disabled>Export</button>
                        <button class="tool-button-common settings-button-clear" @click="clearCanvas">Clear</button>
                    </div>                    
                    
                    <div class="toolbar-secondary-horizontal-spacer"></div>



                    <div class="settings-background">
                        <p class="settings-header-text">Background color</p>
                        <color-selector :localColor="canvasBackgroundColor" :transparentColor="true" @colorSelected="colorSelected"></color-selector>
                    </div>
                    
                </div>
            </div>
            
            <div class="toolbar-primary">
                <div class="pen-tool">
                    <button class="tool-button-common pen-tool-button" @click="toolClicked('penTool')" :ref="'penTool'">
                        <img src="@/assets/programs/whiteboard/pen.svg" title="Pen" draggable="false" >
                    </button>
                </div>
                
                <div class="select-tool">
                    <button class="tool-button-common select-tool-button" @click="toolClicked('selectionTool')" :ref="'selectionTool'">
                        <img src="@/assets/programs/whiteboard/select.svg" title="Select" draggable="false">
                    </button>
                </div>
                
                <div class="shape-tool">
                    <button class="tool-button-common shape-tool-button" @click="toolClicked('shapeTool')" :ref="'shapeTool'">
                        <img src="@/assets/programs/whiteboard/shapes.svg" title="Shapes" draggable="false">
                    </button>
                </div>            
                


                <div class="text-tool">
                    <button class="tool-button-common text-tool-button" @click="toolClicked('textTool')" :ref="'textTool'">
                        <img src="@/assets/programs/whiteboard/text.svg" title="Text" draggable="false">
                    </button>
                </div>

                <div class="settings-tool">
                    <button class="tool-button-common settings-tool-button" @click="toolClicked('settingsTool')" :ref="'settingsTool'">
                        <img src="@/assets/programs/whiteboard/settings.svg" title="Settings" draggable="false">
                    </button>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import { fabric } from "fabric";
import ColorSelector from './ColorSelector.vue'


export default {

    components: {
        ColorSelector,
    },
    
    props: {
        cardDimensions: {
            type: Object
        },

        content: {
            type: Array,
            required: true,
        },

        cardRect: {
            type: Object,
        }
    },

    computed: {
        gridCheckbox() {
            return this.canvas ? this.canvas.grid ? this.canvas.grid.show : false : false 
        },
        
        gridRangeValue() {
            return this.canvas ? this.canvas.grid ? this.canvas.grid.size : 10 : 10
        }
    },

    data() {
        return {
            canvas: null,
            selectedTool: null,
            selectedShapeFill: null,
            selectedShape: null,
            deleteIcon: null,
            duplicateIcon: null,
            autosaveTimeoutDelay: 5000,
            autosaveTimeout: null,
            globalColor: null,
            canvasBackgroundColor: null,
            gridObjectId: null,
        }
    },

    mounted() {
        this.canvas = new fabric.Canvas('canvas-'+this.content[0].id)

        this.canvas.loadFromJSON(this.content[0].whiteboard.data)

        // this.canvas.backgroundColor ? null : this.canvasBackgroundColor = '#FFFFFF'
        this.canvasBackgroundColor = this.canvas.backgroundColor ? this.colorHexToName(this.canvas.backgroundColor) : 'transparentColor'
        if (this.canvas.grid) {
            this.$el.querySelector('#gridRangeValue').value = this.canvas.grid.size
            if (this.canvas.grid.show) this.$nextTick(() => this.drawGrid(this.canvas.grid.size, true))
        }
        




        this.$nextTick(() => {
            this.canvas.on('object:added', this.canvasChanged)
            this.canvas.on('object:removed', this.canvasChanged)
            this.canvas.on('object:modified', this.canvasChanged)            
        })

        this.deleteIcon = document.createElement('img')
        this.deleteIcon.src = require('@/assets/programs/whiteboard/remove.svg')
        this.duplicateIcon = document.createElement('img')
        this.duplicateIcon.src = require('@/assets/programs/whiteboard/duplicate.svg')

        fabric.Object.prototype.controls.deleteControl = new fabric.Control({
            x: 0.5,
            y: -0.5,
            offsetY: -15,
            offsetX: 35,
            cursorStyle: 'pointer',
            mouseUpHandler: this.deleteObject,
            render: this.renderDeleteIcon,
            cornerSize: 15
        });

          fabric.Object.prototype.controls.clone = new fabric.Control({
            x: 0.5,
            y: -0.5,
            offsetY: -15,
            offsetX: 15,
            cursorStyle: 'pointer',
            mouseUpHandler: this.duplicateObject,
            render: this.renderDuplicateIcon,
            cornerSize: 15
        });



        this.canvas.freeDrawingBrush.width = 3

        fabric.Object.prototype.transparentCorners = false;
        fabric.Object.prototype.cornerColor = 'rgba(0, 0, 255, 0.5)';
        fabric.Object.prototype.cornerStyle = 'circle';
        fabric.Object.prototype.borderScaleFactor = 3;

        // this.canvas.add(new fabric.Circle({radius: 20, fill: "#0000FF", left: 200, top: 200, strokeWidth: 5, stroke: '#FFA500'}))

        this.canvas.setHeight(this.$el.querySelector('#canvas-container').getBoundingClientRect().height)
        this.canvas.setWidth(this.$el.querySelector('#canvas-container').getBoundingClientRect().width)

        // this.canvas.backgroundColor = "#FFFFFF"
        this.canvas.selection = false

        this.toolClicked('penTool')
        this.colorSelected('blackColor')
        
        this.canvasObjectsUniformStroke(this.canvas.getObjects())
    },

    created() {
        window.addEventListener("resize", this.windowResized);
    },

    beforeDestroy() {
        if (this.autosaveTimeout) { 
            this.canvasAutosave()  
        }
    },
    
    destroyed() {
        clearTimeout(this.autosaveTimeout)
        window.removeEventListener("resize", this.windowResized);
    },

    methods: {
        toolClicked(tool) {

            if (this.selectedTool === tool) return

            if (this.selectedTool) this.$refs[this.selectedTool].style['background-color'] = 'white'
            this.$refs[tool].style['background-color'] = 'lightgreen'

            this.selectedTool = tool
            
            this.canvas.isDrawingMode = false
            this.selectedShape = null
            this.selectedShapeFill = null

            switch (tool) {
                case "penTool": 
                    this.canvas.isDrawingMode = true
                    break

                case "selectionTool": 
                    this.canvas.isDrawingMode = false
                    this.canvas.selection = true

                    break
                    
                case "shapeTool": 
                    this.canvas.selection = false
                    this.shapeFillSelected('shapeFill')
                    // this.shapeSelected("shapeSquare")
                    
                    break
                    
                case "textTool": 
                    
                    break
                    
                case "eraserTool": 
                    
                    break
                    
                case "settingsTool": 
                    
                    break
                    


            }

        },


        colorSelected(color) {
            // this.$refs[color].style['opacity'] = 1

            let colorHex = this.colorNameToHex(color)



            switch (this.selectedTool) {
                case "penTool": 
                    this.globalColor = color
                    this.canvas.freeDrawingBrush.color = colorHex

                    break

                case "selectionTool": 


                    break
                    
                case "shapeTool": {
                    this.globalColor = color

                    return
                }
                    
                case "textTool": 
                    this.globalColor = color
                    
                    break
                    
                case "settingsTool": 
                    this.canvasBackgroundColor = color
                    this.canvas.backgroundColor = colorHex
                    this.canvas.renderAll()
                    this.canvasChanged()
                    break
            }

        },

        colorNameToHex(color) {
            switch (color) {
                case 'whiteColor': return "#FFFFFF"
                case 'blackColor': return "#000000"
                case 'blueColor': return "#0000FF"
                case 'redColor': return "#FF0000"
                case 'greenColor': return "#00FF00"
                case 'yellowColor': return "#FFFF00"
                case 'orangeColor': return "#FFA500"
            }
        },

        shapeSelected(shape) {
            if (shape === "none") {
                console.log('selectedShape = ', this.selectedShape)
                this.$refs[this.selectedShape].style['background-color'] = 'white'
                this.selectedShape = null
                console.log('selectedShape = ', this.selectedShape)
                return


            }
            
            if (this.selectedShape === shape) return

            if (this.selectedShape) this.$refs[this.selectedShape].style['background-color'] = 'white'



            
            this.$nextTick(()=> { this.$refs[shape].style['background-color'] = 'lightgreen' })

            this.selectedShape = shape
            
            this.canvas.isDrawingMode = false
                    
        },      
        
        shapeFillSelected(shapeFill) {

            if (this.selectedShapeFill) this.$refs[this.selectedShapeFill].style['background-color'] = 'white'

            
            this.$nextTick(()=> { this.$refs[shapeFill].style['background-color'] = 'lightgreen' })

            this.selectedShapeFill = shapeFill
            
            this.canvas.isDrawingMode = false
                    
        },

        canvasMouseClick(e) {
            switch (this.selectedTool) {
                case "shapeTool":
                    if (this.selectedShape) this.placeShapeOnCanvas(this.canvas.getPointer(e))
                    break
                case "textTool": this.placeTextOnCanvas(this.canvas.getPointer(e))
            }
  
        },

        placeShapeOnCanvas(position) {
            let posX = position.x
            let posY = position.y

            let fill = this.selectedShapeFill === "shapeFill" 
            let color = this.colorNameToHex(this.globalColor)
            let shape
            let baseSettings = {
                left: posX - 50,
                top: posY - 50,
                ...(fill && {fill: color}),
                ...(!fill && {stroke: color}),
                ...(!fill && {strokeWidth: 3}),
                ...(!fill && {fill: null}),
            }

            switch (this.selectedShape) {
                case "shapeSquare": 
                    shape = new fabric.Rect({
                        ...baseSettings,
                        width: 100,
                        height: 100,
                    })
                    break

                case "shapeCircle": 
                    shape = new fabric.Circle({
                        ...baseSettings,
                        radius: 50,
                    })

                    break
                    
                case "shapeTriangle": {
                    shape = new fabric.Triangle({
                        ...baseSettings,
                        width: 100,
                        height: 100,
                    })
                    break
                }
                case "shapeLine": 
                    // shape = new fabric.Line( [posX-50, posY-50, posX+50, posY+50], {
                    shape = new fabric.Line( [posX-50, posY, posX+50 ,posY], {
                        stroke: color,
                        strokeWidth: 5,
                    })
                    
                    shape.setControlsVisibility({
                        tr: false,
                        tl: false,
                        bl: false,
                        br: false,
                        ml: true,
                        mt: false,
                        mr: true,
                        mb: false,
                        mtr: true
                    })

                    // shape.hasBorders = false
                    
                    break
                    
                case "shapeArrow": 
                    
                    break
                    
                    
            }
            this.deselectAllObjects()

            this.canvas.add(shape)

            this.canvas.setActiveObject(shape)

            this.canvasObjectsUniformStroke([shape])

            this.shapeSelected("none")
        },

        placeTextOnCanvas(position) {
            let posX = position.x
            let posY = position.y

            let baseText = "Double-click me"

            let baseSettings = {
                left: posX-40,
                top: posY-20,
                fontFamily: 'Poppins',
                fontSize: 30,
                fill: this.colorNameToHex(this.globalColor)
            }

            let text = new fabric.IText(baseText, baseSettings)
            this.canvas.add(text)
            this.canvas.setActiveObject(text)
            this.toolClicked('selectionTool')

        },


        canvasObjectsUniformStroke(objects) {
            objects.forEach(o => {
                o.set('strokeUniform', true)
            });
        },

        colorHexToName(hex) {
            switch (hex) {
                case '#FFFFFF': return "whiteColor"
                case '#0000FF': return "blueColor"
                case '#FF0000': return "redColor"
                case '#00FF00': return "greenColor"
                case '#FFFF00': return "yellowColor"
                case '#FFA500': return "orangeColor"
            }
        },

        deselectAllObjects() {
            this.canvas.discardActiveObject().renderAll()
        },

        renderDeleteIcon(ctx, left, top, styleOverride, fabricObject) {
            let size = 20
            ctx.save()
            ctx.translate(left, top)
            ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle))
            ctx.drawImage(this.deleteIcon, -size/2, -size/2, size, size)
            ctx.restore()
        },



        deleteObject(eventData, target) {
            let canvas = target.canvas
            console.log(canvas)
            console.log("TARGET", target)
            if (target.type === "activeSelection") {
                target.getObjects().forEach(object => {
                    canvas.remove(object)
                    
                })
            } else canvas.remove(target)

            canvas.discardActiveObject()
            
            canvas.requestRenderAll()
        },

        renderDuplicateIcon(ctx, left, top, styleOverride, fabricObject) {
            let size = 20
            ctx.save()
            ctx.translate(left, top)
            ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle))
            ctx.drawImage(this.duplicateIcon, -size/2, -size/2, size, size)
            ctx.restore()
        },

        duplicateObject(eventData, target) {
            let canvas = this.canvas
            if (target.type === "activeSelection") {
                let objects = target.getObjects()
                let clonedObjects = []
                let matrix = target.calcTransformMatrix()

                objects.forEach(object => {
                    object.clone(function(cloned) {
                        let newPoint = fabric.util.transformPoint({y: object.top, x: object.left}, matrix)
                        cloned.left = newPoint.x + target.width + 20
                        cloned.top = newPoint.y
                        canvas.add(cloned)
                        clonedObjects.push(cloned)
                    })
                })

                this.canvasObjectsUniformStroke(clonedObjects)
                // canvas.discardActiveObject();
                let selection = new fabric.ActiveSelection(clonedObjects, {
                    canvas: canvas,
                })
                canvas.setActiveObject(selection)
                // canvas.requestRenderAll()

            } else {
                target.clone(function(cloned) {
                    cloned.left += (target.aCoords.tr.x - target.aCoords.tl.x) + 20
                    canvas.add(cloned)
                    canvas.setActiveObject(cloned)
                    this.canvasObjectsUniformStroke([cloned])
                }.bind(this))
            }


        },

        canvasChanged() {
            clearTimeout(this.autosaveTimeout)
            this.autosaveTimeout = setTimeout(() => {
                this.canvasAutosave()
            }, this.autosaveTimeoutDelay);
        },

        canvasAutosave() {
            // this.hello()
            console.log('AUTOSAVE FROM CANVAS')
            let updatedCanvas = JSON.parse ( JSON.stringify ( this.content[0] ) )
        
            updatedCanvas.whiteboard.data = JSON.stringify(this.canvas.toJSON(['grid']))
            
            this.$emit('programUpdatedContent', "whiteboard", updatedCanvas)

        },

        toggleGrid() {
            let show = event.target.checked
            let size = this.canvas.grid ? this.canvas.grid.size : 10 
            if (show) this.drawGrid(size)
            else this.removeGrid()
            
        },

        gridSizeChange(e) {
            if (!this.canvas.grid || !this.canvas.grid.show) this.$el.querySelector('#gridCheckbox').checked = true
            let size = parseInt(e.target.value)
            this.drawGrid(size)
        },

        drawGrid(gridSize, noUpdate) {
            if (this.canvas.getObjects().filter(o => o.name === "grid").length > 0) this.removeGrid()

            gridSize || (gridSize = 20)
            let horizontalLines = []
            let verticalLines = []

            for(let i=1;i<(this.canvas.width/gridSize);i++)
            {
                verticalLines.push(new fabric.Line([gridSize*i, 0, gridSize*i, this.canvas.height],{ stroke: "#000000", strokeWidth: 1, selectable:false,})) // vertical
            }
            for(let i=1;i<(this.canvas.height/gridSize);i++)
            {
                horizontalLines.push(new fabric.Line([0, gridSize*i, this.canvas.width, gridSize*i],{ stroke: "#000000", strokeWidth: 1, selectable:false,})) // horizontal
            }

            let lines = horizontalLines.concat(verticalLines)
            let grid = new fabric.Group(lines, {left:0, top:0, excludeFromExport: true, selectable: false, evented: false})
            grid.name = "grid"
            
            this.canvas.add(grid)
            this.canvas.grid = {
                show: true,
                size: gridSize
            }

            grid.sendToBack()

            if (!noUpdate) this.canvasChanged()
        },

        removeGrid() {
            let grid = this.canvas.getObjects().filter(o => o.name === "grid")
            if (grid.length === 0) return
            
            this.canvas.remove(grid[0])
            
            this.canvas.grid.show = false
            this.canvasChanged()

        },

        clearCanvas() {
            this.canvas.clear()
            this.removeGrid()
            this.$el.querySelector('#gridCheckbox').checked = false
            
            this.$nextTick(() => {
                this.canvas.backgroundColor = "#FFFFFF"
                this.canvas.renderAll()
            } )
            this.canvasBackgroundColor = "whiteColor"
            this.canvasChanged()
        },

        exportCanvas() {
            console.log("DOWNLOAD CANVAS //TODO")
        }


    },

    watch: {
        cardRect: {
            deep: true,
            handler(n) {
                this.canvas.setHeight(n.height)
                this.canvas.setWidth(n.width)
                if (this.canvas.grid) this.drawGrid(this.canvas.grid ? this.canvas.grid.size : 10)
                // this.drawGrid()
            }
        },
    },
    
}
</script>

<style scoped>

.whiteboard {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    position: relative;
}

.toolbar {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    position: absolute;
    bottom: 5px;
    overflow: hidden;
    border-radius: 10px;
    transition: transform 0.5s ease-in-out;
    /* justify-content: ; */
    /* transform: translateY(60px); */
}

.toolbar:hover {
    /* max-height: 500px; */
    /* transform: none; */
}

.toolbar-secondary {
    /* height: 30px; */
    /* width: 200px; */
    /* width: 80%; */
    border-radius: 20px;
    background-color: rgba(0, 0, 0, 0.30);
    display: flex;
    flex-direction: row;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 5px;
    padding-bottom: 5px;
    overflow: hidden;
    flex: 1;
    backdrop-filter: blur(8px);

}

.toolbar-primary {
    display: flex;
    flex-direction: row;
    /* align-items: flex-end; */
    background-color: rgba(0, 0, 0, 0.30);
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    justify-content: center;
    border-radius: 100px;
    margin-top: 5px;
    /* overflow: hidden; */
    position: relative;
    /* flex: 0 0 auto; */
    padding: 0;
    max-height: 10px;
    transition: all 0.5s;
}

.toolbar-primary:hover {
    max-height: 100px;
    padding-left: 5px;
    padding-right: 5px;
    padding-top: 5px;
    padding-bottom: 5px;
}

.toolbar-primary > * {
    opacity: 0;
    transition: all 0.5s;
}

.toolbar-primary:hover > * {
    opacity: 1;
}


.canvas-container {
    flex: 1;
    border-radius: 10px;
    overflow: hidden;
    width: 100%;
    /* background-color: white; */
}

.canvas {
    height: 100%;
    width: 100%;
    /* background-color: white; */

}




.tool-button-common {
    text-decoration: none;
    user-select: none;
    background-color: white;
    border-radius: 80px;
    padding-left: 10px;
    padding-right: 10px;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.25),
                inset 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
    /* margin-left: 5px; */
    transition: background-color 0.25s,
                box-shadow 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 30px;
    width: 50px;
    margin-left: 5px;
    margin-right: 5px;
    cursor: pointer;
    /* border: 1px black solid; */

}

.tool-button-commond:hover {
    box-shadow: 0 0 0pt 2pt lightgreen;
}

.pen-tool-button img {
    height: 20px;
}

.shape-tool-button img {
    height: 25px;
}

.select-tool-button {
    padding-right: 5px;
    padding-top: 3px;
}

.select-tool-button img {
    height: 23px;
}

.text-tool-button img {
    height: 20px;
}

.eraser-tool-button img {
    height: 24px;
}

.settings-tool-button img {
    height: 25px;
}


.pen-tool {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.pen-tool-options {
    height: 100%;
}



.shape-selector {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.shape-button-common {
    text-decoration: none;
    user-select: none;
    background-color: white;
    border-radius: 8px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.25),
                inset 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
    /* margin-left: 5px; */
    transition: background-color 0.25s,
                box-shadow 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    /* min-height: 30px; */
    /* width: 40px; */
    margin-left: 5px;
    margin-right: 5px;
    cursor: pointer;
}

.shape-button-common img {
    height: 16px;
}

.shape-tool-options {
    display: flex;
    flex-direction: row;
}

.shape-selector {
    /* padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 5px;
    padding-right: 5px; */
    /* margin-left: 10px; */
}

.toolbar-secondary-vertical-spacer {
    width: 3px;
    /* height: 40px; */
    margin-left: 10px;
    margin-right: 10px;
    background-color: lightgray;
}
.toolbar-secondary-horizontal-spacer {
    height: 3px;
    /* height: 40px; */
    margin-top: 5px;
    margin-bottom: 5px;
    background-color: lightgray;
}

.shape-fill-selector {
    display: flex;
    flex-direction: row;
}

.settings-header-text {
    font-size: 18px;
    color: white;
}

.settings-button-export {
    padding-left: 35px;
    padding-right: 35px;
}

.settings-button-clear {
    background-color: rgb(255, 91, 91);
    padding-left: 35px;
    padding-right: 35px;
}

.settings-button-clear:hover {
    box-shadow: 0 0 0pt 2pt rgb(248, 26, 26);

}

.settings-misc {
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    margin-bottom: 10px;
}

</style>