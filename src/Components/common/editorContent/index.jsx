import React from "react";
import classes from "./styles.module.css";

export default function EditorContent({ content, ...props }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: content }} className={classes.content} {...props}></div>
  );
}
