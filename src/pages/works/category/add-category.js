import Head from "next/head";
import { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { DashboardLayout } from "src/layout";
import Loading from "src/Components/admin/common/Loading";

import WithAuth from "src/HOC/withAuth";

import AddWorkCategory from "src/Components/admin/work/add-category";
import { addWorkCategory, getWorkCategoryById, updateWorkCategory } from "src/services/work";

const AddCategory = (props) => {
  const router = useRouter();
  const [category, setCategory] = useState();
  const [loading, setLoading] = useState(true);
  const id = router.query.id;
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    async function fetchCategory() {
      if (id) {
        const data = await getWorkCategoryById(id);
        setCategory(data);
      }
      setLoading(false);
    }
    fetchCategory();
  }, [router.query.id]);

  async function handleSubmit({ name, slug }) {
    if (category) {
      const result = await updateWorkCategory({ id, name, slug });
      return result;
    }
    const result = await addWorkCategory({ name, slug });
    return result;
  }
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Head>
        <title>{id ? "Редактировать категорию работы" : "Добавить категорию работы"}| The Agency</title>
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
            {id ? "Редактировать категорию работы" : "Добавить категорию работы"}
          </Typography>
          <Box sx={{ pt: 3 }}>
            <AddWorkCategory handleSubmit={handleSubmit} category={category} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

AddCategory.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default WithAuth(AddCategory);
