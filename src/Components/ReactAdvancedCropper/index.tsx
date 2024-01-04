import React, { useEffect, useRef, useState } from "react";
import {
  CropperRef,
  Cropper,
  CropperState,
  CropperImage,
  CropperTransitions,
  CropperPreview,
  CropperPreviewRef,
  ArbitraryProps,
} from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import classes from "./ReactAdvancedCropper.module.sass";

interface PreviewState {
  state: CropperState | null;
  image: CropperImage | null;
  transitions: CropperTransitions | null;
  loading?: boolean;
  loaded?: boolean;
}

const ReactAdvancedCropper = () => {
  const [originImg, setOriginImg] = useState<string | null>(null);
  const [previewState, setPreviewState] = useState<PreviewState>({
    state: null,
    image: null,
    transitions: null,
  });
  const previewRef = useRef<CropperPreviewRef>(null);
  const cropperRef = useRef<CropperRef>(null);

  const [cropedurl, setcropedUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [cropperAspectRatio, setCropperAspectRatio] = useState<number | null>(
    null
  );
  const imageBlockRef = useRef<HTMLDivElement>(null);
  const [stencilProps, setStencilProps] = useState<ArbitraryProps>({});

  const onChange = (cropper: CropperRef) => {
    // console.log(cropper.getCoordinates(), cropper.getCanvas());
    cropperRef.current?.getCanvas();
  };

  const onUpdate = (cropper: CropperRef) => {
    setPreviewState({
      state: cropper.getState(),
      image: cropper.getImage(),
      transitions: cropper.getTransitions(),
      loaded: cropper.isLoaded(),
      loading: cropper.isLoading(),
    });
  };

  const onCrop = () => {
    if (cropperRef.current) {
      const canvas = cropperRef.current?.getCanvas();

      canvas && setcropedUrl(canvas.toDataURL("image/jpeg", 1.0));
      const cropper: CropperRef = cropperRef.current;
      setPreviewState({
        state: cropper.getState(),
        image: cropper.getImage(),
        transitions: cropper.getTransitions(),
        loaded: cropper.isLoaded(),
        loading: cropper.isLoading(),
      });
    }
  };

  const uploadImageHandler = (
    inputElOnchange: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log("uploadImageHandler");
    // console.log(inputElOnchange);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target.result !== "string") return;
      const imgBaseurl = e.target.result;
      const img = new Image();

      setOriginImg(imgBaseurl);
      setShowModal(true);
    };
    reader.readAsDataURL(inputElOnchange.target.files[0]);
  };

  useEffect(() => {
    setStencilProps({
      aspectRatio:
        imageBlockRef.current.offsetWidth / imageBlockRef.current.offsetHeight,
      grid: true,
    });
  }, []);

  const stencilPropsHandler = () => {
    if (stencilProps) {
      const { aspectRatio } = stencilProps;
      aspectRatio
        ? setStencilProps({
            grid: true,
          })
        : setStencilProps({
            aspectRatio:
              imageBlockRef.current.offsetWidth /
              imageBlockRef.current.offsetHeight,
            grid: true,
          });
    }
  };

  const flip = (horizontal: boolean, vertical: boolean) => {
    if (cropperRef.current) {
      cropperRef.current.flipImage(horizontal, vertical);
    }
  };
  const rotate = (angle: number) => {
    if (cropperRef.current) {
      cropperRef.current.rotateImage(angle);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.imageBlockContainer} ref={imageBlockRef}>
        <CropperPreview
          ref={previewRef}
          className={classes.imageBlockCanvas}
          {...previewState}
        />
        {/* <img src={cropedurl} alt="" /> */}
        <input
          type="file"
          accept="image/jpeg, image/png"
          onChange={(e) => uploadImageHandler(e)}
          onClick={(e) => (e.currentTarget.value = null)}
        ></input>
      </div>

      {/* {cropedurl && (
        <div className={classes.preview}>
          <img src={cropedurl} alt="" />
        </div>
      )} */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              position: "relative",
            }}
          >
            <h2>裁切圖片</h2>
            <div className={classes.closeModalButtonContainer}>
              <button
                className={classes.closeModalButton}
                onClick={() => setShowModal(false)}
              >
                X
              </button>
            </div>
            {/* Add more content or components here */}
            <Cropper
              ref={cropperRef}
              className={classes.cropper}
              stencilProps={stencilProps}
              src={originImg}
              onChange={onChange}
              // onUpdate={onUpdate}
            />

            <div className={classes.imageControlButtonContainer}>
              <div className={classes.imageControlItem}>
                <button className={classes.imageControlButton} onClick={onCrop}>
                  裁切圖片
                </button>
              </div>

              <div className={classes.imageControlItem}>
                <button
                  className={classes.imageControlButton}
                  onClick={stencilPropsHandler}
                >
                  {stencilProps.aspectRatio
                    ? "取消鎖定比例"
                    : "鎖定 canvas 比例"}
                </button>
              </div>
              <div className={classes.imageControlItem}>
                <button
                  className={classes.imageControlButton}
                  onClick={() => flip(true, false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                  >
                    <path
                      fill="#FFF"
                      d="M8 15.9c-.6 0-1-.4-1-1V1c0-.6.4-1 1-1s1 .4 1 1v13.9c0 .6-.4 1-1 1zm4-2.4h-.5c-.4 0-.8-.3-.8-.8s.3-.8.8-.8h.5c.4 0 .8.3.8.8s-.4.8-.8.8zm2.7 0h-.5c-.4 0-.8-.3-.8-.8 0-.3.2-.6.5-.7.1-.3.4-.5.7-.5.4 0 .8.3.8.8v.5c.1.4-.3.7-.7.7zm0-2.8c-.4 0-.8-.3-.8-.8v-.8c0-.4.3-.8.8-.8s.8.3.8.8v.8c0 .4-.4.8-.8.8zm0-3.3c-.4 0-.8-.3-.8-.8v-.7c0-.4.3-.8.8-.8s.8.3.8.8v.8c0 .4-.4.7-.8.7zm0-3.3c-.3 0-.6-.2-.7-.5-.3-.1-.5-.4-.5-.7 0-.4.3-.8.8-.8h.5c.4 0 .8.3.8.8v.5c-.1.4-.5.7-.9.7zM12 3.6h-.5c-.4 0-.8-.3-.8-.8s.3-.8.8-.8h.5c.4 0 .8.3.8.8s-.4.8-.8.8zM4.5 13.5H1.3c-.4 0-.8-.3-.8-.8V2.9c0-.4.3-.8.8-.8h3.2v1.5H2V12h2.5v1.5z"
                    ></path>
                  </svg>
                </button>
              </div>
              <div className={classes.imageControlItem}>
                <button
                  className={classes.imageControlButton}
                  onClick={() => flip(false, true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                  >
                    <path
                      fill="#FFF"
                      d="M15 9H1c-.5 0-1-.5-1-1s.4-1 1-1h14c.6 0 1 .4 1 1s-.5 1-1 1zM3.1 12.7c-.4 0-.8-.3-.8-.8v-.5c0-.4.3-.8.8-.8s.8.3.8.8v.6c0 .4-.3.7-.8.7zM3.6 15.4h-.5c-.4 0-.8-.3-.8-.8v-.5c0-.4.3-.8.8-.8.3 0 .6.2.7.5.3.1.5.4.5.7.1.6-.2.9-.7.9zM10.1 15.4h-.8c-.4 0-.8-.3-.8-.8s.3-.8.8-.8h.8c.4 0 .8.3.8.8s-.4.8-.8.8zm-3.2 0H6c-.4 0-.8-.3-.8-.8s.3-.8.8-.8h.8c.4 0 .8.3.8.8s-.3.8-.7.8zM13 15.4h-.5c-.4 0-.8-.3-.8-.8 0-.3.2-.6.5-.7.1-.3.4-.5.7-.5.4 0 .8.3.8.8v.5c.1.4-.2.7-.7.7zM13 12.7c-.4 0-.8-.3-.8-.8v-.5c0-.4.3-.8.8-.8s.8.3.8.8v.6c0 .4-.3.7-.8.7z"
                    ></path>
                    <g>
                      <path
                        fill="#FFF"
                        d="M13.8 4.5h-1.5V2H3.9v2.5H2.4V1.3c0-.4.3-.8.8-.8H13c.4 0 .8.3.8.8v3.2z"
                      ></path>
                    </g>
                  </svg>
                </button>
              </div>
              <div className={classes.imageControlItem}>
                <button
                  className={classes.imageControlButton}
                  onClick={() => rotate(90)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                  >
                    <path
                      fill="#FFF"
                      d="M12.5 11.8c.2.2.2.6 0 .9-1.1 1.1-2.8 1.8-4.5 1.8-3.7 0-6.5-2.8-6.5-6.5s3-6.5 6.5-6.5c1.7 0 3.3.7 4.5 1.8l1-1c.4-.4 1-.1 1 .4v3.8c0 .3-.3.6-.6.6h-3.7c-.5 0-.8-.7-.4-1L11 4.9c-.9-.9-1.9-1.3-3-1.3-3 0-5.4 3.1-4 6.2.7 1.6 2.3 2.6 4 2.6 1.2 0 2.2-.4 3-1.3.2-.2.6-.2.8 0l.7.7z"
                    ></path>
                  </svg>
                </button>
              </div>
              <div className={classes.imageControlItem}>
                {" "}
                <button
                  className={classes.imageControlButton}
                  onClick={() => rotate(-90)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                  >
                    <path
                      fill="#FFF"
                      d="M3.5 11.8c-.2.2-.2.6 0 .9 1.1 1.1 2.8 1.8 4.5 1.8 3.7 0 6.5-2.8 6.5-6.5s-3-6.5-6.5-6.5c-1.7 0-3.3.7-4.5 1.8l-1-1c-.4-.4-1-.1-1 .4v3.8c0 .3.3.6.6.6h3.7c.5 0 .8-.7.4-1L5 4.9c.9-.9 1.9-1.3 3-1.3 3 0 5.4 3.1 4 6.2-.7 1.6-2.3 2.6-4 2.6-1.2 0-2.2-.4-3-1.3-.2-.2-.6-.2-.8 0l-.7.7z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReactAdvancedCropper;
