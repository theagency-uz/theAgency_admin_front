import React, { createContext, useContext, useMemo } from "react";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import classes from "./SortableItem.module.css";
import { Box, Button } from "@mui/material";

const SortableItemContext = createContext({
  attributes: {},
  listeners: undefined,
  ref() {},
});

export function SortableItem({ children, id }) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });
  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef]
  );
  const style = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <SortableItemContext.Provider value={context}>
      <li className={classes.SortableItem} ref={setNodeRef} style={style}>
        {children}
      </li>
    </SortableItemContext.Provider>
  );
}

export function DragHandle() {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return (
    <Button className="DragHandle" {...attributes} {...listeners} ref={ref}>
      <DragIndicatorIcon />
    </Button>
  );
}
export function ArrowsHandle({ handleSort, onChange, items, id, index }) {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return (
    <Box>
      <Button
        onClick={(e) => {
          if (index !== 0) {
            const activeIndex = index;
            const overIndex = index + 1;

            onChange(arrayMove(items, activeIndex, overIndex));
            if (handleSort) {
              handleSort(arrayMove(items, activeIndex, overIndex));
            }
          }
        }}
      >
        <ArrowUpwardIcon />
      </Button>
      <Button
        onClick={(e) => {
          if (index < items.length - 1) {
            const activeIndex = index;
            const overIndex = index - 1;

            onChange(arrayMove(items, activeIndex, overIndex));
            if (handleSort) {
              handleSort(arrayMove(items, activeIndex, overIndex));
            }
          }
        }}
      >
        <ArrowDownwardIcon />
      </Button>
    </Box>
  );
}
