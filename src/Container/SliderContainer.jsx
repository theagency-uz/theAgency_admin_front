import React from "react";
import classes from "./styles.module.css";

export default function SliderContainer({ children, ...props }) {
  return (
    <div style={{background: "#fafafa"}}>
      <div className={classes.sliderContainer} {...props}>
        {children}
      </div>
    </div>
  );
}
