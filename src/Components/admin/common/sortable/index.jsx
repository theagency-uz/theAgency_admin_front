import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

import { SortableList } from "./SortableList";

export default function Sortable({
  items,
  setItems,
  handleAdd,
  Component,
  handleChange,
  handleDelete,
  handleSort,
  ...props
}) {
  return (
    <Box>
      <SortableList
        items={items}
        onChange={setItems}
        handleSort={handleSort}
        renderItem={(item, index) => (
          <SortableList.Item id={item.id}>
            <Component
              value={item}
              onChange={handleChange}
              index={index}
              handleDelete={handleDelete}
              DragHandle={() => <SortableList.DragHandle />}
              ArrowsHandle={() => (
                <SortableList.ArrowsHandle
                  handleSort={handleSort}
                  onChange={setItems}
                  id={item.id}
                  items={items}
                  index={index}
                />
              )}
              {...props}
            />
          </SortableList.Item>
        )}
      />

      <Button sx={{ width: "100%" }} variant="contained" onClick={handleAdd}>
        <AddIcon />
      </Button>
    </Box>
  );
}
