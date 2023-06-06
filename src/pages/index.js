import Head from "next/head";
import { Box, Container } from "@mui/material";
import { DashboardLayout } from "src/layout";

import WithAuth from "src/HOC/withAuth";


const Dashboard = ({ ...props }) => {
  return (
    <>
      <Head>
        <title>Дашборд | Parfum Galleryt</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>

        </Container>
      </Box>
    </>
  );
};



Dashboard.getLayout = (page) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default WithAuth(Dashboard);
