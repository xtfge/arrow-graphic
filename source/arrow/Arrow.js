import defaultValue from '../defaultValue.js';
import Util from '../PlotUtil.js'
class Arrow {
  constructor(options) {
    this._headHeightFactor = defaultValue(options.headHeightFactor, 0.2)
    this._neckHeightFactor = defaultValue(options.neckHeightFactor, 0.8);
    this._headWidthFactor = defaultValue(options.headWidthFactor, 0.5);
    this._neckWidthFactor = defaultValue(options.neckWidthFactor, 0.3);
    this._tailWidthFactor = defaultValue(options.tailWidthFactor, 0.3)
    this._tailHeightFactor = defaultValue(options.tailHeightFactor, 0.20)
    this._controls = defaultValue(options.controls, [])
    this._headComponent = undefined;
    this._bodyComponent = undefined;
    this._tailComponent = undefined;
    this._nodes = undefined;

  }
  get controls() {
    return this._controls
  }

  /**
   * 几何图形做进一步处理
   * @return {Number[]}
   */
  postProcessing(pts) {
    return pts;
  }
  /**
   * 合并箭头的各个组件
   * @return {Number[]}
   */
  merge() {
    const head = this.headComponent;
    const body = this.bodyComponent;
    const tail = this.tailComponent;
    let headNodes, bodyNodes, tailNodes;

    body && (bodyNodes = body.completedNodes);


    let nodes = [];
    let tNode;
    if (bodyNodes && bodyNodes.get(true)) {
      tNode = bodyNodes.get(true)
      nodes = body.linkTail({
        tailNodes: nodes,
        bodyNodes: tNode
      })
    }
    if (head) {
      tNode = head.nodes;
      if (body) {
        nodes = body.linkArrow({
          arrowNodes: tNode,
          bodyNodes: nodes,
          inverse: true,
          target: this
        })
      } else {
        nodes = tNode;
      }
    }
    if (bodyNodes && bodyNodes.get(false)) {
      tNode = bodyNodes.get(false)
      nodes = body.linkArrow({
        arrowNodes: nodes,
        bodyNodes: tNode,
        inverse: false,
        target: this
      })
    }
    if (tail) {
      nodes.push(...tail.nodes);
    }
    this.polygon = nodes.flat()
    // nodes.shift();
    this.polyline = nodes.flat()
  }
  update() {
    this.createNodes();
  }
}

export default Arrow;
