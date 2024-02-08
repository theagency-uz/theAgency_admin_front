import React, { useState } from "react";
import styled from "@emotion/styled";
import { Box, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import classes from "./styles.module.css";
import mailings from "src/pages/mailings";

export default function FileUpload({ setFile, file, mailings }) {
  const [uploading, setUploading] = useState(false);

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

  const handleFileChange = async (event) => {
    const newFile = event.target.files[0];
    try {
      setUploading(true);
      newFile.type.startsWith("image/") ? setFile({ image: newFile }) : setFile({ video: newFile });
    } catch (error) {
      console.error("Error uploading media:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = () => {
    setFile();
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
        <div className={classes.mailing_file_upload_wrapper}>
          {file?.image ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <img
                className={classes.mailing_file_upload}
                src={
                  typeof file?.image == "string"
                    ? "http://192.168.0.132:5000/" + file?.image
                    : URL.createObjectURL(file?.image)
                }
                alt={`img-1`}
              />
              <Button onClick={handleDelete} startIcon={<DeleteIcon />}>
                Убрать
              </Button>
            </Box>
          ) : file?.video ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <video className={classes.mailing_file_upload} controls>
                <source
                  src={
                    typeof file?.video == "string"
                      ? "http://192.168.0.132:5000/" + file?.video
                      : URL.createObjectURL(file?.video)
                  }
                  type={file?.video?.type}
                />
                Your browser does not support the video tag.
              </video>
              <Button onClick={handleDelete} startIcon={<DeleteIcon />}>
                Убрать
              </Button>
            </Box>
          ) : (
            "нет фото или видео "
          )}
        </div>
      </Box>
      <Box
        sx={{
          display: "flex",
          marginBottom: "20px",
        }}
      >
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          disabled={uploading}
        >
          {uploading ? "Загрузка..." : "Загрузить фото или видео"}
          <VisuallyHiddenInput type="file" onChange={handleFileChange} />
        </Button>
      </Box>
    </>
  );
}
