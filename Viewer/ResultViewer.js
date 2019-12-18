var widthGen = gaussianGenerator(4, 4);
var widthGen2 = gaussianGenerator(2, 4);

class ResultViewer extends Viewport {
    constructor({} = {}) {
        super({
            "minZoomFactor": 0.25,
            "maxZoomFactor": 4,
            "pannable": true,
            "zoomSensitivity": 1,
            "panSensitivity": 0.5,
            "zoomCenter": "mouse"
        });
        this.allShapes = [];

        this.backgroundColor = "#1a1a1a"
        this.colors = ["#fc3d60", "#4dff7c", "#3d73fc", "#fca63d", "#1a1a1a"];
        this.lineWidth = _ => 2;
        this.linkedPartEditors;
    }

    keyPressed(code){
        const self = this;
        switch(code){
            case 32:
                requestColorPalette(function(colors){
                    console.log(colors);
                    self.colors = colors.map(a => rgbToHex(a[0], a[1], a[2]));
                    // self.backgroundColor = self.colors[0];
                    self.recalc();
                    const upper = clamp(widthGen(), 0.5, 16);
                    const lower = clamp(widthGen2(), 0.5, upper);
                    self.lineWidth = function(factor){
                        return lerp(upper, lower, factor);
                    }
                }, randomRgb());
                break;
        }
    }

    recalc(){
        for(const shape of this.allShapes){
            this.forget(shape);
        }
        this.allShapes = [];

        for (const partEditor of this.linkedPartEditors) {
            const shape = new ResultShape(this, partEditor);
            shape.recalc();
            this.registerObj(shape);
            this.allShapes.push(shape);
        }
    }
}