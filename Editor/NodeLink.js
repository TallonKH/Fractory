class NodeLink extends VPObject {
    constructor(nodeA, nodeB, {} = {}) {
        super({
            "mouseListening": true,
            "zOrder": 6
        });

        this.nodeA = nodeA;
        this.nodeB = nodeB;
    }

    draw(vp, ctx) {
        let posA = this.nodeA.position;
        let posB;
        switch (this.nodeB) {
            case "mouse":
                posB = vp.mousePos;
                break;
            default:
                posB = this.nodeB.position;
                break;
        }

        ctx.lineCap = "round";
        ctx.lineWidth = 8 * vp.zoomFactor;
        ctx.strokeStyle = "#666666"
        this.strokeLine(vp, ctx, posA, posB);
    };
}