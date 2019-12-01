const arrowLength = 25;

class RotArrow extends VPObject {
    constructor(node, inverted, {} = {}) {
        super(node.vp, {
            "mouseListening": true,
            "zOrder": 8
        });
        this.node = node;
        this.inverted = inverted;
        this.endpoint;
        this.recalcEndpoint();
    }

    isMouseBlockingOverlap() {
        return true;
    }

    isMouseBlockingPress() {
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

    onMouseEntered() {
        super.onMouseEntered();
        this.vp.suggestCursor("grab");
    }

    onMouseExited() {
        super.onMouseExited();
        this.vp.unsuggestCursor("grab");
    }

    onDragStarted() {
        super.onDragStarted();
        this.vp.suggestCursor("grabbing");
    };

    onDragEnded() {
        super.onDragEnded();
        this.vp.unsuggestCursor("grabbing");
    };

    onDragged() {
        super.onDragged();
        let angle = -(this.vp.mousePos.subtractp(this.node.position).getAngle() + Math.PI / 2);
        if (!this.inverted) {
            angle = Math.PI + angle;
        }
        if (this.vp.ctrlDown) {
            angle = Math.round(angle / Math.PI * 24) / 24 * Math.PI;
        }
        this.node.rotation = angle;
        this.recalcEndpoint();
        this.vp.onNodeChanged(this.node);
    };

    draw(ctx) {
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
        ctx.strokeStyle = this.vp.backgroundColor;
        ctx.lineWidth = 12 * this.vp.zoomFactor;
        this.strokeLine(ctx, this.node.position, this.endpoint);
        this.strokeLine(ctx, this.endpoint, tipCW);
        this.strokeLine(ctx, this.endpoint, tipCCW);

        ctx.strokeStyle = this.inverted ? IVPNode.nodeStateColors[1] : IVPNode.nodeStateColors[2];
        ctx.lineWidth = 6 * this.vp.zoomFactor;
        // this.strokeLine(vp, ctx, this.node.position, this.endpoint);
        this.strokeLine(ctx, this.endpoint, tipCW);
        this.strokeLine(ctx, this.endpoint, tipCCW);
    }
}