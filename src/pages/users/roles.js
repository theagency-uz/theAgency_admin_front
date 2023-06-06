import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { Box, Button, Container } from "@mui/material";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { DashboardLayout } from "src/layout";
import TableToolbar from "src/Components/admin/common/table-toolbar";
import DataTable from "src/Components/admin/common/datatables";
import Loading from "src/Components/common/Loading";

import WithAuth from "src/HOC/withAuth";

import { getRoles, deleteRole, deleteBulkRole } from "src/services/user";

const Roles = () => {
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
        selector: (row) => row.name,
        grow: 2,
        sortable: true,
      },
      {
        name: "Привилегии",
        selector: (row) => {
          let str = "";
          if (row.createAdmin) {
            str += "создание админа";
          }
          if (row.create) {
            str += ", создание";
          }
          if (row.read) {
            str += ", чтение";
          }
          if (row.update) {
            str += ", обновление";
          }
          if (row.delete) {
            str += " ,удаление";
          }
          str = str.replace(/^, /, "");
          return str;
        },
        grow: 2,
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
            const check = confirm("Удалить роль?");
            if (check) {
              await deleteRole(row.id);
              const updatedRoles = await getRoles();
              setRoles([...updatedRoles]);
            }
          };
          return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Link href={`/users/add-role?id=${row.id}`} passHref>
                <Button sx={{ padding: "5px" }}>
                  <EditIcon />
                </Button>
              </Link>
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

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchRoles = async () => {
      const allRoles = await getRoles();
      setRoles(allRoles);
      setLoading(false);
    };
    fetchRoles();
  }, []);

  async function handleSearch(e) {
    const value = e.target.value;
    const allRoles = await getRoles();
    const searchedRoles = [];
    allRoles.forEach((role) => {
      if (role.id.toString().toLowerCase().includes(value.toLowerCase())) {
        searchedRoles.push(role);
      } else if (role.name.toString().toLowerCase().includes(value.toLowerCase())) {
        searchedRoles.push(role);
      } else if (role.createdAt.toString().toLowerCase().includes(value.toLowerCase())) {
        searchedRoles.push(role);
      } else if (role.updatedAt.toString().toLowerCase().includes(value.toLowerCase())) {
        searchedRoles.push(role);
      }
    });
    setRoles(searchedRoles);
    return "search";
  }
  async function handleDelete(selectedRows) {
    const result = await deleteBulkRole([...selectedRows.map((r) => r.id)]);
    const roles = await getRoles();
    setRoles(roles);
  }

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Head>
        <title>Роли | Админ</title>
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
            title={"Роли"}
            link={"/users/add-role"}
          />
          <DataTable
            data={roles}
            columns={columns}
            handleDelete={handleDelete} />
        </Container>
      </Box>
    </>
  );
};




Roles.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default WithAuth(Roles);
