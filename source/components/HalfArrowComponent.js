import Component from './Component.js';
import Util from '../PlotUtil.js'
import ComponentType from './ComponentType.js'
import defaultValue from '../defaultValue.js'

class HalfArrowComponent extends Component {
  /**
   * 半箭头头部
   *           *-----------------------------
   *          **             |              |
   *         * *             |              |
   *        *  *           neck height  arrow height
   *       *   *             |              |
   *      *    *             |              |
   *     *     *             |              |
   *    *   ***x（neck control）--------------              |
   *   *  *                                 |
   *  *--------x(tail control)-----------------------------
   *
   *
   *
   * @param {Object} [options={}] 具有以下属性
   * @param {Number} [options.heightFactor=0.18] 箭头状况高度占整个图形高度(控制点连线长度)的百分比
   * @param {Number} [options.neckHeightFactor=0.15] 脖子占整个整个图形高度的百分比
   * @param {Number} [options.widthFactor=0.3] 箭头宽度占高度的百分比
   * @param {Number} [options.neckWidthFactor=options.widthFactor/2] 脖子宽度占箭头高度的百分比
   * @param {Number} [options.inverse=false] inverse为false是生成的图形在控制点连线的右侧
   */
  constructor(options = {}) {
    super(options);
    this._controlPointsCount = [2, 2];
    this._type = ComponentType.HALF_ARROW;

    this._heightFactor = defaultValue(options.heightFactor, 0.18)
    this._neckHeightFactor = defaultValue(options.neckHeightFactor, 0.15);
    this._headWidthFactor = defaultValue(options.headWidthFactor, 0.5);
    this._neckWidthFactor = defaultValue(options.neckWidthFactor, 0.3)
    this._headMaxHeight = options.headMaxHeight;
    this._headTailHeightFactor = defaultValue(options.headTailHeightFactor, 0.3)
    this._inverse = defaultValue(options.inverse, false);
    this._nodes = []
    this.createNodes();
  }

  get headMaxHeight() {
    return this._headMaxHeight;
  }

  /**
   * 箭头高度因子
   * @return {Number} 箭头高度占整个图形高度的百分比
   */
  get heightFactor() {
    return this._heightFactor;
  }

  /**
   * 脖子高度因子
   * @return {Number}
   */
  get neckHeightFactor() {
    return this._neckHeightFactor;
  }

  /**
   * 箭头宽度因子
   * @return {Number}
   */
  get headWidthFactor() {
    return this._headWidthFactor;
  }

  /**
   * 脖子宽度因子
   * @return {Number}
   */
  get neckWidthFactor() {
    return this._neckWidthFactor;
  }


  /**
   * 构成图形的顶点
   * @return {[type]}
   */
  get nodes() {
    return this._nodes;
  }

  /**
   * 生成构成图形的顶点
   * @return {Number[]} 生成构成图形的顶点
   */
  createNodes() {
    super.createNodes();
    const controls = this.controls;
    const baseLength = Util.baseLength([this.get(0), this.get(1)]);
    let height = this.heightFactor * baseLength;
    const distance = Util.distance(this.get(0), this.get(1));
    if (this.headMaxHeight && height > this.headMaxHeight) {
      height = this.headMaxHeight;
    }
    const neckHeight = this.neckHeightFactor * height

    const tailControl = Util.thirdPoint(this.get(0), this.get(1), 0, height);
    const neckControl = Util.thirdPoint(this.get(0), this.get(1), 0, neckHeight);

    const neckWidth = this.neckWidthFactor * height;
    const width = this.headWidthFactor * height

    const tail = Util.thirdPoint(this.get(1), tailControl, Math.PI / 2, width, this.inverse)
    const neck = Util.thirdPoint(this.get(1), neckControl, Math.PI / 2, neckWidth, this.inverse);

    this.neck = neck;
    this.tail = tail;
    this.neckControl = neckControl;
    this.tailControl = tailControl;

    this._nodes = [neckControl, neck, tail, this.get(1)];
    this.completedNodes = new Map();
    this.completedNodes.set(this.inverse, [neckControl, neck, tail, this.get(1)])
    return this._nodes
  }

}
export default HalfArrowComponent
