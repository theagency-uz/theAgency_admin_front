import Head from "next/head";
import { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { DashboardLayout } from "src/layout";
import AddBlogForm from "src/Components/admin/blog/add-blog";
import Loading from "src/Components/admin/common/Loading";

import WithAuth from "src/HOC/withAuth";

import { getUser } from "src/services/auth";
import AddClientsForm from "src/Components/admin/clients/add-client";
import { getClientsServices, addClient, getClientById, updateClients } from "src/services/clients";

const AddClient = (props) => {
  const router = useRouter();
  const [clients, setClients] = useState();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const id = router.query.id;
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    async function fetchClients() {
      if (id) {
        const data = await getClientById(id);
        if (!data) {
          router.back();
        }
        setClients(data);
      }
      const fetchedServices = await getClientsServices();
      setServices(fetchedServices);
      setLoading(false);
    }
    fetchClients();
  }, [router.query.id]);

  async function handleSubmit({ title, image, order, service, isActive }) {
    if (clients) {
      const result = await updateClients({
        id,
        title,
        image,
        order,
        service,
        isActive,
      });
      return result;
    }
    const result = await addClient({
      title,
      image,
      order,
      service,
      isActive,
    });

    return result;
  }
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Head>
        <title>{id ? "Редактировать работу" : "Создать работу"} | Админ</title>
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
            {id ? "Редактировать работу" : "Создать работу"}
          </Typography>
          <Box sx={{ pt: 3 }}>
            <AddClientsForm handleSubmit={handleSubmit} clients={clients} services={services} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

AddClient.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default WithAuth(AddClient);
