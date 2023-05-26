import http from "./httpService";
import auth from "./auth";
import baseUrl from "../utils/endpoint";
async function getBrands() {
  try {
    const { data } = await http.get(baseUrl + "/brands");
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getBrandByName({ name, itemPerPage, page }) {
  try {
    const { data } = await http.post(baseUrl + "/brands/search", {
      name: name,
      itemPerPage,
      page: page,
    });
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getBrandsLimited(number) {
  try {
    const { data } = await http.get(baseUrl + "/brands/limit/" + number);
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getBrandsByPage({ itemPerPage, page }) {
  try {
    const { data } = await http.get(baseUrl + "/brands/page/" + itemPerPage + "/" + page);
    return data;
  } catch (err) {
    return err.response;
  }
}

async function getBrandsByLetter({ letter }) {
  try {
    const { data } = await http.get(baseUrl + "/brands/letter/" + letter);
    return data;
  } catch (err) {
    return err.response;
  }
}

async function getBrand(id) {
  try {
    const { data } = await http.get(baseUrl + "/brands/" + id);
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getBrandBySlug(slug) {
  try {
    const { data } = await http.get(baseUrl + "/brands/slug/" + slug);
    return data;
  } catch (err) {
    // return err.response;
  }
}
async function addBrand({ name, slug, isExclusive, isForbidden, description, details, image, bannerMobile, bannerDesktop }) {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("isExclusive", isExclusive);
    formData.append("isForbidden", isForbidden);
    formData.append("description", JSON.stringify(description));
    formData.append("details", JSON.stringify(details));
    formData.append("image", image.file);
    formData.append("bannerMobile", bannerMobile.file);
    formData.append("bannerDesktop", bannerDesktop.file);
    const { data } = await http.post(baseUrl + "/brands", formData);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function updateBrand({ id, name, slug, isExclusive, isForbidden, description, details, image, bannerMobile, bannerDesktop }) {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("isExclusive", isExclusive);
    formData.append("isForbidden", isForbidden);
    formData.append("description", JSON.stringify(description));
    formData.append("details", JSON.stringify(details));
    if (image.file) {
      formData.append("image", image.file);
    } else {
      formData.append("image", image);

    }
    if (bannerMobile.file) {
      formData.append("bannerMobile", bannerMobile.file);
    } else {
      formData.append("bannerMobile", bannerMobile);

    }
    if (bannerDesktop.file) {
      formData.append("bannerDesktop", bannerDesktop.file);
    } else {
      formData.append("bannerDesktop", bannerDesktop);

    }

    const { data } = await http.put(baseUrl + "/brands/" + id, formData);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function deleteBrand(id) {
  try {
    const { data } = await http.delete(baseUrl + "/brands/" + id);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function deleteBrandBulk(ids) {
  try {
    const result = await http.post(baseUrl + "/brands/delete", { ids: ids });
    return result;
  } catch (err) {
    return err.response;
  }
}

export {
  getBrands,
  getBrandByName,
  getBrandsLimited,
  getBrandsByPage,
  getBrandsByLetter,
  addBrand,
  getBrand,
  getBrandBySlug,
  updateBrand,
  deleteBrand,
  deleteBrandBulk,
};
