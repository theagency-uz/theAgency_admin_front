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

import WithAuth from "src/HOC/withAuth";

import { deleteMailing, getMailings } from "src/services/mailing";

const Mailings = () => {
  const columns = useMemo(
    () => [
      {
        name: "Картинка или Видео",
        selector: (row) => {
          return row.image && row.video == null
            ? row.image
            : row.image == null && row.video
              ? row.video
              : null;
        },
        cell: (row) => {
          const mediaSource = row.image || row.video;

          if (mediaSource) {
            return row.image ? (
              <img
                src={"http://192.168.0.132:5000" + row.image}
                width="100"
                height="50"
                style={{ objectFit: "contain" }}
                alt="Image"
              />
            ) : (
              <video
                src={"http://192.168.0.132:5000" + row.video}
                width="100"
                height="50"
                controls
              />
            );
          }

          return <div>Нет изображения или видео</div>; // or a default element if neither image nor video is available
        },
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
        selector: (row) => row.text.ru,
        cell: (row) => <div title={row.text.ru}>{row.text.ru}</div>,
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
            const check = confirm("Удалить рассылку?");
            if (check) {
              await deleteMailing(row.id);
              const updatedMailings = await getMailings({ limit: perPage, page: 1 });
              setMailings([...updatedMailings.posts]);
            }

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

  const [mailings, setMailings] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      const allMailings = await getMailings({ limit: perPage, page: 1 });
      setMailings(allMailings?.posts);
      setTotalRows(allMailings?.count)
      setLoading(false);
    }
    fetchBlogs();
  }, []);


  const handlePageChange = async (page) => {
    const allMailings = await getMailings({ page: page, limit: perPage });

    setMailings(allMailings.posts);
    setTotalRows(allMailings.count)

  };
  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    const response = await getMailings({ page: page, limit: newPerPage });
    setMailings(response.posts);
    setPerPage(newPerPage);
    setTotalRows(response.count)
    setLoading(false);
  };

  async function handleSearch(e) {
    const value = e.target.value;
    const allMailings = await getMailings();
    const searchedMailings = [];
    allMailings.forEach((mailing) => {
      if (mailing.id.toString().toLowerCase().includes(value.toLowerCase())) {
        searchedMailings.push(mailing);
      } else if (mailing.text.ru.toString().toLowerCase().includes(value.toLowerCase())) {
        searchedMailings.push(mailing);
      } else if (mailing.createdAt.toString().toLowerCase().includes(value.toLowerCase())) {
        searchedMailings.push(mailing);
      } else if (mailing.updatedAt.toString().toLowerCase().includes(value.toLowerCase())) {
        searchedMailings.push(mailing);
      }
    });
    setMailings(searchedMailings);
    return "search";
  }
  async function handleDelete(selectedRows) {
    const result = await deleteBulkWork([...selectedRows.map((r) => r.id)]);
    const allWorks = await getWorksAsAdmin();
    setWorks(allWorks);
  }
  // if (loading) {
  //   return <Loading />;
  // }

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
          <DataTable
            data={mailings}
            columns={columns}
            handleDelete={handleDelete}
            isServer={true}
            totalRows={totalRows}
            handlePerRowsChange={handlePerRowsChange}
            handlePageChange={handlePageChange}
            loading={loading}
          />
        </Container>
      </Box>
    </>
  );
};


Mailings.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default WithAuth(Mailings);
