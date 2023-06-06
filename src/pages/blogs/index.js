import React from "react";
import Head from "next/head";
import { useEffect, useState, useMemo } from "react";
import { Box, Container, Button } from "@mui/material";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { DashboardLayout } from "src/layout";
import TableToolbar from "src/Components/admin/common/table-toolbar";
import DataTable from "src/Components/admin/common/datatables";
import Loading from "src/Components/admin/common/Loading";

import WithAuth from "src/HOC/withAuth";

import { imageBaseUrl } from "src/utils/endpoint";

import { getArticles, deleteArticle, deleteBulkArticle, getArticlesAsAdmin } from "src/services/article";

const Blogs = () => {
  const columns = useMemo(
    () => [
      {
        name: "Картинка",
        selector: (row) => row.previewImage,
        cell: (row) => (
          <img
            src={imageBaseUrl + row.previewImage}
            width="100"
            height="50"
            style={{ objectFit: "contain" }}
          />
        ),
        grow: 0,
        ignoreRowClick: false,
      },
      {
        name: "Id",
        selector: (row) => row.id,
        sortable: true,
        grow: 0,
      },
      {
        name: "Название",
        selector: (row) => row.name.en,
        cell: (row) => <div title={row.name.en}>{row.name.en}</div>,
        grow: 1,
        sortable: true,
      },
      {
        grow: 0,
        name: "Ссылка",
        selector: (row) => row.slug,
        cell: (row) => (
          <Link href={`/articles/${row.slug}`} passHref>
            {row.slug}
          </Link>
        ),
        sortable: true,
      },
      {
        grow: 1,
        name: "Пользователь",
        selector: (row) => row.user.name,
        sortable: true,
      },
      {
        grow: 1,
        name: "Категория",
        selector: (row) => row.article_category.name.en,
        sortable: true,
      },
      {
        name: "Обновлено",
        selector: (row) => row.updatedAt,
        sortable: true,
        grow: 2,
        right: true,
        type: "date",
      },
      {
        name: "Создано",
        selector: (row) => row.createdAt,
        sortable: true,
        grow: 2,
        right: true,
        type: "date",
      },
      {
        cell: (row) => {
          const handleDelete = async (e) => {
            e.stopPropagation(); // don't select this row after clicking
            const check = confirm("Удалить статью?");
            if (check) {
              await deleteArticle(row.id);
              const updatedBlogs = await getArticles();
              setBlogs([...updatedBlogs]);
            }
          };
          return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Button sx={{ padding: "5px" }}>
                <Link href={`/blogs/add-blog?id=${row.id}`} passHref>
                  <EditIcon />
                </Link>
              </Button>
              <Button onClick={handleDelete} sx={{ padding: "5px" }}>
                <DeleteIcon />
              </Button>
            </div>
          );
        },
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ],
    []
  );

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchBlogs() {
      const allBlogs = await getArticlesAsAdmin();
      setBlogs(allBlogs);
      setLoading(false);
    }
    fetchBlogs();
  }, []);
  async function handleSearch(e) {
    const value = e.target.value;
    const allBlogs = await getArticles();
    const searchedBlogs = [];
    allBlogs.forEach((blog) => {
      if (blog.id.toString().toLowerCase().includes(value.toLowerCase())) {
        searchedBlogs.push(blog);
      } else if (blog.name.toString().toLowerCase().includes(value.toLowerCase())) {
        searchedBlogs.push(blog);
      } else if (blog.slug.toString().toLowerCase().includes(value.toLowerCase())) {
        searchedBlogs.push(blog);
      } else if (blog.user.name.toString().toLowerCase().includes(value.toLowerCase())) {
        searchedBlogs.push(blog);
      } else if (blog.createdAt.toString().toLowerCase().includes(value.toLowerCase())) {
        searchedBlogs.push(blog);
      } else if (blog.updatedAt.toString().toLowerCase().includes(value.toLowerCase())) {
        searchedBlogs.push(blog);
      }
    });
    setBlogs(searchedBlogs);
    return "search";
  }
  async function handleDelete(selectedRows) {
    const result = await deleteBulkArticle([...selectedRows.map((r) => r.id)]);
    const allBlogs = await getArticles();
    setBlogs(allBlogs);
  }
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Head>
        <title>Статьи | Админ</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <TableToolbar handleSearch={handleSearch} title={"Статьи"} link="/blogs/add-blog" />
          <DataTable data={blogs} columns={columns} handleDelete={handleDelete} />
        </Container>
      </Box>
    </>
  );
};


Blogs.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default WithAuth(Blogs);
