import HalfArrowComponent from './HalfArrowComponent.js'
import ComponentType from './ComponentType.js'
class ArrowComponent extends HalfArrowComponent {
  /**
   * 箭头头部
   *
   * @param {Object} [options={}] 具有以下属性
   * @param {Number} [options.heightFactor=0.18] 箭头状况高度占整个图形高度(控制点连线长度)的百分比
   * @param {Number} [options.neckHeightFactor=0.85] 脖子占整个箭头的百分比
   * @param {Number} [options.widthFactor=0.3] 箭头宽度占高度的百分比
   * @param {Number} [options.neckWidthFactor=options.widthFactor/2] 脖子宽度占箭头高度的百分比
   */
  constructor(options = {}) {
    super(options);
    this._type = ComponentType.ARROW;
    this.createNodes();
  }
  createNodes() {
    const completedNodes = new Map();
    this._inverse = true;
    const rightHalf = super.createNodes();
    completedNodes.set(this.inverse, [...rightHalf]);
    this._inverse = false;
    const leftHalf = super.createNodes();
    completedNodes.set(this.inverse, [...leftHalf]);
    leftHalf.shift();
    rightHalf.shift();
    leftHalf.pop()
    this.inverse = undefined;
    this.completedNodes = completedNodes;
    this._nodes = [...leftHalf, ...(rightHalf.reverse())];
    return [...leftHalf, ...(rightHalf.reverse())];
  }
}

export default ArrowComponent
