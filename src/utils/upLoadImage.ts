import { fabric } from "fabric";

export const uploadImageHandler = (
  fabricCanvas: fabric.Canvas,
  inputElOnchange: React.ChangeEvent<HTMLInputElement>
) => {
  console.log("uploadImageHandler");
  console.log(inputElOnchange);
  const reader = new FileReader();
  reader.onload = (e) => {
    if (typeof e.target.result !== "string") return;
    const imgBaseurl = e.target.result;
    fabric.Image.fromURL(imgBaseurl, (img) => {
      // the scaleToHeight property is use to set the image height
      img.scaleToHeight(250);
      // scaleToWidth is use to set the image width
      img.scaleToWidth(250);
      img.on("moving", function (e) {
        const obj = e.transform?.target;
        if (!obj || !obj.width || !obj.height || !obj.left || !obj.top) return;

        // 獲取物件 scale 的比例
        const scaleX = obj.scaleX;
        const scaleY = obj.scaleY;

        if (!scaleX || !scaleY) return;
        const maxX = fabricCanvas.width - obj.width * scaleX;
        const MaxyY = fabricCanvas.height - obj.height * scaleY;

        obj.set({
          left: Math.min(maxX, Math.max(0, obj.left)),
          top: Math.min(MaxyY, Math.max(0, obj.top)),
        });

        obj.setCoords();
      });
      const currentCanvasObjLen = fabricCanvas.getObjects().length;
      img.set({
        name: `Image-${currentCanvasObjLen}`,
      });
      fabricCanvas.add(img);
      fabricCanvas.setActiveObject(img);
    });
  };
  reader.readAsDataURL(inputElOnchange.target.files[0]);
};
