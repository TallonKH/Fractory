class ResultShape extends VPObject {
    constructor(vp, partEditor, depth = 4, {} = {}) {
        super(vp, {
            "mouseListening": false,
            "zOrder": 8
        });
        this.partEditor = partEditor;
        this.nodeLists = partEditor.separateNodes();
        this.maxDepth = 5;
        this.lines = [];
    }

    isOverlapping(point) {
        return false;
    }

    isMouseBlocking(self) {
        return true;
    }

    recalc() {
        this.lines = [];
        this.calcPart(new NPoint(), 0, 1, this.maxDepth);
        // console.log(currentTimeMillis());
    }

    draw(ctx) {
        ctx.lineCap = "round";
        for (const line of this.lines) {
            ctx.lineWidth = line.width * this.vp.zoomFactor;
            ctx.strokeStyle = line.color;
            this.strokeLine(ctx, line.posA, line.posB);
        }
    }

    calcPart(srcPos, srcRot, srcScale, depthCounter) {
        if (depthCounter <= 0) {
            return;
        }

        const a = colorLerp(this.vp.colors[1], this.vp.colors[2], depthCounter / this.maxDepth);
        const b = colorLerp(this.vp.colors[3], this.vp.colors[4], depthCounter / this.maxDepth);
        const color = colorLerp(a, b, Math.cos(srcRot / 3) / 2 + 0.5);
        const width = this.vp.lineWidth(depthCounter / this.maxDepth);

        for (const rootNode of this.nodeLists[1]) {
            const rott = srcRot + rootNode.rotation;
            const scal = srcScale / rootNode.scale;
            for (const seg of this.partEditor.links) {
                let posA = seg.nodeA.dPosition.subtractp(rootNode.dPosition).rotate(rott).multiply1(scal).addp(srcPos);
                let posB = seg.nodeB.dPosition.subtractp(rootNode.dPosition).rotate(rott).multiply1(scal).addp(srcPos);
                const line = {
                    "color": color,
                    "posA": posA.multiply1(100),
                    "posB": posB.multiply1(100),
                    "width": width
                }
                this.lines.push(line);
            }
            for (const branchNode of this.nodeLists[2]) {
                const posR = branchNode.dPosition.subtractp(rootNode.dPosition).rotate(rott).multiply1(scal).addp(srcPos);
                this.calcPart(posR, rott - branchNode.rotation, scal * branchNode.scale, depthCounter - 1);
            }
        }
    }

    // drawPart(vp, ctx, rootNode, node, drawnLinks, drawnNodes, srcPos, srcRot, srcScale, depthCounter) {
    //     if (depthCounter <= 0) {
    //         return;
    //     }
    //     ctx.lineCap = "round";
    //     drawnNodes.add(rootNode);
    //     for (const seg of node.links) {
    //         if (!drawnLinks.has(seg)) {
    //             drawnLinks.add(seg);
    //             let otherNode = (seg.nodeA == node) ? seg.nodeB : seg.nodeA;

    //             let posA = node.dPosition.subtractp(rootNode.dPosition).multiply1(srcScale).addp(srcPos);
    //             let posB = otherNode.dPosition.subtractp(rootNode.dPosition).multiply1(srcScale).addp(srcPos);
    //             ctx.strokeStyle = "black";
    //             ctx.lineWidth = 5 * vp.zoomFactor;
    //             this.strokeLine(vp, ctx, posA.multiply1(100), posB.multiply1(100));
    //             if (!drawnNodes.has(otherNode)) {
    //                 this.drawPart(vp, ctx, rootNode, otherNode, drawnLinks, drawnNodes, srcPos, srcRot, srcScale, depthCounter);
    //                 if (otherNode.nodeState == 2) {
    //                     this.drawPart(vp, ctx, rootNode, rootNode, new Set(), new Set(), posB, otherNode.rotation, srcScale * otherNode.scale, depthCounter - 1);
    //                 }
    //             }
    //         }
    //     }
    // }
}
IVPNode.nodeStates = ["Plain", "Root", "Branch", "Both"]