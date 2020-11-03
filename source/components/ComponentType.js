/**
 * 箭头构件类型
 * @exports ComponentType
 * @enum {Number}
 */
const ComponentType = {
  /**
   * 箭头
   * @type {Number}
   * @constant
   */
  ARROW: 0,
  /**
   * 半箭头
   * @type {Number}
   * @constant
   */
  HALF_ARROW: 1,
  /**
   * 贝塞尔曲线
   * @type {Number}
   * @constant
   */
  BEZIER: 2,
  /**
   * 样条曲线
   * @type {Number}
   * @constant
   */
  SPLINE: 3,
  /**
   * 燕尾
   * @type {Number}
   * @constant
   */
  SWALLOW_TRAIL: 4,

  /**
   * 梯形
   * @type {Number}
   * @constant
   */
  TRAPEZOID: 5,

  /**
   * 半梯形
   * @type {Number}
   * @constant
   */
  HALF_TRAPEZOID: 6,
  HALF_SWALLOW_TRAIL: 7,
  HALF_SPLINE: 8
}
ComponentType.getLabel = function(component) {
  let label;
  switch (component.type) {
    case ComponentType.HALF_ARROW:
      label = 'HALF_ARROW'
      break;
    case ComponentType.ARROW:
      lebel = 'ARROW';
      break;
    case ComponentType.BEZIER:
      label = 'BEZIER';
      break;
    case ComponentType.SPLINE:
      label = "SPLINE";
      break;
    case ComponentType.SWALLOW_TRAIL:
      label = 'SWALLOW_TRAIL'
      break;
    case ComponentType.HALF_SWALLOW_TRAIL:
      label = 'HALF_SWALLOW_TRAIL'
      break
    case ComponentType.HALF_SPLINE:
      label = 'HALF_SPLINE';
      break;
    default:
      label = undefined;
  }
  return label
}
/**
 * function
 * @param  {[type]} type [description]
 * @return {[type]}      [description]
 */
ComponentType.getErrorMsg = function(component) {
  const type = component.type;
  const controls = component.controls.length;
  if (!ComponentType.validate(component)) {
    throw new Error(ComponentType.getLabel(component) + '控制点个数必须不少于' + component.controlPointsCount[0] + ",实际只有" + controls + '个');
  }
}
ComponentType.validate = function(component) {

  const controls = component.controls.length;
  if (controls < component.controlPointsCount[0]) {
    return false;
  }
  return true
}
export default ComponentType
