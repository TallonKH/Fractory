class ResultShape extends VPObject {
    constructor(partEditor, depth = 4, {} = {}) {
        super({
            "mouseListening": true,
            "zOrder": 8
        });
        this.partEditor = partEditor;
        this.nodeLists = partEditor.separateNodes();
    }

    isOverlapping(point) {
        return false;
    }

    isMouseBlocking(self) {
        return true;
    }

    draw(vp, ctx) {
        this.drawPart(vp, ctx, new NPoint(), 0, 1, 5);
        // this.drawPart(vp, ctx, this.rootNode, new Set(), new Set(), new NPoint(), 1, 1, 5);
    }

    drawPart(vp, ctx, srcPos, srcRot, srcScale, depthCounter) {
        if (depthCounter <= 0) {
            return;
        }
        ctx.lineCap = "round";
        for (const rootNode of this.nodeLists[1]) {
            for (const seg of this.partEditor.links) {
                let posA = seg.nodeA.dPosition.subtractp(rootNode.dPosition).rotate(srcRot).multiply1(srcScale).addp(srcPos);
                let posB = seg.nodeB.dPosition.subtractp(rootNode.dPosition).rotate(srcRot).multiply1(srcScale).addp(srcPos);
                ctx.strokeStyle = "#222222";
                ctx.lineWidth = 5 * vp.zoomFactor;
                this.strokeLine(vp, ctx, posA.multiply1(100), posB.multiply1(100));
            }
            for (const branchNode of this.nodeLists[2]) {
                const posR = branchNode.dPosition.subtractp(rootNode.dPosition).rotate(srcRot).multiply1(srcScale).addp(srcPos);
                this.drawPart(vp, ctx, posR, srcRot + branchNode.rotation, srcScale * branchNode.scale, depthCounter - 1);
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