import Head from "next/head";
import { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { DashboardLayout } from "src/layout";
import AddRoleForm from "src/Components/admin/user/add-role";
import Loading from "src/Components/admin/common/Loading";

import WithAuth from "src/HOC/withAuth";

import { addRole, getRole, updateRole } from "src/services/user";

const AddRole = (props) => {
  const router = useRouter();
  const [role, setRole] = useState();
  const [loading, setLoading] = useState(true);
  const id = router.query.id;
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    async function fetchAll() {
      if (id) {
        const data = await getRole(id);
        setRole(data);
      }
      setLoading(false);
    }
    fetchAll();
  }, [router.query.id]);

  async function handleSubmit({ name, createAdmin, create, read, update, del }) {
    if (role) {
      const result = await updateRole({
        id,
        name,
        createAdmin,
        create,
        read,
        update,
        del,
      });
      return result;
    }
    const result = await addRole({
      name,
      createAdmin,
      create,
      read,
      update,
      del,
    });
    return result;
  }
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Head>
        <title>{id ? "Редактировать роль" : "Добаить роль"} | Админ</title>
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
            {id ? "Редактировать роль" : "Добаить роль "}
          </Typography>
          <Box sx={{ pt: 3 }}>
            <AddRoleForm handleSubmit={handleSubmit} role={role} />
          </Box>
        </Container>
      </Box>
    </>
  );
};




AddRole.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default WithAuth(AddRole);
