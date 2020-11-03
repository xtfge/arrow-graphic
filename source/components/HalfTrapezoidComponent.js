import Component from './Component.js';
import ComponentType from './ComponentType.js'
import Util from '../PlotUtil.js'
import defaultValue from '../defaultValue.js'
class HalfTrapezoidComponent extends Component {
  /**
   * 半梯形
   *    *** head control
   *   *  *
   *  *   *
   * *****x tail control
   * @param {[type]} options [description]
   * @param {Number} [options.heightFactor] 梯形高度高图形高度的百分比
   * @param {Number} [options.tailWidth=0.5] 梯形尾部宽度占高度的百分比
   * @param {Number} [options.headWidthFactor=0.3] 梯形头部宽度占高度的百分比
   */
  constructor(options) {
    super(options);
    this._type = ComponentType.HALF_TRAPEZOID;
    this._controlPointsCount = [2, 2];
    this._heightFactor = defaultValue(options.heightFactor, 0.82)
    this._tailWidthFactor = defaultValue(options.tailWidthFactor, 0.5);
    this._headWidthFactor = defaultValue(options.headWidthFactor, 0.3);
    this.createNodes();
  }

  /**
   * 梯形高度因子
   * @return {Number} 梯形高度高图形高度的百分比
   */
  get heightFactor() {
    return this._heightFactor;
  }

  /**
   * 梯形头部宽度因子
   * @return {Number} 梯形头部宽度占高度的百分比
   */
  get headWidthFactor() {
    return this._headWidthFactor;
  }

  /**
   * 梯形尾部宽度因子
   * @return {Number} 梯形尾部宽度占高度的百分比
   */
  get tailWidthFactor() {
    return this._tailWidthFactor;
  }

  createNodes() {
    super.createNodes();
    const tailControl = this.get(0);
    const baseLength = Util.baseLength(this._controls);
    const height = this.heightFactor * baseLength;
    const headControl = Util.thirdPoint(this.get(1), tailControl, 0, height, this.inverse);

    const tailWidth = this.tailWidthFactor * baseLength;
    const headWidth = this.headWidthFactor * baseLength;

    const leftHead = Util.thirdPoint(tailControl, headControl, Math.PI / 2, headWidth, this.inverse);
    const leftTail = Util.thirdPoint(headControl, tailControl, Math.PI / 2, tailWidth, !this.inverse);
    this._nodes = [leftHead, leftTail, tailControl, headControl].flat();
    this.completedNodes = new Map();
    this.completedNodes.set(this.inverse, [leftTail]);
    return [leftTail]
  }

  linkArrow(options) {
    const {
      arrowNodes,
      bodyNodes,
      inverse
    } = options;
    if (inverse) {
      return [...bodyNodes, ...arrowNodes]
    }
    return [...arrowNodes, ...bodyNodes]
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

export default HalfTrapezoidComponent;
