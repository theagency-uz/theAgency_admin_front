import Head from "next/head";
import { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { DashboardLayout } from "src/layout";
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
import AddWorkForm from "src/Components/admin/work/add-work";
import { addWork, getWorkById, getWorkCategories, updateWork } from "src/services/work";

const AddBlog = (props) => {
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
            <AddWorkForm handleSubmit={handleSubmit} work={work} categories={categories} />
          </Box>
        </Container>
      </Box>
    </>
  );
};


AddBlog.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default WithAuth(AddBlog);
