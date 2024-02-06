import React, { useEffect } from "react";
import { useState } from "react";

import { TabContext, TabList } from "@mui/lab";
import { Box, Tab, TextareaAutosize, Zoom } from "@mui/material";
import Flag from "src/Components/admin/common/flag";

export default function MailingText() {
  const [value, setValue] = useState("1");
  const [textRu, setTextRu] = useState("");
  const [textUz, setTextUz] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{}}>
          <TabList
            onChange={handleChange}
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
            <TextareaAutosize
              minRows={5}
              value={textRu}
              style={{
                width: "100%",
                height: "100%",
                marginBlock: "20px",
                padding: "10px",
                boxSizing: "border-box",
              }}
              placeholder="Описание RU"
              onChange={(e) => setTextRu(e.target.value)}
            />
          </Box>
        </Zoom>
        <Zoom in={value == 2} value="2" hidden={value != "2"}>
          <Box>
            <TextareaAutosize
              aria-label="empty textarea"
              minRows={5}
              value={textUz}
              style={{
                width: "100%",
                height: "100%",
                marginBlock: "20px",
                padding: "10px",
                boxSizing: "border-box",
              }}
              placeholder="Описание UZ"
              onChange={(e) => setTextUz(e.target.value)}
            />
          </Box>
        </Zoom>
      </TabContext>
    </Box>
  );
}
