import Head from "next/head";
import { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { DashboardLayout } from "src/layout";
import AddBlogForm from "src/Components/admin/learning/add-blog";
import Loading from "src/Components/admin/common/Loading";

import WithAuth from "src/HOC/withAuth";

import {
  addLearning,
  updateLearning,
  getLearningCategories,
  getLearningAsAdmin,
} from "src/services/learning";
import { getUser } from "src/services/auth";

const AddBlog = (props) => {
  const router = useRouter();
  const [blog, setBlog] = useState();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const id = router.query.id;
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    async function fetchBlog() {
      if (id) {
        const data = await getLearningAsAdmin(id);
        if (!data) {
          router.back();
        }

        setBlog(data);
      }
      const fetchedCategories = await getLearningCategories();
      setCategories(fetchedCategories);
      setLoading(false);
    }
    fetchBlog();
  }, [router.query.id]);

  async function handleSubmit({
    name,
    slug,
    shortDescription,
    fullDescription,
    tgDescription,
    previewImage,
    category,
    isActive,
    isTg,
    isNewPage,
    blocks
  }) {
    const user = getUser();
    if (blog) {
      const result = await updateLearning({
        id,
        name,
        slug,
        shortDescription,
        fullDescription,
        previewImage,
        category,
        userId: user.id,
        isActive,
        isTg,
        tgDescription,
        isNewPage,
        blocks
      });
      return result;
    }
    const result = await addLearning({
      name,
      slug,
      shortDescription,
      fullDescription,
      previewImage,
      category,
      userId: user.id,
      isActive,
      isTg,
      tgDescription,
      isNewPage,
      blocks
    });

    return result;
  }
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Head>
        <title>{id ? "Редактировать статью" : "Создать статью"} | Админ</title>
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
            {id ? "Редактировать статью" : "Создать статью"}
          </Typography>
          <Box sx={{ pt: 3 }}>
            <AddBlogForm handleSubmit={handleSubmit} blog={blog} categories={categories} />
          </Box>
        </Container>
      </Box>
    </>
  );
};


AddBlog.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default WithAuth(AddBlog);
