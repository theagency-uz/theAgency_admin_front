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
  useTheme,
  CircularProgress,
} from "@mui/material";

import { Download as DownloadIcon } from "src/assets/icons/download";
import { Search as SearchIcon } from "src/assets/icons/search";
import { Upload as UploadIcon } from "src/assets/icons/upload";
import { useEffect, useState, memo } from "react";

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
