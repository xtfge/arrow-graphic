import ComponentType from './ComponentType.js'
class Component {
  constructor(options = {}) {
    this._controls = options.controls || [];
    this._index = options.index;
    this._inverse = options.inverse || false;
    if (!this._index) {
      const count = this._controls.length;
      this._index = new Array(count);
      for (let i = 0; i < count; i++) {
        this._index[i] = i;
      }
    }
  }

  /**
   * 描述箭头的控制点个数，数组第一个值为最小个数，控制点小于最小值将无法创建箭头，
   * 数组第二个值表示最大控制点个数，大于最大值的控制点将被抛弃
   * @return {Point[]} 控制点个数
   */
  get controls() {
    return this._controls;
  }

  /**
   * 生成组件时输入顶点的索引
   * @return {Number[]}
   */
  get index() {
    return this._index;
  }

  /**
   * 组件类型
   * @return {ComponentType}
   */
  get type() {
    return this._type;
  }

  get controlPointsCount() {
    return this._controlPointsCount;
  }

  get nodes() {
    return this._nodes;
  }
  set nodes(v) {
    this._nodes = v;
  }

  /**
   * 确定箭头在控制点连线的的左侧还是右侧，inverse为false是生成的图形在控制点连线的左侧
   * @return {Bool}
   */
  get inverse() {
    return this._inverse;
  }
  set inverse(v) {
    this._inverse = v;
  }

  createNodes() {
    ComponentType.getErrorMsg(this);
  }
  /**
   * 返回index指定的控制点
   * @param  {Number} index
   * @return {Number[]}
   */
  get(index) {
    if (this.index) {
      return this.controls[this.index[index]];
    }
    return this.controls[index]
  }
}
export default Component
