import Head from "next/head";
import { Box, Container, Grid } from "@mui/material";

import { Budget } from "src/Components/admin/dashboard/budget";
import { LatestOrders } from "src/Components/admin/dashboard/latest-orders";
import { LatestProducts } from "src/Components/admin/dashboard/latest-products";
import { Sales } from "src/Components/admin/dashboard/sales";
import { TasksProgress } from "src/Components/admin/dashboard/tasks-progress";
import { TotalCustomers } from "src/Components/admin/dashboard/total-customers";
import { DashboardLayout } from "src/layout/admin";
import Loading from "src/Components/common/Loading";

import WithAuth from "src/HOC/withAuth";
import { getCompletedOrders, getOrders } from "src/services/order";
import { useEffect, useState } from "react";
import { getAllUsers } from "src/services/user";
import { getProductsLimited } from "src/services/product";

const Dashboard = ({ system, ...props }) => {
  const [orders, setOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [totalPrice, setTotalPrice] = useState();
  const [totalPriceLastMonth, setTotalPriceLastMonth] = useState();
  const [totalPriceCurrentMonth, setTotalPriceCurrentMonth] = useState();
  const [totalUsersLastMonth, setTotalUsersLastMonth] = useState();
  const [totalUsersCurrentMonth, setTotalUsersCurrentMonth] = useState();
  const [progress, setProgress] = useState();
  const [products, setProducts] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchAll() {
      let currentMonth = new Date().getMonth();
      let currentYear = new Date().getFullYear();
      let tempOrders = await getOrders();
      let tempCompletedOrders = await getCompletedOrders();
      let tempUsers = await getAllUsers();
      let tempProducts = await getProductsLimited({ number: 8, sort: "new" });
      tempUsers = tempUsers.filter((user) => user.userRoleId === 3);
      let tempTotalPrice = 0;
      let tempTotalPriceLastMonth = 0;
      let tempTotalPriceCurrentMonth = 0;
      let tempTotalUsersLastMonth = 0;
      let tempTotalUsersCurrentMonth = 0;
      let tempProgress = 0;
      tempOrders.forEach((order) => {
        if (order.statusId === 1) {//в обработке
          tempProgress += 1;
        }
        if (order.statusId === 5) { //завершен
          let tempOrderMonth = new Date(order.createdAt).getMonth();
          let tempOrderYear = new Date(order.createdAt).getFullYear();
          tempTotalPrice += order.totalPrice;
          if ((currentMonth === 0 && tempOrderMonth === 11 && currentYear === tempOrderYear + 1) || (tempOrderMonth + 1 === currentMonth && currentYear === tempOrderYear)) {
            tempTotalPriceLastMonth += order.totalPrice;
          }
          if (tempOrderMonth === currentMonth && currentYear === tempOrderYear) {
            tempTotalPriceCurrentMonth += order.totalPrice;
          }
        }
      });
      tempUsers.forEach((user) => {
        let tempUserMoth = new Date(user.createdAt).getMonth();
        let tempUserYear = new Date(user.createdAt).getFullYear();
        if ((currentMonth === 0 && tempUserMoth === 11 && currentYear === tempUserYear + 1) || (tempUserMoth + 1 === currentMonth && currentYear === tempUserYear)) {
          tempTotalUsersLastMonth += 1;
        }
        if (tempUserMoth === currentMonth && currentYear === tempUserYear) {
          tempTotalUsersCurrentMonth += 1;
        }
      });
      tempProgress = 100 - Math.round((tempProgress / tempOrders.length) * 100);
      setOrders(tempOrders);
      setCompletedOrders(tempCompletedOrders);
      setUsers(tempUsers);
      setTotalPrice(tempTotalPrice);
      setTotalPriceLastMonth(tempTotalPriceLastMonth);
      setTotalPriceCurrentMonth(tempTotalPriceCurrentMonth);
      setTotalUsersLastMonth(tempTotalUsersLastMonth);
      setTotalUsersCurrentMonth(tempTotalUsersCurrentMonth);
      setProgress(tempProgress);
      setProducts(tempProducts);
      setLoading(false);

    };
    fetchAll();
  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Head>
        <title>Дашборд | Parfum Galleryt</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <Budget
                totalPrice={totalPrice}
                totalPriceLastMonth={totalPriceLastMonth}
                totalPriceCurrentMonth={totalPriceCurrentMonth}
              />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TotalCustomers
                users={users}
                totalUsersCurrentMonth={totalUsersCurrentMonth}
                totalUsersLastMonth={totalUsersLastMonth}
              />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TasksProgress progress={progress} />
            </Grid>
            <Grid item lg={8} md={12} xl={9} xs={12}>
              <Sales completedOrders={completedOrders} orders={orders} />
            </Grid>
            <Grid item lg={4} md={6} xl={3} xs={12}>
              {/* <TrafficByDevice sx={{ height: "100%" }} /> */}
            </Grid>
            <Grid item lg={4} md={6} xl={3} xs={12}>
              <LatestProducts sx={{ height: "100%" }} products={products} placeholder={system.image_placeholder} />
            </Grid>
            <Grid item lg={8} md={12} xl={9} xs={12}>
              <LatestOrders orders={orders.length <= 10 ? orders : orders.slice(0, 10)} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};



Dashboard.getLayout = (page) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default WithAuth(Dashboard);
