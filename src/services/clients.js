import http from "./httpService";
import baseUrl from "../utils/endpoint";

async function getClients() {
  try {
    const result = await http.get(baseUrl + "/clients");
    return result.data;
  } catch (err) {
    return err.response;
  }
}
async function getClientsAsAdmin() {
  try {
    const result = await http.get(baseUrl + "/clients/admin");
    return result.data;
  } catch (err) {
    return err.response;
  }
}
async function getClientsServices() {
  try {
    const result = await http.get(baseUrl + "/clients/service");
    return result.data;
  } catch (err) {
    return err.response;
  }
}
async function getClientById(id) {
  try {
    const result = await http.get(baseUrl + "/clients/" + id);
    return result.data;
  } catch (err) {
    return err.response;
  }
}
async function addClient({ title, image, order, service, isActive }) {
  try {
    const formData = new FormData();
    formData.append("title", JSON.stringify(title));
    formData.append("order", order);
    if (image.file) {
      formData.append("image", image.file);
    }
    service?.forEach((c) => {
      formData.append("service", c.id);
    });
    formData.append("isActive", isActive);
    const result = await http.post(baseUrl + "/clients", formData);
    return result;
  } catch (err) {
    return err.response;
  }
}
async function addClientsServices({ name, slug }) {
  console.log(name, slug);
  try {
    const result = await http.post(baseUrl + "/clients/service", {
      name: JSON.stringify(name),
      slug,
    });
    return result;
  } catch (err) {
    return err.response;
  }
}
async function updateClients({ id, title, image, order, service, isActive }) {
  console.log(title);
  try {
    const formData = new FormData();
    formData.append("name", JSON.stringify(title));
    formData.append("order", order);

    if (image.file) {
      formData.append("image", image.file);
    } else {
      formData.append("image", image);
    }

    service.forEach((c) => {
      formData.append("service", c.id);
    });
    formData.append("isActive", isActive);
    const result = await http.put(baseUrl + "/clients/" + id, formData);
    return result;
  } catch (err) {
    return err.response;
  }
}
async function deleteClient(id) {
  try {
    const { data } = await http.delete(baseUrl + "/clients/" + id);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function deleteBulkClient(ids) {
  console.log(ids);
  try {
    const result = await http.post(baseUrl + "/clients/bulk/", {
      ids: ids,
    });
    return result;
  } catch (err) {
    return err.response;
  }
}
async function deleteClientsServices(id) {
  try {
    const { data } = await http.delete(baseUrl + "/clients/service/" + id);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function deleteBulkClientsServices(ids) {
  try {
    const result = await http.patch(baseUrl + "/clients/service/bulk/", {
      ids: ids,
    });
    return result;
  } catch (err) {
    return err.response;
  }
}
async function getClientsServicesById(id) {
  try {
    const result = await http.get(baseUrl + "/clients/service/" + id);
    return result.data;
  } catch (err) {
    return err.response;
  }
}
async function updateClientsServices({ id, name, slug }) {
  try {
    const result = await http.put(baseUrl + "/clients/service/" + id, {
      name: JSON.stringify(name),
      slug,
    });
    return result;
  } catch (err) {
    return err.response;
  }
}

export {
  getClients,
  getClientsAsAdmin,
  getClientsServices,
  getClientById,
  addClient,
  addClientsServices,
  deleteClient,
  deleteBulkClient,
  deleteClientsServices,
  deleteBulkClientsServices,
  getClientsServicesById,
  updateClientsServices,
  updateClients,
};
