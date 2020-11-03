import defaultValue from '../defaultValue.js';
import ArrowComponent from '../components/ArrowComponent.js'
import Body from '../components/SplineComponent.js'
import Arrow from './Arrow.js'
import Tail from '../components/SwallowTail.js'
import defineProperties from '../defineProperties.js'
import Util from '../PlotUtil.js'

class AttackArrow extends Arrow {
  constructor(options) {
    options = defaultValue(options, defaultValue.EMPTY_OBJECT);
    options.headHeightFactor = defaultValue(options.headHeightFactor, 0.15);
    options.neckHeightFactor = defaultValue(options.headWidthFactor, 0.8);
    options.neckWidthFactor = defaultValue(options.neckWidthFactor, 0.15);
    options.headWidthFactor = defaultValue(options.headWidthFactor, 0.4);
    options.tailWidthFactor = defaultValue(options.tailWidthFactor, 0.25)
    super(options);
    this._headTailHeightFactor = defaultValue(options.headTailHeightFactor, 0.5);
    this._tail = defaultValue(options.tail, true);
    this._heightFactor = defaultValue(options.heightFactor, 0.8)
    this._tailHeightFactor = defaultValue(options.tailHeightFactor, 0.15)
    this.init()

    defineProperties(this);
    this.merge();

  }
  static MIN_CONTROL_COUNT = 2;
  addControl(control) {
    this.controls.push(control)
    if (!this.tail && this.controls.length >= AttackArrow.MIN_CONTROL_COUNT || this.controls.length >= AttackArrow.MIN_CONTROL_COUNT + 1) {
      this.init();
      this.merge();
    }
  }
  popControl() {
    this.controls.pop();
  }
  init() {
    if (!this.tail && this.controls.length < AttackArrow.MIN_CONTROL_COUNT) {
      return;
    }
    if (this.tail && this.controls.length < AttackArrow.MIN_CONTROL_COUNT + 1) {
      return;
    }
    this._head1 = this.controls[0];
    this._head2 = this.controls[1];
    (this.tail && Util.isClockWise(this.controls[0], this.controls[1], this.controls[2])) &&
    ([this._head1, this._head2] = [this._head2, this._head1]);

    this._headComponent = this.createHeadComponent()
    this._bodyComponent = this.createBodyComponent();
    if (this._tail) {
      this._tailComponent = this.createTailComponent()
    }
  }
  createHeadComponent() {

    let controls, tailWidth;
    if (this.tail) {
      const mid = Util.mid(this._head1, this._head2);
      controls = [mid, ...(this.controls.slice(2))]
      tailWidth = Util.distance(this._head1, this._head2);
    } else {
      controls = this.controls;
    }
    const count = controls.length
    return new ArrowComponent({
      controls: controls,
      heightFactor: this._headHeightFactor,
      neckHeightFactor: this._neckHeightFactor,
      headWidthFactor: this._headWidthFactor,
      neckWidthFactor: this._neckWidthFactor,
      headMaxHeight: this._headTailHeightFactor * tailWidth,
      index: [count - 2, count - 1]
    })
  }
  createBodyComponent() {
    let mid, controls = this.controls.slice(2);
    const neckWidth = Util.distance(this._headComponent.nodes[0], this._headComponent.nodes[4]);
    const baseLength = Util.baseLength(controls);
    let tailWidth
    if (this._tail) {
      tailWidth = Util.distance(this.controls[0], this.controls[1]);
      mid = Util.mid(this._head1, this._head2);
      controls = [mid, ...controls]
      const baseLength = Util.baseLength(controls)
      this._tailWidthFactor = tailWidth / baseLength;
    } else {
      tailWidth = baseLength * this._tailWidthFactor;
      controls = this.controls;
    }
    const headWidthFactor = neckWidth / baseLength;
    return new Body({
      controls,
      headWidthFactor,
      tailWidthFactor: this._tailWidthFactor,

    })

  }
  createTailComponent() {
    if (!this._bodyComponent) {
      return
    }
    // const mid = Util.mid(this._head1, this._head2);
    const controls = this.controls
    return new Tail({
      controls,
      heightFactor: this._tailHeightFactor
    })
  }
}

export default AttackArrow;
