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
  deleteClientsServices,
  getClientsServices,
  deleteBulkClientsServices,
} from "src/services/clients";

const Services = () => {
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
        selector: (row) => row.name.ru,
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
            const check = confirm("Удалить услугу?");
            if (check) {
              await deleteClientsServices(row.id);
              const updatedCategories = await getClientsServices();
              setServices([...updatedCategories]);
            }
          };
          return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Button sx={{ padding: "5px" }}>
                <Link href={`/clients/services/add-service?id=${row.id}`} passHref>
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

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchServices() {
      const allServices = await getClientsServices();

      setServices(allServices);
      setLoading(false);
    }
    fetchServices();
  }, []);

  async function handleDelete(selectedRows) {
    const result = await deleteBulkClientsServices([...selectedRows.map((r) => r.id)]);
    const allServices = await getClientsServices();
    setServices(allServices);
  }

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Head>
        <title>Сервисы | Админ</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <TableToolbar title={"Сервисы"} link="/clients/services/add-service" />
          <DataTable data={services} columns={columns} handleDelete={handleDelete} />
        </Container>
      </Box>
    </>
  );
};

Services.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default WithAuth(Services);
