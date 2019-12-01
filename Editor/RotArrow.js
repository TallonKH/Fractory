const arrowLength = 25;

class RotArrow extends VPObject {
    constructor(node, inverted, {} = {}) {
        super({
            "mouseListening": true,
            "zOrder": 8
        });
        this.node = node;
        this.inverted = inverted;
        this.endpoint;
        this.recalcEndpoint();
    }

    isMouseBlockingOverlap(vp) {
        return true;
    }

    isMouseBlockingPress(vp) {
        return true;
    }


    recalcEndpoint() {
        this.endpoint = this.node.position.add2(
            Math.sin(this.node.rotation) * arrowLength * (this.inverted ? -0.75 : 1),
            Math.cos(this.node.rotation) * arrowLength * (this.inverted ? -0.75 : 1)
        )
    }

    isOverlapping(point) {
        return this.endpoint.subtractp(point).lengthSquared() < Math.pow(this.size, 2);
    }

    onMouseEntered(vp) {
        super.onMouseEntered(vp);
        vp.suggestCursor("grab");
    }

    onMouseExited(vp) {
        super.onMouseExited(vp);
        vp.unsuggestCursor("grab");
    }

    onDragStarted(vp) {
        super.onDragStarted(vp);
        vp.suggestCursor("grabbing");
    };

    onDragEnded(vp) {
        super.onDragEnded(vp);
        vp.unsuggestCursor("grabbing");
    };

    draw(vp, ctx) {
        const rotation = this.node.rotation;
        const tipLength = arrowLength * 0.5;
        const rotCW = rotation + Math.PI * 0.75;
        const tipCW = this.endpoint.add2(
            Math.sin(rotCW) * tipLength,
            Math.cos(rotCW) * tipLength
        )
        const rotCCW = rotation - Math.PI * 0.75;
        const tipCCW = this.endpoint.add2(
            Math.sin(rotCCW) * tipLength,
            Math.cos(rotCCW) * tipLength
        )

        ctx.lineCap = "round";
        ctx.strokeStyle = vp.backgroundColor;
        ctx.lineWidth = 12 * vp.zoomFactor;
        this.strokeLine(vp, ctx, this.node.position, this.endpoint);
        this.strokeLine(vp, ctx, this.endpoint, tipCW);
        this.strokeLine(vp, ctx, this.endpoint, tipCCW);

        ctx.strokeStyle = this.inverted ? IVPNode.nodeStateColors[1] : IVPNode.nodeStateColors[2];
        ctx.lineWidth = 6 * vp.zoomFactor;
        // this.strokeLine(vp, ctx, this.node.position, this.endpoint);
        this.strokeLine(vp, ctx, this.endpoint, tipCW);
        this.strokeLine(vp, ctx, this.endpoint, tipCCW);
    }
}