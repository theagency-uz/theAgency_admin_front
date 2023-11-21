import { TabContext, TabList } from "@mui/lab";
import { Box, Button, Tab, TextField, Zoom } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";

import SunEditor from "src/Components/common/suneditor";
import Flag from "../../common/flag";

export default function ArticleBlock({
  value: block,
  index,
  onChange: handleEditBlock,
  handleDelete: handleDeleteBlock,
  DragHandle,
  ArrowsHandle,
}) {
  const [tabValue, setTabValue] = useState("1");

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const [fullTab, setfullTab] = useState("1");
  const fullTabChange = (event, newValue) => {
    setfullTab(newValue);
  };

  return (
    <Box sx={{ border: "1px solid #181818", padding: "10px", width: "100%" }}>
      <DragHandle />
      <ArrowsHandle />
      <h2># {index || index === 0 ? index + 1 : ""}</h2>
      <Button onClick={(e) => handleDeleteBlock(index)}>
        <DeleteIcon />
      </Button>

      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={tabValue}>
          <Box sx={{}}>
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
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

          <Zoom in={tabValue == 1} value="1" hidden={tabValue != "1"}>
            <Box>
              <TextField
                label="Название ru"
                margin="normal"
                name="nameRu"
                onChange={(e) =>
                  handleEditBlock({ index, name: "name", lang: "ru", value: e.target.value })
                }
                value={block?.name.ru}
                variant="outlined"
                inputProps={{}}
              />
            </Box>
          </Zoom>
          <Zoom in={tabValue == 2} value="2" hidden={tabValue != "2"}>
            <Box>
              <TextField
                label="Название uz"
                margin="normal"
                name="nameUz"
                onChange={(e) =>
                  handleEditBlock({ index, name: "name", lang: "uz", value: e.target.value })
                }
                value={block?.name.uz}
                variant="outlined"
                inputProps={{}}
              />
            </Box>
          </Zoom>
        </TabContext>
      </Box>
      <TextField
        fullWidth
        label="Ссылка"
        margin="normal"
        name="slug"
        onChange={(e) => handleEditBlock({ index, name: "slug", value: e.target.value })}
        type="text"
        value={block?.slug}
        variant="outlined"
        sx={{ resize: "vertical" }}
      />

      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={fullTab}>
          <Box sx={{}}>
            <TabList
              onChange={fullTabChange}
              aria-label="lab API tabs example"
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
          <Zoom in={fullTab == 1} value={1} hidden={fullTab != 1}>
            <Box sx={{ overflow: "visible" }}>
              <SunEditor
                onChange={(v) => {
                  handleEditBlock({ index, name: "description", lang: "ru", value: v });
                }}
                value={block.description.ru}
              />
            </Box>
          </Zoom>
          <Zoom in={fullTab == 2} value={2} hidden={fullTab != 2}>
            <Box sx={{ overflow: "visible" }}>
              <SunEditor
                onChange={(v) => {
                  handleEditBlock({ index, name: "description", lang: "uz", value: v });
                }}
                value={block.description.uz}
              />
            </Box>
          </Zoom>
        </TabContext>
      </Box>
    </Box>
  );
}
