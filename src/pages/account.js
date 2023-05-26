import { useState } from "react";
import Head from "next/head";
import { Box, Container, Typography } from "@mui/material";

import { DashboardLayout } from "src/layout/admin";
import { SettingsPassword } from "src/Components/admin/settings/settings-password";
import { SettingsLogout } from "src/Components/admin/settings/settings-logout";
import { SettingsAccount } from "src/Components/admin/settings/settings-account";

import WithAuth from "src/HOC/withAuth";

import { updateUser, updatePassword, updateTimeout } from "src/services/user";
import auth, { updateJwt } from "src/services/auth";

const Account = () => {
  const [user, setUser] = useState(auth.getUser());
  async function handlePasswordChange({ password, confirmPassword }) {
    try {
      const result = await updatePassword({
        password: password,
        confirmPassword: confirmPassword,
      });
      return result;
    } catch (err) {
      return err.response;
    }
  }
  async function handleAccountChange({ name, email, image }) {
    try {
      const result = await updateUser({
        name: name,
        email: email,
        image: image,
      });
      await updateJwt();
      setUser(auth.getUser());
      return result;
    } catch (err) {
      return err.response;
    }
  }
  async function handleTimeoutChange({ timeout }) {
    try {
      const result = await updateTimeout({
        timeout,
      });
      return result;
    } catch (err) {
      return err.response;
    }
  }
  return (
    <>
      <Head>
        <title>account | Material Kit</title>
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
            account
          </Typography>
          <Box sx={{ pt: 3 }}>
            <SettingsAccount handleSubmit={handleAccountChange} user={user} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <SettingsPassword handleSubmit={handlePasswordChange} user={user} />
          </Box>
          <Box sx={{ pt: 3 }}>
            <SettingsLogout handleSubmit={handleTimeoutChange} user={user} />
          </Box>
        </Container>
      </Box>
    </>
  );
};




Account.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default WithAuth(Account);
