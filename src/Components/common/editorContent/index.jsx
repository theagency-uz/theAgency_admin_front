import React from "react";
import SmallContainer from "src/Container/SmallContainer";
import classes from "./styles.module.css";

export default function EditorContent({ content, type, ...props }) {
  return (
    <SmallContainer style={{ backgroundColor: "#0f0f0f" }}>
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        className={`${classes.content} ${type === "modal" ? classes.modal : ""}`}
        {...props}
      ></div>
    </SmallContainer>
  );
}
