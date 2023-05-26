import simpleSvgPlaceholder from "@cloudfour/simple-svg-placeholder";
import { Box, Button } from "@mui/material";
import { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

import classes from "./styles.module.css";

import { imageBaseUrl } from "src/utils/endpoint";
import isObjectEmpty from "src/utils/isObjectEmpty";

export default function ImageUpload({ onChange, image: fetchedImage, title, sizes }) {
  const placeholder = simpleSvgPlaceholder({
    width: sizes?.width || 200,
    height: sizes?.height || 200,
  });
  useEffect(() => {
    if (fetchedImage?.file) {
      if (!isObjectEmpty(fetchedImage.file)) {
        setImage(URL.createObjectURL(fetchedImage.file));
      } else {
        setImage("");
      }
    } else {
      setImage(imageBaseUrl + fetchedImage);
    }
  }, [fetchedImage]);

  const [image, setImage] = useState("");

  const handleImageChange = (e) => {
    if (e) {
      if (e.target.files.length > 0) {
        onChange(e.target.files[0]);
      }
    } else {
      setImage("");
      onChange("");
    }
  };
  return (
    <div className={classes.imagePreviewWrapper}>
      <Button
        variant="contained"
        component="label"
        fullWidth
        sx={{ margin: "15px 0" }}
      >
        {title}
        <input type="file" name="image" hidden onChange={handleImageChange} />
      </Button>
      <Box>
        <Button
          onClick={() => {
            handleImageChange();
          }}
        >
          <DeleteIcon color="error" />
        </Button>
        <img
          src={image}
          alt="preview image"
          onError={({ currentTarget }) => {
            currentTarget.src = placeholder;
          }}
          className={classes.imagePreview}
        />
      </Box>
    </div>
  );
}
