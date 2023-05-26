import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import classes from "./styles.module.css";
export default function Loading() {
  return (
    <Box className={classes.loading}>
      <CircularProgress
        sx={{
          color: "#ffd558",
        }}
      />
    </Box>
  );
}
