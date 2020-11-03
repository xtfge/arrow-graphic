import HalfTrapezoidComponent from './HalfTrapezoidComponent.js'
import ComponentType from './ComponentType.js'
class TrapezoidComponent extends HalfTrapezoidComponent {
  constructor(options = {}) {
    super(options);
    this._type = ComponentType.TRAPEZOID;
  }

  createNodes() {
    const completedNodes = new Map();
    this.inverse = false
    const right = super.createNodes();
    completedNodes.set(this.inverse, [...right])
    this.inverse = true;
    const left = super.createNodes();
    completedNodes.set(this.inverse, [...left]);
    this.completedNodes = completedNodes;
    this.inverse = undefined;
    this._nodes = left.concat(right)
    return this._nodes
  }
}

export default TrapezoidComponent
