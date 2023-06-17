import React from "react";
import { IButtonProps } from "./index.config";

const Button = ({ buttonLabel, handlerFunction }: IButtonProps) => {
  return <button onClick={handlerFunction}>{buttonLabel}</button>;
};
export default Button;
