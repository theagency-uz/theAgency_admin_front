import Head from "next/head";
import { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { DashboardLayout } from "src/layout/admin";
import AddBlogForm from "src/Components/admin/blog/add-blog";
import Loading from "src/Components/admin/common/Loading";

import WithAuth from "src/HOC/withAuth";

import {
  addArticle,
  getArticle,
  updateArticle,
  getArticleCategories,
  getArticleAsAdmin,
} from "src/services/article";
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
        const data = await getArticleAsAdmin(id);
        if (!data) {
          router.back();
        }
        setBlog(data);
      }
      const fetchedCategories = await getArticleCategories();
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
    mainImage,
    category,
    isActive,
    isTg,
    isNewPage
  }) {
    const user = getUser();
    if (blog) {
      const result = await updateArticle({
        id,
        name,
        slug,
        shortDescription,
        fullDescription,
        previewImage,
        mainImage,
        category,
        userId: user.id,
        isActive,
        isTg,
        tgDescription,
        isNewPage
      });
      return result;
    }
    const result = await addArticle({
      name,
      slug,
      shortDescription,
      fullDescription,
      previewImage,
      mainImage,
      category,
      userId: user.id,
      isActive,
      isTg,
      tgDescription,
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
