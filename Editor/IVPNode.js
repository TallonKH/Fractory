class IVPNode extends VPObject {
    constructor(dPosition, {} = {}) {
        super({
            "mouseListening": true,
            "zOrder": 10
        });

        this.dPosition = dPosition;
        this.rotators = [];
        this.rotation = 0; //Math.PI/8;
        this.nodeState = 0;
        this.scale = 0.5;
        this.links = new Set(); // set of NodeLinks
        this.color = "#888888";
    }

    static globalInit(vp) {
        vp.postMouseUpListeners["IVPU"] = function (vpp) {
            if (vpp.mouseLink) {
                console.log("====");
                console.log(vpp.mouseLink.nodeA);
                console.log(vpp.linkCandidate);
                if (vpp.linkCandidate) {
                    vpp.mouseLink.nodeB = vpp.linkCandidate;
                    vp.queueRedraw();
                } else {
                    vpp.forget(vpp.mouseLink);
                }
            }
            vpp.mouseLink = null;
            vpp.linkCandidate = null;
        }
    }

    draw(vp, ctx) {
        ctx.fillStyle = this.color;
        this.fillCircle(vp, ctx);
        if (this.mouseOverlapping) {
            ctx.lineWidth = 2 * vp.zoomFactor;
            ctx.strokeStyle = "#eeeeee"
            this.strokeCircle(vp, ctx);
        }
    }

    isMouseBlockingOverlap(vp) {
        return true;
    }

    isMouseBlockingPress(vp) {
        return true;
    }

    onDragStarted(vp) {
        super.onDragStarted(vp);
        vp.suggestCursor("crosshair");

        const link = new NodeLink(this, "mouse");
        vp.mouseLink = link;
        vp.registerObj(link);
    };

    onDragEnded(vp) {
        super.onDragEnded(vp);
        vp.unsuggestCursor("crosshair");
        console.log("asdf")
    };

    onMouseUp(vp) {
        super.onMouseUp(vp);
        vp.linkCandidate = this;
    }

    onMouseEntered(vp) {
        super.onMouseEntered(vp);
        vp.suggestCursor("pointer");
    }

    onMouseExited(vp) {
        super.onMouseExited(vp);
        vp.unsuggestCursor("pointer");
    }

    onClicked(vp) {
        super.onClicked(vp);
        this.nodeState = (this.nodeState + 1) % IVPNode.nodeStates.length;
        this.color = IVPNode.nodeStateColors[this.nodeState];

        for (const rotator of this.rotators) {
            vp.forget(rotator);
        }
        this.rotators = [];
        if (this.nodeState == 1 || this.nodeState == 2) {
            const rot = new RotArrow(this, this.nodeState == 1);
            this.rotators.push(rot);
            vp.registerObj(rot);
        } else if (this.nodeState == 3) {
            const rotP = new RotArrow(this, false);
            const rotN = new RotArrow(this, true);
            this.rotators.push(rotP);
            this.rotators.push(rotN);
            vp.registerObj(rotP);
            vp.registerObj(rotN);
        }
        vp.onNodeChanged(this);
    }
}

IVPNode.nodeStates = ["Plain", "Root", "Branch"]
IVPNode.nodeStateColors = ["#888888", "#f33f3f", "#0177e4", "#a517d9"]