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

import {
  getLearningCategories,
  deleteLearningCategory,
  deleteBulkLearningCategory,
} from "src/services/learning";

const Category = () => {
  const columns = useMemo(
    () => [
      {
        name: "Id",
        selector: (row) => row.id,
        sortable: true,
        grow: 0,
      },
      {
        name: "Название",
        selector: (row) => row.name.en,
        grow: 1,
        sortable: true,
      },
      {
        grow: 1,
        name: "Ссылка",
        selector: (row) => row.slug,
        cell: (row) => (
          <Link href={`/articles`} passHref>
            {row.slug}
          </Link>
        ),
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
            const check = confirm("Удалить категорию?");
            if (check) {
              await deleteLearningCategory(row.id);
              const updatedCategories = await getLearningCategories();
              setCategories([...updatedCategories]);
            }
          };
          return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Button sx={{ padding: "5px" }}>
                <Link href={`/blogs/category/add-category?id=${row.id}`} passHref>
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

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchCategories() {
      const allCategories = await getLearningCategories();
      setCategories(allCategories);
      setLoading(false);
    }
    fetchCategories();
  }, []);
  async function handleSearch(e) {
    const value = e.target.value;
    const allCategories = await getLearningCategories();
    const searchedCategories = [];
    allCategories.forEach((category) => {
      if (category.id.toString().toLowerCase().includes(value.toLowerCase())) {
        searchedCategories.push(category);
      } else if (category.name.en.toString().toLowerCase().includes(value.toLowerCase())) {
        searchedCategories.push(category);
      } else if (category.slug.toString().toLowerCase().includes(value.toLowerCase())) {
        searchedCategories.push(category);
      } else if (category.createdAt.toString().toLowerCase().includes(value.toLowerCase())) {
        searchedCategories.push(category);
      } else if (category.updatedAt.toString().toLowerCase().includes(value.toLowerCase())) {
        searchedCategories.push(category);
      }
    });
    setCategories(searchedCategories);
    return "search";
  }
  async function handleDelete(selectedRows) {
    const result = await deleteBulkLearningCategory([...selectedRows.map((r) => r.id)]);
    const allCategories = await getLearningCategories();
    setCategories(allCategories);
  }
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Head>
        <title>Категория | Админ</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <TableToolbar
            handleSearch={handleSearch}
            title={"Категория"}
            link="/learning/category/add-category"
          />
          <DataTable data={categories} columns={columns} handleDelete={handleDelete} />
        </Container>
      </Box>
    </>
  );
};


Category.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default WithAuth(Category);
