import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  Modal,
  useTheme,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
} from "@mui/material";

import { Download as DownloadIcon } from "src/assets/icons/download";
import { Search as SearchIcon } from "src/assets/icons/search";
import { Upload as UploadIcon } from "src/assets/icons/upload";
import { useEffect, useState, memo } from "react";

import DropZone from "./fileDropzone";

const TableToolbar = memo(
  ({
    hasAdd = true,
    submitImport,
    updatePrices,
    handleImport,
    handleExport,
    downloadSample,
    importData,
    type,
    importLoading,
    ...props
  }) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState();
    const [isImport, setIsImport] = useState(true);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
      if (file && handleImport) {
        handleImport(file);
      }
    }, [file]);

    return (
      <Box {...props}>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            m: -1,
          }}
        >
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                bottom: "0",
                left: "0",
                width: "100%",
                minHeight: "80%",
                bgcolor: "neutral.900",
                color: "#fff",
                boxShadow: 24,
                padding: "28px 13px",
                textAlign: "center",
                borderTopLeftRadius: "50px",
                borderTopRightRadius: "50px",
                [theme.breakpoints.up("sm")]: {
                  // width: "420px",
                  padding: "43px 23px",
                },
              }}
            >
              <Box>
                <DropZone setFile={setFile} />
                <Box sx={{ display: "flex", gap: "20px", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (isImport) {
                        submitImport();
                      } else {
                        updatePrices();
                      }
                    }}
                    sx={{ display: "flex", gap: "5px" }}
                  >
                    Далее
                    {importLoading && <CircularProgress sx={{ color: "#fff" }} size={20} />}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (isImport) {
                        downloadSample();
                      } else {
                        downloadSample("price");
                      }
                    }}
                  >
                    Скачать шаблон
                  </Button>
                </Box>
              </Box>
            </Box>
          </Modal>

          <Typography sx={{ m: 1 }} variant="h4">
            {props.title}
          </Typography>
          <Box sx={{ m: 1 }}>
            {type === "product" && (
              <Button
                startIcon={<UploadIcon fontSize="small" />}
                sx={{ mr: 1 }}
                onClick={() => {
                  setIsImport(false);
                  handleOpen();
                }}
              >
                Обновить цены
              </Button>
            )}
            <Button
              startIcon={<UploadIcon fontSize="small" />}
              sx={{ mr: 1 }}
              onClick={() => {
                setIsImport(true);
                handleOpen();
              }}
            >
              Импорт
            </Button>

            <Button
              startIcon={<DownloadIcon fontSize="small" />}
              sx={{ mr: 1 }}
              onClick={handleExport}
            >
              Экспорт
            </Button>
            {hasAdd && (
              <Link href={props.link} passHref>
                <Button color="primary" variant="contained">
                  Добавить {props.title.toLowerCase()}
                </Button>
              </Link>
            )}
          </Box>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", gap: "15px", alignItems: "center" }}>
                <TextField
                  sx={{
                    maxWidth: 500,
                    width: "100%",
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon fontSize="small" color="action">
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  placeholder={"Искать " + props.title.toLowerCase()}
                  variant="outlined"
                  onChange={props.handleSearch}
                />
                {props.searchLoading && <CircularProgress sx={{}} size={40} />}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    );
  }
);

export default TableToolbar;
