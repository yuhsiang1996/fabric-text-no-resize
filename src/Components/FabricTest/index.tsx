import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import classes from "./FabricTest.module.sass";
import { addCircle, addArrow } from "../../utils/createFabricObject";
import Button from "../Button";
import {
  removeObject,
  changeObjectBorderColor,
} from "../../utils/editFabricObject";
import { uploadImageHandler } from "../../utils/upLoadImage";

const FabricTest = () => {
  const canvasRef = useRef(null);
  const [faricCanvas, setFaricCanvas] = useState<fabric.Canvas>(null);
  const [objcetColor, setObjcetColor] = useState<string>("#ffffff");
  const [objBorderInfo, setObjBorderInfo] = useState<{
    hasBorder: boolean;
    strokeWidth: number;
  }>({
    hasBorder: false,
    strokeWidth: 5,
  });
  const [selectedObj, setSelectedObj] = useState<fabric.Object | undefined>(
    undefined
  );
  const [layerList, setLayerList] = useState([]);

  const getCurrentSelectObjIndex = (_selectedObj: fabric.Object) => {
    if (_selectedObj && faricCanvas) {
      const objectsOnCanvas = faricCanvas.getObjects();
      const selectedIndex = objectsOnCanvas.findIndex(
        (obj) => obj.name === _selectedObj.name
      );
      return selectedIndex;
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLLIElement>,
    targetIndex: number
  ) => {
    e.preventDefault();

    if (faricCanvas && layerList.length > 0) {
      const draggedObjId = e.dataTransfer.getData("text/plain");
      const draggedObjIndex = layerList.findIndex(
        (obj) => obj.id === draggedObjId
      );

      if (draggedObjIndex !== -1) {
        // 移除被拖动的对象
        const updatedLayerList = [...layerList];
        const [draggedObj] = updatedLayerList.splice(draggedObjIndex, 1);

        // 在目标位置插入被拖动的对象
        updatedLayerList.splice(targetIndex, 0, draggedObj);

        // 更新 layerList
        setLayerList(updatedLayerList);

        // 清空 Canvas 中的对象
        faricCanvas.clear();

        // 重新添加按照新顺序的对象
        updatedLayerList.forEach((obj) => {
          const canvasObj = faricCanvas
            ?.getObjects()
            .find((canvasObj) => canvasObj.name === obj.id);
          if (canvasObj) {
            faricCanvas?.add(canvasObj);
          }
        });

        faricCanvas?.requestRenderAll();
      }
    }
  };

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      // backgroundColor: "#dcd6d6",
    });
    setFaricCanvas(canvas);

    canvas.on("selection:created", (selectedObgEvent) => {
      if (
        selectedObgEvent.selected &&
        selectedObgEvent.selected &&
        selectedObgEvent.selected[0].type
      ) {
        const selectedObjType = selectedObgEvent.selected[0].type;
        console.log("Selected Type : ", selectedObjType);
        if (selectedObjType === "image") {
          setSelectedObj(selectedObgEvent.selected[0]);
        }
      }
    });

    canvas.on("selection:updated", (selectedObgEvent) => {
      setSelectedObj(undefined);
      if (
        selectedObgEvent.selected &&
        selectedObgEvent.selected &&
        selectedObgEvent.selected[0].type
      ) {
        const selectedObjType = selectedObgEvent.selected[0].type;
        console.log("Selected Type : ", selectedObjType);
        if (selectedObjType === "image") {
          setSelectedObj(selectedObgEvent.selected[0]);
        }
      }
    });

    canvas.on("selection:cleared", (selectedObgEvent) => {
      setSelectedObj(undefined);
    });

    // 監聽物件新增事件
    canvas.on("object:added", function (options) {
      const addedObject = options.target;
      console.log("新增了一個物件:", addedObject);
      updateLayerList(canvas);
    });

    // 監聽物件新增事件
    canvas.on("object:removed", function (options) {
      const removedObject = options.target;
      console.log("刪除了一個物件:", removedObject);
      updateLayerList(canvas);
    });

    return () => {
      canvas.dispose();
    };
  }, []);

  // 更新圖層列表的函數
  const updateLayerList = (fabricCanvas: fabric.Canvas) => {
    // 獲取 Canvas 上的所有物件
    const objectsOnCanvas = fabricCanvas.getObjects();

    // 更新 React 狀態
    setLayerList(
      objectsOnCanvas.map((object, index) => ({
        id: index,
        name: object.name,
        zIndex: `${index}`,
      }))
    );
  };

  useEffect(() => {
    // Check if `faricCanvas` is not null before calling `changeObjectColor` function
    if (faricCanvas !== null) changeObjectBorderColor(faricCanvas, objcetColor);
  }, [objcetColor]);

  const handleCheckboxChange = () => {
    if (selectedObj) {
      objBorderInfo.hasBorder
        ? selectedObj.set({
            stroke: "", // 設置 border 的顏色
            strokeWidth: 0, // 設置 border 的寬度
          })
        : selectedObj.set({
            stroke: "#ff0000", // 設置 border 的顏色
            strokeWidth: 5, // 設置 border 的寬度
          });
      setObjBorderInfo((preVal) => ({
        ...preVal,
        hasBorder: !preVal.hasBorder,
      }));
      faricCanvas.renderAndReset();
    }
  };

  const handleBorderWidthChange = (borderWidth: string) => {
    if (selectedObj) {
      setObjBorderInfo((preVal) => ({
        ...preVal,
        strokeWidth: parseInt(borderWidth),
      }));
      selectedObj.set({ strokeWidth: parseInt(borderWidth) });
      faricCanvas.renderAndReset();
    }
  };

  const generatePictures = () => {
    if (faricCanvas) {
      const dataURL = faricCanvas.toDataURL();

      // 創建一個 a 元素，將 data URL 設置為 href 屬性
      const a = document.createElement("a");
      a.href = dataURL;

      // 設置下載的文件名
      a.download = "canvas_image.png";

      // 觸發點擊事件，開始下載
      a.click();
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.controlBar}>
        <div className={classes.buttonItem}>
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={(e) => uploadImageHandler(faricCanvas, e)}
            onClick={(e) => (e.currentTarget.value = null)}
          ></input>
        </div>
        <div className={classes.buttonItem}>
          <Button
            buttonLabel="AddCircle"
            handlerFunction={() => addCircle(faricCanvas, {})}
          />
        </div>
        <div className={classes.buttonItem}>
          <Button
            buttonLabel="AddArrow"
            handlerFunction={() => addArrow(faricCanvas)}
          />
        </div>

        <div className={classes.buttonItem}>
          <Button
            buttonLabel="Remove"
            handlerFunction={() => {
              removeObject(faricCanvas);
              if (faricCanvas) {
                const objectsOnCanvas = faricCanvas.getObjects();
                console.log("objectsOnCanvas", objectsOnCanvas);
                setLayerList(
                  objectsOnCanvas.map((object, index) => ({
                    id: index,
                    name: object.name,
                    zIndex: `${index}`,
                  }))
                );
              }
            }}
          />
        </div>
        <div className={classes.buttonItem}>
          <label>Border Color </label>
          <input
            type="color"
            value={objcetColor}
            onChange={(e) => setObjcetColor(e.target.value)}
          />
        </div>

        <div className={classes.buttonItem}>
          <Button
            buttonLabel="Generate pictures"
            handlerFunction={() => generatePictures()}
          />
        </div>
      </div>
      {selectedObj && (
        <div className={classes.controlBar}>
          <div className={classes.buttonItem}>
            <label>Has Border</label>
            <input
              type="checkbox"
              checked={objBorderInfo.hasBorder}
              onChange={handleCheckboxChange}
            />
          </div>
          <div className={classes.buttonItem}>
            <label>Border Width </label>
            <input
              type="number"
              value={objBorderInfo.strokeWidth}
              onChange={(e) => handleBorderWidthChange(e.target.value)}
            />
          </div>
        </div>
      )}
      <div className={classes.layoutControlBar}>
        <div className={classes.buttonItem}>
          <Button
            buttonLabel="選中的物件移到最前面"
            handlerFunction={() =>
              faricCanvas.bringToFront(faricCanvas.getActiveObject())
            }
          />
        </div>
        <div className={classes.buttonItem}>
          <Button
            buttonLabel="選中的物件移到最後面"
            handlerFunction={() =>
              faricCanvas.sendToBack(faricCanvas.getActiveObject())
            }
          />
        </div>
        <div className={classes.buttonItem}>
          <Button
            buttonLabel="選中的物件往前移動一層"
            handlerFunction={() =>
              faricCanvas.bringForward(faricCanvas.getActiveObject())
            }
          />
        </div>
        <div className={classes.buttonItem}>
          <Button
            buttonLabel="選中的物件往後移動一層"
            handlerFunction={() =>
              faricCanvas.sendBackwards(faricCanvas.getActiveObject())
            }
          />
        </div>
      </div>
      <div className={classes.canvasBlock}>
        <div className={classes.samplecanvas}>
          <canvas width={600} height={300} ref={canvasRef}></canvas>
        </div>
        <div className={classes.layoutListBlock}>
          <ul className={classes.layoutulstContent}>
            {layerList.map((item, index) => (
              <li
                draggable
                className={`${classes.layoutListItem} `}
                key={item.name}
              >{`${index} : ${item.name}`}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FabricTest;
