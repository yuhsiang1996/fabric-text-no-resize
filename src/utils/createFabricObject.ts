import { fabric } from "fabric";

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

  canvas.add(rect);
};
