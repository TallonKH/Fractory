class IVPNode extends VPObject {
    constructor(vp, dPosition, {} = {}) {
        super(vp, {
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
            const candidateLink = vpp.mouseLink;
            if (candidateLink) {
                if (vpp.linkCandidate && vpp.linkCandidate != candidateLink.nodeA) {
                    candidateLink.nodeB = vpp.linkCandidate;
                    const code = candidateLink.recalcPairCode();
                    if (vpp.linkPairCodes.has(code)){
                        vpp.forget(candidateLink);
                    }else{
                        vpp.linkPairCodes.add(code);
                        vpp.links.add(candidateLink);
                        candidateLink.nodeA.links.add(candidateLink);
                        candidateLink.nodeB.links.add(candidateLink);
                        vpp.onLinkMade(candidateLink);
                        vpp.queueRedraw();
                    }
                } else {
                    vpp.forget(candidateLink);
                }
            }
            vpp.mouseLink = null;
            vpp.linkCandidate = null;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        this.fillCircle(ctx);
        if (this.mouseOverlapping) {
            ctx.lineWidth = 2 * this.vp.zoomFactor;
            ctx.strokeStyle = "#eeeeee"
            this.strokeCircle(ctx);
        }
    }

    isMouseBlockingOverlap() {
        return true;
    }

    isMouseBlockingPress() {
        return true;
    }

    onDragStarted() {
        super.onDragStarted();
        this.vp.suggestCursor("crosshair");

        const link = new NodeLink(this, "mouse");
        this.vp.mouseLink = link;
        this.vp.registerObj(link);
    };

    onDragEnded() {
        super.onDragEnded();
        this.vp.unsuggestCursor("crosshair");
    };

    onMouseUp() {
        super.onMouseUp();
        this.vp.linkCandidate = this;
    }

    onMouseEntered() {
        super.onMouseEntered();
        this.vp.suggestCursor("pointer");
    }

    onMouseExited() {
        super.onMouseExited();
        this.vp.unsuggestCursor("pointer");
    }

    onClicked() {
        super.onClicked();
        this.nodeState = (this.nodeState + 1) % IVPNode.nodeStates.length;
        this.color = IVPNode.nodeStateColors[this.nodeState];

        for (const rotator of this.rotators) {
            this.vp.forget(rotator);
        }
        this.rotators = [];
        if (this.nodeState == 1 || this.nodeState == 2) {
            const rot = new RotArrow(this, this.nodeState == 1);
            this.rotators.push(rot);
            this.vp.registerObj(rot);
        } else if (this.nodeState == 3) {
            const rotP = new RotArrow(this, false);
            const rotN = new RotArrow(this, true);
            this.rotators.push(rotP);
            this.rotators.push(rotN);
            this.vp.registerObj(rotP);
            this.vp.registerObj(rotN);
        }
        this.vp.onNodeChanged(this);
    }
}

IVPNode.nodeStates = ["Plain", "Root", "Branch"]
IVPNode.nodeStateColors = ["#888888", "#f33f3f", "#0177e4", "#a517d9"]