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

import { deleteBulkWork, getWorksAsAdmin } from "src/services/work";

const Mailings = () => {
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
        name: "Текст",
        selector: (row) => row.name.ru,
        cell: (row) => <div title={row.name.ru}>{row.name.ru}</div>,
        grow: 1,
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

          };
          return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Button sx={{ padding: "5px" }}>
                <Link href={`/mailings/add-mailing?id=${row.id}`} passHref>
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
          <TableToolbar handleSearch={handleSearch} title={"Рассылки"} link="mailings/add-mailing" />
          <DataTable data={works} columns={columns} handleDelete={handleDelete} />
        </Container>
      </Box>
    </>
  );
};


Mailings.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default WithAuth(Mailings);
