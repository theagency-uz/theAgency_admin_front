import React, { useState } from "react";

import styled from "@emotion/styled";
import { Box, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

import classes from "./styles.module.css";

export default function FileUpload() {
  const [mediaFiles, setMediaFiles] = useState([]);

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const newMediaFiles = Array.from(files).map((file) => ({ file }));
      setMediaFiles((prevFiles) => [...prevFiles, ...newMediaFiles]);
    }
  };

  const handleDelete = (index) => {
    setMediaFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        {mediaFiles.map((media, index) => (
          <div key={index} className={classes.mailing_file_upload_wrapper}>
            {media.file.type.startsWith("image/") ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <img
                  className={classes.mailing_file_upload}
                  src={URL.createObjectURL(media.file)}
                  alt={`img-${index}`}
                />
                <Button onClick={() => handleDelete(index)} startIcon={<DeleteIcon />}>
                  Убрать
                </Button>
              </Box>
            ) : media.file.type.startsWith("video/") ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <video className={classes.mailing_file_upload} controls>
                  <source src={URL.createObjectURL(media.file)} type={media.file.type} />
                  Your browser does not support the video tag.
                </video>
                <Button onClick={() => handleDelete(index)} startIcon={<DeleteIcon />}>
                  Убрать
                </Button>
              </Box>
            ) : null}
          </div>
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          marginBottom: "20px",
        }}
      >
        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
          Загрузить фото или видео
          <VisuallyHiddenInput type="file" multiple onChange={handleFileChange} />
        </Button>
      </Box>
    </>
  );
}
