import React, { useEffect, useRef, useState } from "react";
import Button from "../Button";
import { fabric } from "fabric";
import classes from "./FabricCanvas.module.sass";
import { addRect } from "../../utils/createFabricObject";
import { removeObject, changeObjectColor } from "../../utils/editFabricObject";

const FabricCanvas = () => {
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas>(null);
  const [objcetColor, setObjcetColor] = useState<string>("#ffffff");
  // Initialize step or action remind text state
  const [actionText, setActionText] = useState({ text: "", left: 0, top: 0 });

  // Initialize a Fabric.js canvas and set it to the `fabricCanvas` state.
  useEffect(() => {
    // Create a new Fabric.js canvas
    const canvas = new fabric.Canvas(canvasRef.current);

    // 初始化Canvas的一些設定
    canvas.selectionColor = "rgba(255, 0, 0, 0.3)";
    // 選取物件的填充顏色
    canvas.selectionBorderColor = "red";
    // 選取物件的邊框顏色
    // 設定控制點的顏色為紅色
    fabric.Object.prototype.cornerColor = "red";
    // 設定控制點的大小（寬度和高度）
    fabric.Object.prototype.cornerSize = 10;
    // 設定控制點的樣式（"circle"、"rect" ）
    fabric.Object.prototype.cornerStyle = "rect";

    /**
     * 會在物件被縮放或移動時觸發，它會計算 `actionText` 文字的新位置並更新狀態
     * @param {fabric.IEvent} fabricCanvas -  Fabric.js的事件，提供觸發事件時的相關訊息
     * @param {number} setp - 代表當前的操作步驟，預設為1
     */

    const updateActionText = (e: fabric.IEvent, setp: number = 1) => {
      const target: fabric.Object = e.target;

      if (target) {
        const boundingRect = target.getBoundingRect(); // 獲取物件的邊界矩形，它包含了物件的位置和大小
        const transform = canvas.viewportTransform; // 獲取畫布的viewportTransform轉換矩陣，將物件的座標從物件空間轉換到畫布空間
        // 根據物件在畫布上的位置來更新 actionText 的位置。
        // 這樣，不論物件如何在畫布上移動或縮放，我們都能確保 actionText 會出現在正確的位置。
        setActionText({
          text: `Action ${setp}`, //表示當前的操作步驟
          left: boundingRect.left * transform[0] + transform[4], //
          top: boundingRect.top * transform[3] + transform[5], //
        });
      }
    };

    // 為縮放和移動事件設置事件監聽器
    canvas.on("object:scaling", (e) => updateActionText(e));
    canvas.on("object:moving", (e) => updateActionText(e));

    canvas.on("object:scaling", (e) => {
      // 獲取當前在縮放的物件
      const objects = e.target;

      // 判斷當前進行縮放動作的物件是否是（選取多個物件）
      if (objects.type === "activeSelection") {
        const activeSelection = objects as fabric.ActiveSelection;
        // 取得當前進行縮放動作的所有物件
        const activeSelectionObjects = activeSelection.getObjects();
        console.log(activeSelectionObjects);

        // 遍歷當前進行縮放動作的所有物件
        activeSelectionObjects.forEach((activeSelectionObject) => {
          // 判斷物件是否為群組物件
          if (activeSelectionObject.get("type") === "group") {
            console.log("group");
            const group: fabric.Group = activeSelectionObject as fabric.Group;
            group.getObjects().forEach((groupObj) => {
              // 假如物件的 name 是 "stepText" 利用當前縮放比例的倒數就還原縮放
              if (groupObj.get("name") === "stepText") {
                groupObj.scaleX = 1 / activeSelection.scaleX;
                groupObj.scaleY = 1 / activeSelection.scaleY;
              }
            });
          }

          // 假如物件的 name 是 "stepText" 利用當前縮放比例的倒數就還原縮放
          if (activeSelectionObject.get("name") === "stepText") {
            console.log(activeSelectionObject);
            activeSelectionObject.scaleX = 1 / activeSelection.scaleX;
            activeSelectionObject.scaleY = 1 / activeSelection.scaleY;
          }
        });

        // 判斷是否為群組物件
      } else if (objects.type === "group") {
        const group: fabric.Group = objects as fabric.Group;
        group.getObjects().forEach((groupObj) => {
          // 假如物件的 name 是 "stepText" 利用當前縮放比例的倒數就還原縮放
          if (groupObj.get("name") === "stepText") {
            groupObj.scaleX = 1 / group.scaleX;
            groupObj.scaleY = 1 / group.scaleY;
          }
        });
      } else {
        //為單一物件，假如物件的 name 是 "stepText"，直接設定物件的縮放比利恆為 1
        if (objects.get("name") === "stepText") {
          objects.scaleX = 1;
          objects.scaleY = 1;
        }
      }

      // 讓變化生效
      canvas.requestRenderAll();
    });

    const text = new fabric.Text("Content", {
      left: 100,
      top: 100,
      fontSize: 24,
      fill: "black",
      name: "stepText",
    });

    const OtherText = new fabric.Text("OtherText!", {
      left: 10,
      top: 100,
      fontSize: 24,
      fill: "black",
      name: "stepText",
    });

    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 200,
      height: 100,
      fill: "red",
    });

    const group = new fabric.Group([rect, text], {
      left: 200,
      top: 100,
    });

    canvas.add(group, OtherText);

    // Set the canvas to the `fabricCanvas` state
    setFabricCanvas(canvas);

    // --

    // Clean up the canvas on unmount
    return () => {
      canvas.dispose();
    };
  }, []);

  // Update the color of selected objects on the canvas when `objcetColor` changes.
  useEffect(() => {
    // Check if `fabricCanvas` is not null before calling `changeObjectColor` function
    if (fabricCanvas !== null) changeObjectColor(fabricCanvas, objcetColor);
  }, [objcetColor]);

  return (
    <div className={classes.Samplecanvas}>
      <Button
        buttonLabel="AddRect"
        handlerFunction={() => addRect(fabricCanvas, {})}
      />
      <Button
        buttonLabel="Remove"
        handlerFunction={() => removeObject(fabricCanvas)}
      />
      <input
        type="color"
        value={objcetColor}
        onChange={(e) => setObjcetColor(e.target.value)}
      />

      <div style={{ position: "relative" }}>
        {/* 畫布 */}
        <canvas width={1200} height={600} ref={canvasRef}></canvas>
        <div
          style={{
            position: "absolute",
            left: `${actionText.left}px`,
            top: `${actionText.top - 30}px`,
            fontSize: "24px",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
        >
          {actionText.text}
        </div>
      </div>
    </div>
  );
};

export default FabricCanvas;
