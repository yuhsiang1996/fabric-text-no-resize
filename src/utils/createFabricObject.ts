import { fabric } from "fabric";
declare module "fabric" {
  namespace fabric {
    class LineWithArrow extends fabric.Line {
      constructor(element: number[], options?: fabric.ILineOptions);
    }
  }
}

fabric.LineWithArrow = fabric.util.createClass(fabric.Line, {
  type: "LineWithArrow",
  objectCaching: false,

  hasBorders: false,

  arrowheadSize: 15, // 初始箭頭大小

  _getCacheCanvasDimensions() {
    let dim = this.callSuper("_getCacheCanvasDimensions");
    dim.width += this.arrowheadSize; // 調整寬度以容納箭頭
    dim.height += this.arrowheadSize; // 調整高度以容納箭頭
    return dim;
  },

  _render(ctx: CanvasRenderingContext2D) {
    this.callSuper("_render", ctx);
    ctx.save();

    const xDiff = this.x2 - this.x1;
    const yDiff = this.y2 - this.y1;
    const angle = Math.atan2(yDiff, xDiff);

    ctx.translate((this.x2 - this.x1) / 2, (this.y2 - this.y1) / 2);
    ctx.rotate(angle);

    ctx.beginPath();
    // Move 5px in front of line to start the arrow so it does not have the square line end showing in front (0,0)
    ctx.moveTo(this.arrowheadSize, 0);
    ctx.lineTo(-this.arrowheadSize, this.arrowheadSize);
    ctx.lineTo(-this.arrowheadSize, -this.arrowheadSize);
    ctx.closePath();

    ctx.fillStyle = this.stroke;
    ctx.fill();

    ctx.restore();
  },
});

/**
 * Add a rectangle to a Fabric.js canvas.
 * @param {fabric.Canvas} canvas - The Fabric.js canvas object.
 * @param {fabric.IRectOptions} options - The options for the rectangle.
 */
export const addRect = (
  canvas: fabric.Canvas,
  {
    top = 100,
    left = 100,
    width = 100,
    height = 100,
    fill = "#fafafa",
  }: fabric.IRectOptions
) => {
  const rect = new fabric.Rect({
    left: left,
    top: top,
    width: width,
    height: height,
    fill: fill,
  });

  rect.on("moving", function (e) {
    const obj = e.transform?.target;
    if (!obj || !obj.width || !obj.height || !obj.left || !obj.top) return;

    // 獲取物件 scale 的比例
    const scaleX = obj.scaleX;
    const scaleY = obj.scaleY;

    if (!scaleX || !scaleY) return;
    const maxX = canvas.width - obj.width * scaleX;
    const MaxyY = canvas.height - obj.height * scaleY;

    obj.set({
      left: Math.min(maxX, Math.max(0, obj.left)),
      top: Math.min(MaxyY, Math.max(0, obj.top)),
    });

    obj.setCoords();
  });

  canvas.add(rect);
  canvas.setActiveObject(rect);
};

/**
 * Add a rectangle to a Fabric.js canvas.
 * @param {fabric.Canvas} canvas - The Fabric.js canvas object.
 * @param {fabric.ICircleOptions} options - The options for the circle.
 */
export const addCircle = (
  canvas: fabric.Canvas,
  {
    radius = 100,
    stroke = "#ff0000",
    strokeWidth = 3,
    fill = "",
  }: fabric.ICircleOptions
) => {
  const circle = new fabric.Circle({
    radius: radius,
    stroke: stroke,
    strokeWidth: strokeWidth,
    fill: fill,
  });

  circle.on("moving", function (e) {
    const obj = e.transform?.target;
    if (!obj || !obj.width || !obj.height || !obj.left || !obj.top) return;

    // 獲取物件 scale 的比例
    const scaleX = obj.scaleX;
    const scaleY = obj.scaleY;

    if (!scaleX || !scaleY) return;
    const maxX = canvas.width - obj.width * scaleX;
    const MaxyY = canvas.height - obj.height * scaleY;

    obj.set({
      left: Math.min(maxX, Math.max(0, obj.left)),
      top: Math.min(MaxyY, Math.max(0, obj.top)),
    });

    obj.setCoords();
  });

  canvas.add(circle);
  canvas.setActiveObject(circle);
};

/**
 * Add a rectangle to a Fabric.js canvas.
 * @param {fabric.Canvas} canvas - The Fabric.js canvas object.
 */
export const addArrow = (canvas: fabric.Canvas) => {
  // 宣告一個 LineWithArrow 實例
  const LineWithArrowObj = new fabric.LineWithArrow([50, 50, 150, 50], {
    strokeWidth: 10,
    stroke: "#ff0000",
    padding: 10,
  });

  canvas.add(LineWithArrowObj);
};
