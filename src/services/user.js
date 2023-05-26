import http from "./httpService";
import auth from "./auth";
import baseUrl from "../utils/endpoint";
async function getAllUsers() {
  try {
    const { data } = await http.get(baseUrl + "/users");
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getRoles() {
  try {
    const { data } = await http.get(baseUrl + "/users/roles");
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getRole(id) {
  try {
    const { data } = await http.get(baseUrl + "/users/roles/" + id);
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getUser(id) {
  try {
    const { data } = await http.get(baseUrl + "/users/" + id);
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getProductsFavorite() {
  try {
    const { data } = await http.get(baseUrl + "/users/product");
    return data;
  } catch (err) {
    return err.response;
  }
}
async function addProductsFavorite(products) {
  try {
    const result = await http.post(baseUrl + "/users/product", { products: products });
    return result;
  } catch (err) {
    return err.response;
  }
}

async function getProductsBag() {
  try {
    const { data } = await http.get(baseUrl + "/users/bag");
    return data;
  } catch (err) {
    return err.response;
  }
}
async function addProductsBag(bag) {
  try {
    const result = await http.post(baseUrl + "/users/bag", { bag: bag });
    return result;
  } catch (err) {
    return err.response;
  }
}

async function register({
  name,
  image,
  email,
  phone,
  city,
  address,
  password,
  confirmPassword,
  roleId,
}) {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("city", city);
    formData.append("address", JSON.stringify(address));
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    if (image.file) {
      formData.append("image", image.file);
    } else {
      formData.append("image", image);
    }
    formData.append("userRoleId", roleId);
    const result = await http.post(baseUrl + "/users", formData);

    return result;
  } catch (err) {
    return err.response;
  }
}
async function addRole({ name, createAdmin, create, read, update, del }) {
  try {
    const result = await http.post(baseUrl + "/users/roles", {
      name: name,
      createAdmin: createAdmin ? 1 : 0,
      create: create ? 1 : 0,
      read: read ? 1 : 0,
      update: update ? 1 : 0,
      del: del ? 1 : 0,
    });
    return result;
  } catch (err) {
    return err.response;
  }
}
async function updateUser({
  id,
  name,
  email,
  phone,
  city,
  address,
  password,
  confirmPassword,
  roleId,
  image,
}) {
  try {
    const formData = new FormData();
    if (id) {
      formData.append("id", id);
    }
    if (password) {
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);
    }
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("city", city);
    formData.append("address", JSON.stringify(address));
    if (image.file) {
      formData.append("image", image.file);
    }
    formData.append("image", image);
    formData.append("userRoleId", roleId);
    const result = await http.put(baseUrl + "/users", formData);
    // const result = await auth.login({ email: data.email, password: password });
    // window.location.reload();

    return result;
  } catch (err) {
    return err.response;
  }
}
async function updatePassword({ password, confirmPassword }) {
  try {
    const formData = new FormData();
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    const result = await http.put(baseUrl + "/users/password", formData);
    return result;
  } catch (err) {
    return err.response;
  }
}
async function updateAuthUser({ name, city, address }) {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("city", city);
    formData.append("address", JSON.stringify(address));
    const result = await http.put(baseUrl + "/users/me", formData);
    // const result = await auth.login({ email: data.email, password: password });
    // window.location.reload();

    return result;
  } catch (err) {
    return err.response;
  }
}
async function updateRole({ id, name, createAdmin, create, read, update, del }) {
  try {
    const result = await http.put(baseUrl + "/users/roles/" + id, {
      name: name,
      createAdmin: createAdmin ? 1 : 0,
      create: create ? 1 : 0,
      read: read ? 1 : 0,
      update: update ? 1 : 0,
      del: del ? 1 : 0,
    });
    return result;
  } catch (err) {
    return err.response;
  }
}
async function updateTimeout({ timeout }) {
  try {
    const result = await http.post(baseUrl + "/users/timeout", { timeout: timeout });
    const { data } = await http.post(baseUrl + "/auth/newJwt");
    auth.loginWithJwt(data);
    // window.location.reload();
    return { status: 200 };
  } catch (err) {
    return err.response;
  }
}

async function deleteUser(id) {
  try {
    const result = await http.delete(baseUrl + "/users/" + id);
    return result;
  } catch (err) {
    return err.response;
  }
}
async function deleteRole(id) {
  try {
    const result = await http.delete(baseUrl + "/users/roles/" + id);
    return result;
  } catch (err) {
    return err.response;
  }
}
async function deleteUserBulk(ids) {
  try {
    const result = await http.delete(baseUrl + "/users/delete", { ids: ids });
    return result;
  } catch (err) {
    return err.response;
  }
}
async function deleteBulkRole(ids) {
  try {
    const result = await http.delete(baseUrl + "/users/roles/delete", { ids: ids });
    return result;
  } catch (err) {
    return err.response;
  }
}

export {
  getAllUsers,
  getRoles,
  getRole,
  getUser,
  getProductsFavorite,
  addProductsFavorite,
  getProductsBag,
  addProductsBag,
  addRole,
  register,
  updateAuthUser,
  updateUser,
  updatePassword,
  updateRole,
  updateTimeout,
  deleteUser,
  deleteRole,
  deleteUserBulk,
  deleteBulkRole,
};
