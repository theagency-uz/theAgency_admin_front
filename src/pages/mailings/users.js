import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { Box, Button, Container, Avatar } from "@mui/material";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { DashboardLayout } from "src/layout";
import TableToolbar from "src/Components/admin/common/table-toolbar";
import DataTable from "src/Components/admin/common/datatables";
import Loading from "src/Components/common/Loading";

import { imageBaseUrl } from "src/utils/endpoint";

import WithAuth from "src/HOC/withAuth";

import { getAllUsers, deleteUser, deleteUserBulk } from "src/services/user";

const Users = () => {

    const columns = useMemo(
        () => [
            {
                name: "Картинка",
                selector: (row) => row.imageUrl,
                cell: (row) =>
                    row.imageUrl ? (
                        <img
                            src={imageBaseUrl + row.imageUrl}
                            width="50"
                            height="50"
                            style={{ objectFit: "contain", borderRadius: "50%" }}
                        />
                    ) : (
                        <Avatar>{row.name ? row.name[0] : ""}</Avatar>
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
                name: "Имя",
                selector: (row) => row.name,
                grow: 2,
                sortable: true,
            },
            {
                grow: 2,
                name: "Email",
                selector: (row) => row.email,
                sortable: true,
            },
            {
                grow: 0,
                name: "Роль",
                selector: (row) => row.user_role.name,
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
                        const check = confirm("Удалить пользователя?");
                        if (check) {
                            await deleteUser(row.id);
                            const updatedUsers = await getAllUsers();
                            setUsers([...updatedUsers]);
                        }
                    };
                    return (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Link href={`/users/add-user?id=${row.id}`} passHref>
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

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchUsers = async () => {
            const allUsers = await getAllUsers();
            setUsers(allUsers);
            setLoading(false);
        };
        fetchUsers();
    }, []);

    async function handleSearch(e) {
        const value = e.target.value;
        const allUsers = await getAllUsers();
        const searchedUsers = [];
        allUsers.forEach((user) => {
            if (user.id.toString().toLowerCase().includes(value.toLowerCase())) {
                searchedUsers.push(user);
            } else if (user.name.toString().toLowerCase().includes(value.toLowerCase())) {
                searchedUsers.push(user);
            } else if (user.city.toString().toLowerCase().includes(value.toLowerCase())) {
                searchedUsers.push(user);
            } else if (user.phone.toString().toLowerCase().includes(value.toLowerCase())) {
                searchedUsers.push(user);
            } else if (user.user_role.name.toString().toLowerCase().includes(value.toLowerCase())) {
                searchedUsers.push(user);
            } else if (user.createdAt.toString().toLowerCase().includes(value.toLowerCase())) {
                searchedUsers.push(user);
            } else if (user.updatedAt.toString().toLowerCase().includes(value.toLowerCase())) {
                searchedUsers.push(user);
            }
        });
        setUsers(searchedUsers);
        return "search";
    }
    async function handleDelete(selectedRows) {
        const result = await deleteUserBulk([...selectedRows.map((r) => r.id)]);
        const users = await getAllUsers();
        setUsers(users);
    }

    if (loading) {
        return <Loading />;
    }
    return (
        <>
            <Head>
                <title>Пользователи | Material Kit</title>
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
                        title={"Пользователи"}
                        hasAdd={false}
                    />
                    <DataTable data={users} columns={columns} handleDelete={handleDelete} />
                </Container>
            </Box>
        </>
    );
};
Users.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;




export default WithAuth(Users);
