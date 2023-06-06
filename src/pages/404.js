import Head from "next/head";
import Link from "next/link";
import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Image from "next/image";
import { useRouter } from "next/router";

import { DashboardLayout } from "src/layout";

import Seo from "src/Components/common/Seo";

const NotFound = ({ ...props }) => {

  const theme = useTheme();

  return (
    <>
      <Box
        component="main"
        sx={{
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          minHeight: "100%",
          paddingTop: "100px",
          paddingBottom: "60px",
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              align="center"
              color="textPrimary"
              variant="h1"
              sx={{
                [theme.breakpoints.down("sm")]: {
                  fontSize: "20px",
                },
              }}
            >
              404: Страницы, которую вы ищете, здесь нет
            </Typography>
            <Typography
              align="center"
              color="textPrimary"
              variant="subtitle2"
              sx={{
                fontSize: "20px",
                [theme.breakpoints.down("sm")]: {
                  fontSize: "15px",
                },
              }}
            >
              Либо вы использовали какой-то сомнительный маршрут, либо вы пришли сюда по ошибке. Что
              бы это ни было, попробуйте используя навигацию
            </Typography>
            <Box sx={{ marginTop: "50px", display: "block", width: "100%" }}>
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                }}
                width="100"
                height="50"
                alt="Under development"
                src="/static/images/undraw_page_not_found_su7k.svg"

              />
            </Box>
            <Link href="/" passHref>
              <Button
                startIcon={<ArrowBackIcon fontSize="small" />}
                sx={{ mt: 3, padding: "10px" }}
                variant="contained"
              >
                Вернуться на главную страницу
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>
    </>
  );
};


NotFound.getLayout = (page) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default NotFound;
