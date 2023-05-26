import { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
// import htmlEditButton from "quill-html-edit-button";
//adding image resize functionality (mb in the future)
// import BlotFormatter from 'quill-blot-formatter';
// import BlotFormatter from "quill-blot-formatter/dist/BlotFormatter";

import "quill/dist/quill.snow.css"; // Add css for snow theme
import { postEditor } from "src/services/editor";
import { imageBaseUrl } from "src/utils/endpoint";

import classes from "./styles.module.css";

export default function Editor({
  lang,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  theme,
  style,
  className,
  readOnly,
  ...props
}) {
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ align: [] }],

      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],

      [{ header: [2, 3, 4, false] }],
      ["link", "image", "video"],
      [{ color: [] }, { background: [] }],
      ["code-block"],
      ["blockquote"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
    // htmlEditButton: {},
    // blotFormatter: {},
  };
  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "align",
    "list",
    "indent",
    "header",
    "link",
    "image",
    "video",
    "color",
    "background",
    "code-block",
    "blockquote",
    "clean",
  ];

  const { quill, quillRef, Quill, editor } = useQuill({
    theme: theme || "snow",
    scrollingContainer: "html",
    readOnly: readOnly || false,
    modules: modules,
    formats: formats,

    // modules: { blotFormatter: {} },
  });
  if (Quill && typeof window !== "undefined") {
    // Quill.register({
    //   "modules/table": function (quill, options) {
    //     console.log(quill, options);
    //   },
    // });
  }

  // Upload Image to Image Server such as AWS S3, Cloudinary, Cloud Storage, etc..

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const insertToEditor = (url) => {
      const range = quill.getSelection();
      quill.insertEmbed(range.index, "image", url);
    };
    const insertVideoToEditor = (url) => {
      const range = quill.getSelection();
      quill.insertEmbed(range.index, "video", url);
    };
    const saveToServer = async (file) => {
      const body = new FormData();
      const result = await postEditor(file);
      insertToEditor(imageBaseUrl + result.data);
    };
    const saveVideoToServer = async (file) => {
      const body = new FormData();
      const result = await postEditor(file);
      insertVideoToEditor(imageBaseUrl + result.data);
    };
    const selectLocalImage = () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      input.onchange = () => {
        const file = input.files[0];
        saveToServer(file);
      };
    };

    const selectLocalVideo = () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "video/*");
      input.click();

      input.onchange = () => {
        const file = input.files[0];
        saveVideoToServer(file);
      };
    };

    if (quill) {
      // Add custom handler for Image Upload
      quill.getModule("toolbar").addHandler("image", selectLocalImage);
      // quill.getModule("toolbar").addHandler("video", selectLocalVideo);
      if (value && counter === 0) {
        if (typeof value === "string") {
          // quill.setText(value);
          quill.root.innerHTML = value;
        } else if (Array.isArray(value)) {
          quill.setContents(value);
        }
      }
      quill.on("text-change", (delta, oldDelta, source) => {
        setCounter(counter + 1);
        onChange(quill.root.innerHTML);
        // console.log(quill.getText()); // Get text only
        // console.log(quill.getContents().ops); // Get delta contents
        // console.log(quill.root.innerHTML); // Get innerHTML using quill
        // console.log(quillRef.current.firstChild.innerHTML); // Get innerHTML using quillRef
      });
    }
  }, [quill, onChange, value]);

  return (
    <div
      className={className ? [classes[className], classes["editor"]].join(" ") : classes["editor"]}
      style={style}
    >
      <div ref={quillRef}></div>
    </div>
  );
}
