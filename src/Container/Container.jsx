import React from "react";
import { Box } from "@mui/material";
import classes from "./styles.module.css";
export default function Container({ children, ...props }) {
  return (
    <Box className={classes.container} {...props}>
      {children}
    </Box>
  );
}
