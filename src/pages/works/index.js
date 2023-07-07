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
import { deleteBulkWork, deleteWork, getWorks, getWorksAsAdmin } from "src/services/work";

const Works = () => {
  const columns = useMemo(
    () => [
      {
        name: "Картинка",
        selector: (row) => row.image,
        cell: (row) => (
          <img
            src={imageBaseUrl + row.image}
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
        selector: (row) => row.name.ru,
        cell: (row) => <div title={row.name.ru}>{row.name.ru}</div>,
        grow: 1,
        sortable: true,
      },
      {
        grow: 0,
        name: "Порядок",
        selector: (row) => row.order,
        sortable: true,
      },
      {
        grow: 0,
        name: "Тип",
        selector: (row) => row.type,
        sortable: true,
      },
      {
        grow: 0,
        name: "Ссылка",
        selector: (row) => row.slug,
        cell: (row) => (
          <Link href={`/works/${row.slug}`} passHref>
            {row.slug}
          </Link>
        ),
        sortable: true,
      },
      {
        grow: 1,
        name: "Категории",
        selector: (row) => row.spheres.map(s => s.name.ru).join(", "),
        cell: (row) => <div title={row.spheres.map(s => s.name.ru).join(", ")}>{row.spheres.map(s => s.name.ru).join(", ")}</div>,
        sortable: true,
      },
      {
        grow: 0,
        name: "Тип",
        selector: (row) => row.type === "modal" ? "модалка" : row.type === "article" ? "статья" : "ссылка",
        sortable: true,
      },
      {
        grow: 0,
        name: "Активный",
        selector: (row) => row.isActive ? "Да" : "Нет",
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
            const check = confirm("Удалить работу?");
            if (check) {
              await deleteWork(row.id);
              const updatedWorks = await getWorksAsAdmin();
              setWorks([...updatedWorks]);
            }
          };
          return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Button sx={{ padding: "5px" }}>
                <Link href={`/works/add-work?id=${row.id}`} passHref>
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

  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchBlogs() {
      const allWorks = await getWorksAsAdmin();
      setWorks(allWorks);
      setLoading(false);
    }
    fetchBlogs();
  }, []);
  async function handleSearch(e) {
    const value = e.target.value;
    const allWorks = await getWorksAsAdmin();
    const searchedWorks = [];
    allWorks.forEach((work) => {
      if (work.id.toString().toLowerCase().includes(value.toLowerCase())) {
        searchedWorks.push(work);
      } else if (work.name.ru.toString().toLowerCase().includes(value.toLowerCase())) {
        searchedWorks.push(work);
      } else if (work.slug.toString().toLowerCase().includes(value.toLowerCase())) {
        searchedWorks.push(work);
      } else if (work.createdAt.toString().toLowerCase().includes(value.toLowerCase())) {
        searchedWorks.push(work);
      } else if (work.updatedAt.toString().toLowerCase().includes(value.toLowerCase())) {
        searchedWorks.push(work);
      }
    });
    setWorks(searchedWorks);
    return "search";
  }
  async function handleDelete(selectedRows) {
    const result = await deleteBulkWork([...selectedRows.map((r) => r.id)]);
    const allWorks = await getWorksAsAdmin();
    setWorks(allWorks);
  }
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Head>
        <title>Работы | Админ</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <TableToolbar handleSearch={handleSearch} title={"Работы"} link="/works/add-work" />
          <DataTable data={works} columns={columns} handleDelete={handleDelete} />
        </Container>
      </Box>
    </>
  );
};


Works.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default WithAuth(Works);
