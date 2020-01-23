class PartEditor extends Viewport {
    constructor({} = {}) {
        super({
            "minZoomFactor": 0.25,
            "maxZoomFactor": 2,
            "pannable": true,
            "zoomSensitivity": 1,
            "panSensitivity": 0.5,
            "zoomCenter": "mouse"
        });

        // this.grabbedObj = null;
        // this.mouseLink = null;
        this.links = new Set();
        this.linkPairCodes = new Set();
        this.nodes = new Set();
        this.partChangeListeners = new Set();

        this.setupNodes();

        this.colorFunc = getRandColorFunc();
        this.widthFunc = getRandWidthFunc();

        this.background.color = "#1a1a1a";

        IVPNode.globalInit(this);
    }

    setupNodes() {
        const radius = 4;
        for (let ix = -radius; ix <= radius; ix++) {
            for (let iy = -radius; iy <= radius; iy++) {
                const node = new IVPNode(this, new NPoint(ix, iy));
                node.position = new NPoint(ix * 100, iy * 100);
                this.nodes.add(node);
                this.registerObj(node);
            }
        }
    }

    postOnMouseMove() {
        super.postOnMouseMove();
        this.queueRedraw();
        // console.log(this.mouseOverObjIds);
        // console.log(this.mouseOverObjIdsSorted);
    }

    separateNodes() {
        const result = [
            [],
            [],
            []
        ];
        for (const node of this.nodes) {
            if (node.nodeState == 3) {
                result[1].push(node);
                result[2].push(node);
            } else {
                result[node.nodeState].push(node);
            }
        }
        return result;
    }

    clearShape() {
        this.forgetAll()
        this.links = new Set();
        this.nodes = new Set();
        this.setupNodes();
        this.partChanged();
    }

    onNodeChanged(node) {
        this.partChanged();
    }

    onLinkMade(link) {
        this.partChanged();
    }

    onLinkDestroyed(link) {
        this.partChanged();
    }

    partChanged() {
        for (const func of this.partChangeListeners) {
            func();
        }
    }
}