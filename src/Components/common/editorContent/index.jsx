import React, { useEffect } from "react";
import SmallContainer from "src/Container/SmallContainer";
import classes from "./styles.module.css";

export default function EditorContent({ content, type, ...props }) {
  useEffect(() => {
    const embeds = document.querySelectorAll(".__se__tag__embed_placeholder");
    embeds.forEach((embed) => {
      embed.innerHTML = decodeURI(embed.dataset.embed);
    });
  }, []);

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
