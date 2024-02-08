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

import WithAuth from "src/HOC/withAuth";

import { getBotUsers } from "src/services/mailing";

const Users = () => {
const [searchText, setSearchText] = useState("")
    const columns = useMemo(
        () => [
            {
                name: "Id",
                selector: (row) => row.id,
                sortable: true,
                grow: 0,
            },
            {
                name: "Имя",
                selector: (row) => row.tgName,
                grow: 2,
                sortable: true,
            },
            {
                grow: 2,
                name: "username",
                selector: (row) => row.username,
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
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchUsers = async () => {
            const allUsers = await getBotUsers({search: searchText});
            setUsers(allUsers?.users);
            setTotalRows(allUsers?.count)
            setLoading(false);
        };
        fetchUsers();
    }, [searchText]);

    const handlePageChange = async (page) => {
        const allUsers = await getBotUsers({ page: page, limit: perPage,search: searchText });
        setUsers(allUsers.users);
        setTotalRows(allUsers.count)

    };
    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);
        const response = await getBotUsers({ page: page, limit: newPerPage,search: searchText });
        setUsers(response.users);
        setPerPage(newPerPage);
        setTotalRows(response.count)
        setLoading(false);
    };

    async function handleSearch(e) {
        setSearchText(e.target.value)
        
        // const value = e.target.value;
        // const allUsers = await getBotUsers();
        // const searchedUsers = [];
        // allUsers?.users.forEach((user) => {
        //     if (user.id.toString().toLowerCase().includes(value.toLowerCase())) {
        //         searchedUsers.push(user);
        //     } else if (user.tgName.toString().toLowerCase().includes(value.toLowerCase())) {
        //         searchedUsers.push(user);
        //     } else if (user.username.toString().toLowerCase().includes(value.toLowerCase())) {
        //         searchedUsers.push(user);
        //     } else if (user.createdAt.toString().toLowerCase().includes(value.toLowerCase())) {
        //         searchedUsers.push(user);
        //     } else if (user.updatedAt.toString().toLowerCase().includes(value.toLowerCase())) {
        //         searchedUsers.push(user);
        //     }
        // });
        // setUsers(searchedUsers);
        return "search";
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
                    <DataTable
                        data={users}
                        columns={columns}
                        handleDelete={false}
                        isServer={true}
                        totalRows={totalRows}
                        handlePerRowsChange={handlePerRowsChange}
                        handlePageChange={handlePageChange} />
                </Container>
            </Box>
        </>
    );
};
Users.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;




export default WithAuth(Users);
