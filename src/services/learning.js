import http from "./httpService";
import auth from "./auth";
import baseUrl from "../utils/endpoint";

async function getLearningsAsAdmin() {
  try {
    const { data } = await http.get(baseUrl + "/learning/admin");
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getLearnings() {
  try {
    const { data } = await http.get(baseUrl + "/learning");
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getLearningsLimited({ limit }) {
  try {
    const { data } = await http.get(baseUrl + "/learning/limit/" + limit);
    return data;
  } catch (err) {
    return err.response;
  }
}

async function getLearningsByPage({ page, limit }) {
  try {
    const { data } = await http.get(baseUrl + "/learning/page/" + page + "/" + limit);
    return data;
  } catch (err) {
    return err.response;
  }
}

async function getLearningCategories() {
  try {
    const { data } = await http.get(baseUrl + "/learning/category");
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getLearning(id) {
  try {
    const { data } = await http.get(baseUrl + "/learning/" + id);
    return data;
  } catch (err) {
    if (err.response?.status === 404) {
      return null;
    }
    return err.response;
  }
}
async function getLearningAsAdmin(id) {
  try {
    const { data } = await http.get(baseUrl + "/learning/admin/" + id);
    return data;
  } catch (err) {
    if (err.response?.status === 404) {
      return null;
    }
    return err.response;
  }
}
async function getLearningBySlugAsAdmin(slug) {
  try {
    const { data } = await http.get(baseUrl + "/learning/admin/slug/" + slug);
    return data;
  } catch (err) {
    if (err.response?.status === 404) {
      return null;
    }
    return err.response;
  }
}
async function getLearningBySlug(slug) {
  try {
    const { data } = await http.get(baseUrl + "/learning/slug/" + slug);
    return data;
  } catch (err) {
    if (err.response?.status === 404) {
      return null;
    }
    return err.response;
  }
}
async function getLearningCategory(id) {
  try {
    const { data } = await http.get(baseUrl + "/learning/category/" + id);
    return data;
  } catch (err) {
    return err.response;
  }
}
async function addLearning({
  name,
  slug,
  shortDescription,
  fullDescription,
  previewImage,
  category,
  userId,
  isActive,
  isTg,
  tgDescription,
  isNewPage,
  blocks
}) {
  try {
    const formData = new FormData();
    formData.append("name", JSON.stringify(name));
    formData.append("slug", slug);
    formData.append("isActive", isActive);
    formData.append("isTg", isTg);
    formData.append("userId", userId);
    formData.append("articleCategoryId", category);
    formData.append("shortDescription", JSON.stringify(shortDescription));
    formData.append("fullDescription", JSON.stringify(fullDescription));
    formData.append("tgDescription", JSON.stringify(tgDescription));
    formData.append("isNewPage", isNewPage);

    for (let i = 0; i < blocks.length; i++) {
      formData.append("blocks", JSON.stringify(blocks[i]));
    }

    if (previewImage.file) {
      formData.append("previewImage", previewImage.file);
    } else {
      formData.append("previewImage", previewImage);
    }

    const { data } = await http.post(baseUrl + "/learning", formData);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function addLearningCategory({ name, slug }) {
  try {
    const formData = new FormData();
    formData.append("name", JSON.stringify(name));
    formData.append("slug", slug);
    const { data } = await http.post(baseUrl + "/learning/category", formData);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}

async function updateLearning({
  id,
  name,
  slug,
  shortDescription,
  fullDescription,
  previewImage,
  category,
  userId,
  isActive,
  isTg,
  tgDescription,
  isNewPage,
  blocks
}) {
  try {
    const formData = new FormData();
    formData.append("name", JSON.stringify(name));
    formData.append("slug", slug);
    formData.append("isActive", isActive);
    formData.append("isTg", isTg);
    formData.append("isNewPage", isNewPage);
    formData.append("userId", userId);
    formData.append("articleCategoryId", category);
    formData.append("shortDescription", JSON.stringify(shortDescription));
    formData.append("fullDescription", JSON.stringify(fullDescription));
    formData.append("tgDescription", JSON.stringify(tgDescription));

    for (let i = 0; i < blocks.length; i++) {
      formData.append("blocks", JSON.stringify(blocks[i]));
    }

    if (previewImage.file) {
      formData.append("previewImage", previewImage.file);
    } else {
      formData.append("previewImage", previewImage);
    }

    const { data } = await http.put(baseUrl + "/learning/" + id, formData);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function updateLearningCategory({ id, name, slug }) {
  try {
    const formData = new FormData();
    formData.append("name", JSON.stringify(name));
    formData.append("slug", slug);
    const { data } = await http.put(baseUrl + "/learning/category/" + id, formData);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function deleteLearning(id) {
  try {
    const { data } = await http.delete(baseUrl + "/learning/" + id);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function deleteBulkLearning(ids) {
  try {
    const result = await http.post(baseUrl + "/learning/delete", {
      ids: ids,
    });
    return result;
  } catch (err) {
    return err.response;
  }
}
async function deleteLearningCategory(id) {
  try {
    const { data } = await http.delete(baseUrl + "/learning/category/" + id);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function deleteBulkLearningCategory(ids) {
  try {
    const result = await http.post(baseUrl + "/learning/category/delete", {
      ids: ids,
    });
    return result;
  } catch (err) {
    return err.response;
  }
}
async function incrementViews(articleId) {
  try {
    const formData = new FormData();
    formData.append("articleId", articleId);
    const { data } = await http.post(baseUrl + "/learning/views", formData);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function clearViews({ articleId }) {
  try {
    const formData = new FormData();
    formData.append("articleId", articleId);
    const { data } = await http.post(baseUrl + "/learning/views/clear", formData);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}

export {
  getLearningAsAdmin,
  getLearningsAsAdmin,
  getLearnings,
  getLearningsLimited,
  getLearningsByPage,
  getLearning,
  getLearningBySlug,
  getLearningBySlugAsAdmin,
  getLearningCategories,
  addLearning,
  addLearningCategory,
  getLearningCategory,
  updateLearning,
  updateLearningCategory,
  deleteLearning,
  deleteBulkLearning,
  deleteLearningCategory,
  deleteBulkLearningCategory,
  incrementViews,
  clearViews,
};
