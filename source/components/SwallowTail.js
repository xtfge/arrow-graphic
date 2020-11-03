import Component from './Component.js'
import defaultValue from '../defaultValue.js';
import Util from '../PlotUtil.js'
import ComponentType from './ComponentType.js'
class HalfSwallowTail extends Component {
  /**
   * [constructor description]
   * @param {Object} [options={}] [description]
   * @param {Number} [options.heightFactor] 尾部高度占总高度的比例
   */
  constructor(options = {}) {
    super(options);
    this._type = ComponentType.HALF_SWALLOW_TRAIL;
    this._controlPointsCount = [3, Infinity];
    this._heightFactor = defaultValue(options.heightFactor, 0.3);
    this.createNodes();
  }

  /**
   * 尾部高度因了
   * @return {Number} 尾部高度占总高度的比例
   */
  get heightFactor() {
    return this._heightFactor;
  }
  createNodes() {
    super.createNodes();
    const baseLength = Util.baseLength(this.controls);
    const height = this._heightFactor * baseLength;
    const mid = Util.mid(this.get(0), this.get(1));
    const headControl = Util.thirdPoint(this.get(2), mid, 0, height, this.inverse);
    this.nodes = [headControl];
    return this.nodes;
  }
}

export default HalfSwallowTail;
