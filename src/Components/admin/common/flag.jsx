import React from "react";
import Flags from "country-flag-icons/react/3x2";

import classes from "./styles.module.css";

export default function Flag({ code }) {
  const FlagCustom = Flags[code];
  return <FlagCustom className={classes.flag} />;
}
