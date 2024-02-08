import React, { useEffect } from "react";
import { useState } from "react";

import { TabContext, TabList } from "@mui/lab";
import { Box, Tab, TextField, TextareaAutosize, Zoom } from "@mui/material";
import Flag from "src/Components/admin/common/flag";

export default function MailingText({ ...props }) {
  const { textRu, textUz, handleChange, formikErrors } = props;
  const [value, setValue] = useState("1");

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box>
          <TabList
            onChange={handleChangeTab}
            sx={{
              backgroundColor: "rgba(0,0,0,0.1)",
              width: "fit-content",
              borderRadius: "8px",
            }}
          >
            <Tab icon={<Flag code="RU" />} value="1" />
            <Tab icon={<Flag code="UZ" />} value="2" />
          </TabList>
        </Box>

        <Zoom in={value == 1} value="1" hidden={value != "1"}>
          <Box>
            <TextField
              id="outlined-multiline-static"
              label="Описание RU"
              multiline
              minRows={5}
              maxRows={10}
              // defaultValue="Default Value"
              value={textRu}
              error={formikErrors.textRu}
              name="textRu"
              style={{
                width: "100%",
                height: "100%",
                marginBlock: "20px",
                boxSizing: "border-box",
              }}
              placeholder="Описание RU"
              onChange={handleChange}
            />
          </Box>
        </Zoom>
        <Zoom in={value == 2} value="2" hidden={value != "2"}>
          <Box>
            <TextField
              id="outlined-multiline-static"
              label="Описание UZ"
              multiline
              minRows={5}
              maxRows={10}
              error={formikErrors.textUz}
              // defaultValue="Default Value"
              name="textUz"
              value={textUz}
              style={{
                width: "100%",
                height: "100%",
                marginBlock: "20px",
                boxSizing: "border-box",
              }}
              placeholder="Описание UZ"
              onChange={handleChange}
            />
          </Box>
        </Zoom>
      </TabContext>
    </Box>
  );
}
