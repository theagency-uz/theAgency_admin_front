import http from "./httpService";
import auth from "./auth";
import baseUrl from "../utils/endpoint";
async function getOrders() {
  try {
    const { data } = await http.get(baseUrl + "/orders");
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getCompletedOrders() {
  try {
    const { data } = await http.get(baseUrl + "/orders/completed");
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getStatuses() {
  try {
    const { data } = await http.get(baseUrl + "/orders/status");
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getPaymentTypes() {
  try {
    const { data } = await http.get(baseUrl + "/orders/payment");
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getOrder(id) {
  try {
    const { data } = await http.get(baseUrl + "/orders/" + id);
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getStatus(id) {
  try {
    const { data } = await http.get(baseUrl + "/orders/status/" + id);
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getPaymentType(id) {
  try {
    const { data } = await http.get(baseUrl + "/orders/payment/" + id);
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getOrderByUserId() {
  try {
    const { data } = await http.get(baseUrl + "/orders/user");
    return data;
  } catch (err) {
    return err.response;
  }
}

async function updateOrder({
  id,
  userPhone,
  paymentType,
  totalNumber,
  totalPrice,
  deliveryType,
  deliveryPrice,
  city,
  street,
  home,
  flat,
  code,
  products,
  branch,
}) {
  try {
    const formData = new FormData();
    formData.append("userPhone", userPhone);
    formData.append("paymentTypeId", paymentType.id);
    formData.append("deliveryType", deliveryType);
    formData.append("deliveryPrice", deliveryPrice);
    formData.append("city", city);
    formData.append("street", street);
    formData.append("home", home);
    formData.append("flat", flat);
    formData.append("code", code);
    formData.append("branch", branch);
    for (let i = 0; i < products.length; i++) {
      formData.append("products", JSON.stringify(products[i]));
    }
    const result = await http.put(baseUrl + "/orders/" + id, formData);
    return result;
  } catch (err) {
    return err.response;
  }
}
async function updateStatus({ id, name }) {
  try {
    const formData = new FormData();
    formData.append("name", JSON.stringify(name));
    const { data } = await http.put(baseUrl + "/orders/status/" + id, formData);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function updatePaymentType({ id, name, isActive }) {
  try {
    const formData = new FormData();
    formData.append("name", JSON.stringify(name));
    formData.append("isActive", isActive);
    const { data } = await http.put(baseUrl + "/orders/payment/" + id, formData);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}

async function orderCancel(orderId) {
  try {
    const result = await http.post(baseUrl + "/orders/cancel/" + orderId);
    return result;
  } catch (err) {
    return err.response;
  }
}
async function orderStatus({ orderId, statusId }) {
  try {
    const result = await http.post(baseUrl + "/orders/" + orderId + "/status", {
      statusId: statusId,
    });
    return result;
  } catch (err) {
    return err.response;
  }
}
async function addOrder({
  name,
  phone,
  delivery,
  city,
  street,
  home,
  flat,
  code,
  comment,
  coordinates,
  paymentTypeId,
  bag,
  userId,
  totalPrice,
  branch,
}) {
  try {
    const result = await http.post(baseUrl + "/orders", {
      name,
      phone,
      delivery,
      city,
      street,
      home,
      flat,
      code,
      comment,
      coordinates,
      paymentTypeId: paymentTypeId,
      bag: JSON.stringify(bag),
      userId,
      totalPrice,
      branch,
    });
    return result;
  } catch (err) {
    return err.response;
  }
}
async function addStatus({ name }) {
  try {
    const formData = new FormData();
    formData.append("name", JSON.stringify(name));
    const { data } = await http.post(baseUrl + "/orders/status", formData);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function addPaymentType({ name, isActive }) {
  try {
    const formData = new FormData();
    formData.append("name", JSON.stringify(name));
    formData.append("isActive", isActive);
    const { data } = await http.post(baseUrl + "/orders/payment", formData);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function deleteOrder(id) {
  try {
    const result = await http.delete(baseUrl + "/orders/" + id);
    return result;
  } catch (err) {
    return err.response;
  }
}
async function deleteStatus(id) {
  try {
    const { data } = await http.delete(baseUrl + "/orders/status/" + id);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function deletePaymentType(id) {
  try {
    const { data } = await http.delete(baseUrl + "/orders/payment/" + id);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function deleteBulkOrders(ids) {
  try {
    const { data } = await http.post(baseUrl + "/orders/delete", { ids: ids });
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function deleteBulkStatuses(ids) {
  try {
    const formData = new FormData();
    const { data } = await http.post(baseUrl + "/orders/status/delete", { ids: ids });
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function deleteBulkPaymentTypes(ids) {
  try {
    const formData = new FormData();
    const { data } = await http.post(baseUrl + "/orders/payment/delete", { ids: ids });
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}

export {
  getOrders,
  getCompletedOrders,
  getStatuses,
  getPaymentTypes,
  getOrder,
  getStatus,
  getPaymentType,
  getOrderByUserId,
  addOrder,
  addStatus,
  addPaymentType,
  updateOrder,
  updatePaymentType,
  updateStatus,
  deleteOrder,
  deleteStatus,
  deletePaymentType,
  deleteBulkOrders,
  deleteBulkStatuses,
  deleteBulkPaymentTypes,
  orderCancel,
  orderStatus,
};
