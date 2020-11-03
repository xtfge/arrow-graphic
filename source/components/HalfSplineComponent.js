import Component from './Component.js'
import defaultValue from '../defaultValue.js';
import Util from '../PlotUtil.js'
import ComponentType from './ComponentType.js'

class SplineComponent extends Component {
  /**
   * 样条曲线
   * @param {Object} options 具有以下属性
   * @param {Number} [options.headWidthFactor=0.1] 头部宽度占图形高度的比例
   * @param {Number} [options.tailWidthFactor=0.3] 尾部宽度占图形高度的比例
   */
  constructor(options) {
    super(options);
    this._type = ComponentType.HALF_SPLINE
    this._controlPointsCount = [2, Infinity]
    this._headWidthFactor = defaultValue(options.headWidthFactor, 0.1);
    this._tailWidthFactor = defaultValue(options.tailWidthFactor, 0.3);
    this.createNodes();

  }

  get tailWidthFactor() {
    return this._tailWidthFactor;
  }
  get headWidthFactor() {
    return this._headWidthFactor;
  }

  createNodes() {
    super.createNodes();
    const controls = this.controls;
    const length = Util.distance(...controls);
    const baseLength = Util.baseLength(controls);

    const tailWidth = this.tailWidthFactor * baseLength;
    const headWidth = this.headWidthFactor * baseLength;

    const offset = Math.abs(tailWidth - headWidth) / 2;

    let distance = 0
    const cts = controls;
    const u = [];
    for (let i = 1; i < controls.length - 1; i++) {
      let angle = Util.angleOfThreePoints(cts[i], cts[i - 1], cts[i + 1]) / 2;
      distance += Util.distance(cts[i - 1], cts[i]);
      if (!this.inverse) {
        angle = Math.PI - angle;
      }
      const tmpDis = (tailWidth / 2 - distance / length * offset) / Math.sin(angle);
      const point = Util.thirdPoint(cts[i - 1], cts[i], angle, tmpDis, this.inverse)
      u.push(point)
    }
    this.completedNodes = new Map();
    this.completedNodes.set(this.inverse, u);
    this.nodes = u;
    return u
  }

  linkArrow(options) {
    const {
      arrowNodes,
      bodyNodes,
      inverse,
      target
    } = options;
    const nodes = [];
    if (target._tail) {
      nodes.push(target.controls[+(!inverse)]);
    }
    if (inverse) {
      nodes.push(...bodyNodes, arrowNodes[0]);
      const spline = Util.quadricBSpline(nodes);
      return [...spline, ...arrowNodes]
    }
    nodes.push(...bodyNodes, arrowNodes[arrowNodes.length - 1]);
    const spline = Util.quadricBSpline(nodes);
    return [...arrowNodes, ...spline.reverse()]
  }
  linkTail(options = {}) {
    const {
      tailNodes,
      bodyNodes,
      inverse
    } = options
    return [...tailNodes, ...bodyNodes]
  }
}

export default SplineComponent;
