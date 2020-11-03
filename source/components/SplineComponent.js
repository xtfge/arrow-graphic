import HalfSplineComponent from './HalfSplineComponent.js'

class SplineComponent extends HalfSplineComponent {
  constructor(options = {}) {
    super(options);
  }
  createNodes() {
    const completedNodes = new Map();
    this.inverse = false;
    const leftNodes = super.createNodes();
    completedNodes.set(this.inverse, [...leftNodes]);
    this.inverse = true
    const rightNodes = super.createNodes();
    completedNodes.set(this.inverse, [...rightNodes]);
    this.inverse = undefined;
    this.nodes = [...leftNodes, ...(rightNodes.reverse())];
    this.completedNodes = completedNodes;
    return [...leftNodes, ...(rightNodes.reverse())]
  }
}

export default SplineComponent;
