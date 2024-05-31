import DataTable from "react-data-table-component";
import { useState, useEffect, useCallback } from "react";
import { Box, Button, Typography } from "@mui/material";
import classes from "./styles.module.css";
import { useRouter } from "next/router";

// import { AgGridReact } from "ag-grid-react";

// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";

const Table = ({ columns, data, handleDelete, sortId }) => {
  const router = useRouter();
  const [selectedRows, setSelectedRows] = useState([]);
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);
  useEffect(() => {
    if (data?.length === 0) {
      setSelectedRows([]);
    }
  }, [data]);

  useEffect(() => {
    if (router.query.page) {
      setPage(Number(router.query.page));
    }
  }, []);
  useEffect(() => {
    router.push({ query: `page=${page}` }, undefined, {
      shallow: true,
    });
  }, [page]);
  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  return (
    <div className={classes.table}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "rgb(227, 242, 253)",
          padding: "10px",
        }}
        visibility={selectedRows.length === 0 ? "hidden" : "visible"}
      >
        <Typography>
          {selectedRows.length} {selectedRows.length === 1 ? "item" : "items"} selected
        </Typography>
        <Button variant="contained" color="error" onClick={() => handleDelete(selectedRows)}>
          Delete
        </Button>
      </Box>

      {/* <AgGridReact columnDefs={columns} rowData={data}></AgGridReact> */}

      <DataTable
        pagination={true}
        data={data}
        columns={columns}
        selectableRows
        onSelectedRowsChange={handleRowSelected}
        paginationDefaultPage={page}
        paginationPerPage={perPage}
        // fixedHeaderScrollHeight="100px"
        highlightOnHover
        pointerOnHover
        paginationRowsPerPageOptions={[10, 15, 20, 30, 40]}
        // onRowClicked={handleSelect}
        striped
        noDataComponent="Пока тут нет данных" //or your component
        onChangePage={(e) => {
          setPage(e);
        }}
        onChangeRowsPerPage={(e) => {
          setPerPage(e);
        }}
        defaultSortFieldId={sortId}
      />
    </div>
  );
};

export default Table;
