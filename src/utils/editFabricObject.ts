import { fabric } from "fabric";

/**
 * Remove selected objects from a Fabric.js canvas.
 * @param {fabric.Canvas} fabricCanvas - The Fabric.js canvas object.
 */
export const removeObject = (fabricCanvas: fabric.Canvas) => {
  const selectedObjects = fabricCanvas.getActiveObjects();
  selectedObjects.forEach((object) => {
    fabricCanvas.remove(object);
  });
  fabricCanvas.discardActiveObject();
  fabricCanvas.renderAll();
};

/**
 * Change the fill color of selected objects in a Fabric.js canvas.
 * @param {fabric.Canvas} fabricCanvas - The Fabric.js canvas object.
 * @param {string} objectColor - The color to set for the selected objects.
 */
export const changeObjectColor = (
  fabricCanvas: fabric.Canvas,
  objectColor: string
) => {
  const selectedObjects = fabricCanvas.getActiveObjects();
  selectedObjects.forEach((object) => {
    object.set({ fill: objectColor });
    fabricCanvas.renderAll();
  });
};
