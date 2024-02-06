import Head from "next/head";
import { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { DashboardLayout } from "src/layout";
import Loading from "src/Components/admin/common/Loading";

import WithAuth from "src/HOC/withAuth";
import AddMailingForm from "src/Components/admin/mailing/add-mailing";
import { addWork, getWorkById, getWorkCategories, updateWork } from "src/services/work";

const AddMailing = (props) => {
  const router = useRouter();
  const [work, setWork] = useState();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const id = router.query.id;
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    async function fetchWork() {
      if (id) {
        const data = await getWorkById(id);
        if (!data) {
          router.back();
        }
        setWork(data);
      }
      const fetchedCategories = await getWorkCategories();
      setCategories(fetchedCategories);
      setLoading(false);
    }
    fetchWork();
  }, [router.query.id]);

  async function handleSubmit({
    name,
    slug,
    description,
    image,
    type,
    order,
    category,
    isActive,
    isNewPage
  }) {
    if (work) {
      const result = await updateWork({
        id,
        name,
        slug,
        description,
        image,
        type,
        order,
        category,
        isActive,
        isNewPage
      });
      return result;
    }
    const result = await addWork({
      name,
      slug,
      description,
      image,
      type,
      order,
      category,
      isActive,
      isNewPage
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
            <AddMailingForm handleSubmit={handleSubmit} work={work} categories={categories} />
          </Box>
        </Container>
      </Box>
    </>
  );
};


AddMailing.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default WithAuth(AddMailing);
