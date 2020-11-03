import defaultValue from '../defaultValue.js';
import ArrowComponent from '../components/ArrowComponent.js'
import Body from '../components/SplineComponent.js'
import Arrow from './Arrow.js'
import Tail from '../components/SwallowTail.js'
import defineProperties from '../defineProperties.js'
import Util from '../PlotUtil.js'

class DoubleArrow extends Arrow {
  constructor(options) {
    options = defaultValue(options, {});
    options.neckHeightFactor = defaultValue(options.neckHeightFactor, 0.8);
    options.neckWidthFactor = defaultValue(options.neckWidthFactor, 0.2);
    options.headWidthFactor = defaultValue(options.headWidthFactor, 0.5);
    super(options);
    this._nodes = []
    this.init();
    defineProperties(this);
    this.merge()
  }

  static MIN_CONTROL_COUNT = 3;
  addControl(control) {
    this.controls.push(control)
    if (this.controls.length >= DoubleArrow.MIN_CONTROL_COUNT) {
      this.init();
      this.merge();
    }
  }
  popControl() {
    return this.controls.pop();
  }
  init() {
    if (this.controls.length < DoubleArrow.MIN_CONTROL_COUNT) {
      return;
    }
    this.getPoints()
  }
  tempPoint4(p1, p2, p3) {
    const mid = Util.mid(p1, p2);
    const distance = Util.distance(mid, p3);
    let angle = Util.angleOfThreePoints(p1, mid, p3);
    let x, y;
    let rst;
    if (angle < Math.PI / 2) {

    } else if (angle < Math.PI && angle >= Math.PI / 2) {
      angle = Math.PI - angle;
    } else if (angle >= Math.PI && angle < Math.PI * 1.5) {
      angle = angle - Math.PI;
    } else if (angle >= Math.PI * 1.5) {
      angle = Math.PI * 2 - angle;
    }
    x = distance * Math.cos(angle);
    y = distance * Math.sin(angle);
    const tmp = Util.thirdPoint(p1, mid, Math.PI / 2, x, true);
    rst = Util.thirdPoint(mid, tmp, Math.PI / 2, y, false);
    return rst;
  }
  getPoints() {
    let controls;
    const controls_ = this.controls;
    if (controls_ < 3) {
      return;
    }
    let tmp, connectPoint
    if (controls_.length === 3) {
      tmp = this.tempPoint4(...controls_)
    } else {
      tmp = controls_[3]
    }
    if (controls_.length <= 4) {
      connectPoint = Util.mid(controls_[0], controls_[1]);
    } else {
      connectPoint = controls_[4]
    }

    let head1, head2, bodyControls, radio
    if (Util.isClockWise(...this.controls.slice(0, 3))) {
      controls = this.getArrowControls(controls_[0], connectPoint, tmp, true);
      head1 = new ArrowComponent({
        controls,
        index: [2, 3],
        neckHeightFactor: this._neckHeightFactor,
        neckWidthFactor: this._neckWidthFactor,
        headWidthFactor: this._headWidthFactor
      })
      radio = Util.distance(controls_[0], connectPoint) / Util.baseLength(controls) / 2;
      bodyControls = this.getBodyControls(controls, head1.nodes[0], head1.nodes[4], radio);
      controls = this.getArrowControls(connectPoint, controls_[1], controls_[2], false)
      head2 = new ArrowComponent({
        controls,
        index: [2, 3],
        neckHeightFactor: this._neckHeightFactor,
        neckWidthFactor: this._neckWidthFactor,
        headWidthFactor: this._headWidthFactor
      })
      radio = Util.distance(connectPoint, controls_[1]) / Util.baseLength(controls) / 2;
      bodyControls.unshift(...(this.getBodyControls(controls, head2.nodes[0], head2.nodes[4], radio)));
      const bodyPoints = this.geoBodyPoints([head1, head2], bodyControls, connectPoint);
      this._nodes = [...bodyPoints[0], ...head1.nodes, ...bodyPoints[1], ...head2.nodes, ...bodyPoints[2]];
    } else {
      controls = this.getArrowControls(controls_[0], connectPoint, tmp, false);
      head1 = new ArrowComponent({
        controls,
        index: [2, 3],
        neckHeightFactor: this._neckHeightFactor,
        neckWidthFactor: this._neckWidthFactor,
        headWidthFactor: this._headWidthFactor
      })
      radio = Util.distance(controls_[0], connectPoint) / Util.baseLength(controls) / 2;
      bodyControls = this.getBodyControls(controls, head1.nodes[0], head1.nodes[4], radio);
      controls = this.getArrowControls(connectPoint, controls_[1], controls_[2], true);
      head2 = new ArrowComponent({
        controls,
        index: [2, 3],
        neckHeightFactor: this._neckHeightFactor,
        neckWidthFactor: this._neckWidthFactor,
        headWidthFactor: this._headWidthFactor
      })
      radio = Util.distance(connectPoint, controls_[1]) / Util.baseLength(controls) / 2;
      bodyControls.unshift(...(this.getBodyControls(controls, head2.nodes[0], head2.nodes[4], radio)));
      const bodyPoints = this.geoBodyPoints([head1, head2], bodyControls, connectPoint);
      this._nodes = [...bodyPoints[0], ...head1.nodes, ...bodyPoints[1], ...head2.nodes, ...bodyPoints[2]];
    }
  }
  getArrowControls(p1, p2, p3, inverse) { //t,o,e,r
    const mid = Util.mid(p1, p2);
    const distance = Util.distance(mid, p3);
    let neckControl = Util.thirdPoint(p3, mid, 0, 0.3 * distance, false);
    let headControl = Util.thirdPoint(p3, mid, 0, 0.5 * distance, false);
    neckControl = Util.thirdPoint(mid, neckControl, Math.PI / 2, distance / 5, inverse);
    headControl = Util.thirdPoint(mid, headControl, Math.PI / 2, distance / 4, inverse);
    return [mid, neckControl, headControl, p3];
  }
  geoBodyPoints(head, body, connect) {
    const body1 = Util.BezierCurve([this.controls[1], body[0], body[1], head[1].nodes[4]]);
    const body2 = Util.BezierCurve([this.controls[0], body[6], body[7], head[0].nodes[0]]);
    const body3 = Util.BezierCurve([head[0].nodes[4], body[5], body[4], connect, body[3], body[2], head[1].nodes[0]]);
    return [body2, body3, body1.reverse()];
  }
  getBodyControls(points, neckControl1, neckControl2, radio) { //t,o,e,r
    const length = Util.distance(...points);
    const baseLength = Util.baseLength(points);
    const width = baseLength * radio;
    const neckWidth = Util.distance(neckControl1, neckControl2);
    const offset = (width - neckWidth) / 2;
    let dis = 0;
    const u = [],
      c = [];
    for (let i = 1; i < points.length - 1; i++) {
      let angle = Util.angleOfThreePoints(points[i], points[i - 1], points[i + 1]) / 2;
      dis += Util.distance(points[i - 1], points[i]);
      const d = (width / 2 - dis / length * offset) / Math.sin(angle);
      u.push(Util.thirdPoint(points[i - 1], points[i], Math.PI - angle, d, false));
      c.push(Util.thirdPoint(points[i - 1], points[i], angle, d, true));
    }
    return u.concat(c);
  }
  merge() {
    this.polygon = [...this.nodes].flat();
    this.polyline = [...this.nodes].flat();
  }
}

export default DoubleArrow
