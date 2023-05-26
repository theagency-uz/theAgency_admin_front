import React from "react";
import { Box } from "@mui/material";
import classes from "./styles.module.css";
export default function SmallContainer({ children, ...props }) {
  return (
    <Box className={classes.smallContainer} {...props}>
      {children}
    </Box>
  );
}
