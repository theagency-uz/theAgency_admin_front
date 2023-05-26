import Head from "next/head";
import { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { DashboardLayout } from "src/layout/admin";
import AddUserForm from "src/Components/admin/user/add-user";
import Loading from "src/Components/admin/common/Loading";

import WithAuth from "src/HOC/withAuth";

import { imgToFile } from "src/utils/image";

import { getUser, getRoles, register, updateUser } from "src/services/user";
import { getUser as getCurrentUser } from "src/services/auth";

const AddUser = (props) => {
  const router = useRouter();
  const [user, setUser] = useState();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const id = router.query.id;
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    async function fetchAll() {
      if (id) {
        const data = await getUser(id);
        setUser(data);
      }
      const tempRole = await getRoles();
      setRoles(tempRole);
      setLoading(false);
    }
    fetchAll();
  }, [router.query.id]);

  async function handleSubmit({
    roleId,
    name,
    email,
    phone,
    city,
    address,
    password,
    confirmPassword,
    image,
  }) {
    if (user) {
      const result = await updateUser({
        id,
        roleId,
        name,
        email,
        phone,
        city,
        address,
        password,
        confirmPassword,
        image,
      });
      if (result.status === 200) {
        if (String(getCurrentUser().id) === id) {
          router.reload();
        }
      }
      return result;
    }
    const result = await register({
      roleId,
      name,
      email,
      phone,
      city,
      address,
      password,
      confirmPassword,
      image,
    });
    return result;
  }
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Head>
        <title>{id ? "Редактировать пользователя" : "Добавить пользователя"}| Material Kit</title>
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
            {id ? "Редактировать пользователя" : "Добавить пользователя"}
          </Typography>
          <Box sx={{ pt: 3 }}>
            <AddUserForm handleSubmit={handleSubmit} user={user} roles={roles} />
          </Box>
        </Container>
      </Box>
    </>
  );
};



AddUser.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default WithAuth(AddUser);
