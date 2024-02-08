import Head from "next/head";
import { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { DashboardLayout } from "src/layout";
import Loading from "src/Components/admin/common/Loading";
import WithAuth from "src/HOC/withAuth";
import AddMailingForm from "src/Components/admin/mailing/add-mailing";
import { addMailing, getMailingById, updateMailing } from "src/services/mailing";

const AddMailing = (props) => {
  const router = useRouter();
  const [mailing, setMailing] = useState();
  const [loading, setLoading] = useState(true);
  const id = router.query.id;

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    async function fetchMailing() {
      if (id) {
        const data = await getMailingById(id);
        if (!data) {
          router.back();
        }
        setMailing(data);
      }
      setLoading(false);
    }
    fetchMailing();
  }, [router.query.id]);

  async function handleSubmit({
    textRu, textUz, image, video
  }) {
    if (mailing) {
      const result = await updateMailing({
        id, textRu, textUz, image, video
      });
      return result;
    }
    const result = await addMailing({
      textRu, textUz, image, video
    });

    return result;
  }
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Head>
        <title>{id ? "Редактировать рассылку" : "Создать рассылку"} | Админ</title>
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
            {id ? "Редактировать рассылку" : "Создать рассылку"}
          </Typography>
          <Box sx={{ pt: 3 }}>
            <AddMailingForm
              handleSubmit={handleSubmit}
              mailing={mailing?.post}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};


AddMailing.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default WithAuth(AddMailing);
