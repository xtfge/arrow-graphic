import defaultValue from '../defaultValue.js';
import ArrowComponent from '../components/ArrowComponent.js'
import Body from '../components/TrapezoidComponent.js'
import Arrow from './Arrow.js'
import Tail from '../components/SwallowTail.js'
import defineProperties from '../defineProperties.js'
import ComponentType from '../components/ComponentType.js';
class StraightArrow extends Arrow {
  /**
   * 直线箭头
   * @param {Object} [options={}] 具有以下属性
   * @param {Number} [options.headHeightFactor=0.18] 头部高度占箭头高度的比例
   * @param {Number} [options.neckHeightFactor=0.13] 脖子高度占箭头高度的比例
   * @param {Number} [options.headWidthFactor=0.2] 头部宽度占箭头高度的比例
   * @param {Number} [options=neckWidthFactor=options.neckHeightFactor/2] 脖子宽度占箭头高度的比例
   * @param {Number} [options.tailWidthFactor=0.3] 尾部宽度占箭头高度的比例
   * @param {Number} [options.tailHeightFactor=0.2] 尾部高度占箭头高度的比例
   */
  constructor(options = {}) {
    options = defaultValue(options, defaultValue.EMPTY_OBJECT);
    super(options);
    this._tail = defaultValue(options.tail, false);
    this.init();
    defineProperties(this)
    this.merge()
  }

  set tail(v) {
    this._tail = v;
  }
  static MIN_CONTROL_COUNT = 2;
  addControl(control) {
    if (this.controls.length >= StraightArrow.MIN_CONTROL_COUNT) {
      this.controls.pop();
    }
    this.controls.push(control)
    if (this.controls.length >= StraightArrow.MIN_CONTROL_COUNT) {
      this.init();
      this.merge();
    }
  }
  init() {
    if (this.controls.length < StraightArrow.MIN_CONTROL_COUNT) {
      return;
    }
    this._headComponent = this.createHeadComponent();
    this._bodyComponent = this.createBodyComponent();
    if (this._tail) {
      this._tailComponent = this.createTailComponent();
    }
  }
  update() {
    this._headComponent = this.createHeadComponent();
    this._bodyComponent = this.createBodyComponent();
    if (this._tail) {
      this._tailComponent = this.createTailComponent()
    }
    this.merge();
  }
  createBodyComponent() {
    return new Body({
      controls: this._controls,
      heightFactor: 1 - this._neckHeightFactor,
      headWidthFactor: this._neckWidthFactor,
      tailWidthFactor: this._tailWidthFactor
    })
  }

  createHeadComponent() {
    return new ArrowComponent({
      controls: this._controls,
      headWidthFactor: this._headWidthFactor,
      neckHeightFactor: this._neckHeightFactor,
      neckWidthFactor: this._neckWidthFactor,
      headHeightFactor: this._headHeightFactor
    })
  }
  createTailComponent() {
    if (!this._bodyComponent) {
      return
    }
    const bodyNodes = this._bodyComponent.nodes;
    return new Tail({
      controls: [
        ...bodyNodes, this._controls[1]
      ],
      heightFactor: this._tailHeightFactor
    })
  }
}

export default StraightArrow;
