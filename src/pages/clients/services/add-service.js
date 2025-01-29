import Head from "next/head";
import { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { DashboardLayout } from "src/layout";
import Loading from "src/Components/admin/common/Loading";

import WithAuth from "src/HOC/withAuth";
import AddClientsService from "src/Components/admin/clients/add-service";
import {
  addClientsServices,
  getClientsServicesById,
  updateClientsServices,
} from "src/services/clients";

const AddService = (props) => {
  const router = useRouter();
  const [service, setService] = useState();
  const [loading, setLoading] = useState(true);
  const id = router.query.id;
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    async function fetchService() {
      if (id) {
        const data = await getClientsServicesById(id);
        console.log(data);
        setService(data);
      }
      setLoading(false);
    }
    fetchService();
  }, [router.query.id]);

  async function handleSubmit({ name, slug }) {
    if (service) {
      const result = await updateClientsServices({ id, name, slug });
      return result;
    }
    const result = await addClientsServices({ name, slug });
    return result;
  }
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Head>
        <title>{id ? "Редактировать услугу" : "Добавить услугу"}| The Agency</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography sx={{ mb: 3 }} variant="h4">
            {id ? "Редактировать услугу" : "Добавить услугу"}
          </Typography>
          <Box sx={{ pt: 3 }}>
            <AddClientsService handleSubmit={handleSubmit} services={service} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

AddService.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default WithAuth(AddService);
