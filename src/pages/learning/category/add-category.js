import Head from "next/head";
import { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { DashboardLayout } from "src/layout";
import AddBlogCategoryForm from "src/Components/admin/learning/add-category";
import Loading from "src/Components/admin/common/Loading";

import WithAuth from "src/HOC/withAuth";

import { addLearningCategory, getLearningCategory, updateLearningCategory } from "src/services/learning";

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
        const data = await getLearningCategory(id);
        setCategory(data);
      }
      setLoading(false);
    }
    fetchCategory();
  }, [router.query.id]);

  async function handleSubmit({ name, slug }) {
    if (category) {
      const result = await updateLearningCategory({ id, name, slug });
      return result;
    }
    const result = await addLearningCategory({ name, slug });
    return result;
  }
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Head>
        <title>{id ? "Edit Category" : "Add Category "}| Material Kit</title>
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
            {id ? "Edit Category" : "Add Category "}
          </Typography>
          <Box sx={{ pt: 3 }}>
            <AddBlogCategoryForm handleSubmit={handleSubmit} category={category} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

AddCategory.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default WithAuth(AddCategory);
