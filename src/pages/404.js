import Head from "next/head";
import Link from "next/link";
import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Image from "next/image";
import { useRouter } from "next/router";

import Layout from "src/layout";
import Loading from "src/Components/common/Loading";
import shimmer from "src/utils/shimmer";
import Seo from "src/Components/common/Seo";

const NotFound = ({ system, ...props }) => {

  const theme = useTheme();
  const Router = useRouter();


  if (typeof window !== "undefined") {
    const isAdmin = window.location.pathname.startsWith("/admin");
    const path = window.location.pathname;
    if (path.startsWith("/ru")) {
      Router.push("/");
      return null;
    }
    if (isAdmin) {
      Router.replace("/admin/404");
    }
  }




  return (
    <>
      <Seo
        title={"404"}
        description={
          "Parfum gallery — эксклюзивная сеть официальных магазинов парфюмерии и косметики от мировых брендов в Узбекистане. 100% гарантия оригинала. Широкий ассортимент. 8 магазинов в Ташкенте. Страница не найдена."
        }
        siteName={system["site_name"]}
      />
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
                placeholder="blur"
                blurDataURL={shimmer}
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
  return <Layout>{page}</Layout>;
};

export default NotFound;
