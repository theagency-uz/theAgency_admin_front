import http from "./httpService";
import auth from "./auth";
import baseUrl from "../utils/endpoint";
async function getArticlesAsAdmin() {
  try {
    const { data } = await http.get(baseUrl + "/articles/admin");
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getArticles() {
  try {
    const { data } = await http.get(baseUrl + "/articles");
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getArticlesLimited({ limit }) {
  try {
    const { data } = await http.get(baseUrl + "/articles/limit/" + limit);
    return data;
  } catch (err) {
    return err.response;
  }
}

async function getArticlesByPage({ page, limit }) {
  try {
    const { data } = await http.get(baseUrl + "/articles/page/" + page + "/" + limit);
    return data;
  } catch (err) {
    return err.response;
  }
}

async function getArticleCategories() {
  try {
    const { data } = await http.get(baseUrl + "/articles/category");
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getArticle(id) {
  try {
    const { data } = await http.get(baseUrl + "/articles/" + id);
    return data;
  } catch (err) {
    if (err.response?.status === 404) {
      return null;
    }
    return err.response;
  }
}
async function getArticleAsAdmin(id) {
  try {
    const { data } = await http.get(baseUrl + "/articles/admin/" + id);
    return data;
  } catch (err) {
    if (err.response?.status === 404) {
      return null;
    }
    return err.response;
  }
}
async function getArticleBySlugAsAdmin(slug) {
  try {
    const { data } = await http.get(baseUrl + "/articles/admin/slug/" + slug);
    return data;
  } catch (err) {
    if (err.response?.status === 404) {
      return null;
    }
    return err.response;
  }
}
async function getArticleBySlug(slug) {
  try {
    const { data } = await http.get(baseUrl + "/articles/slug/" + slug);
    return data;
  } catch (err) {
    if (err.response?.status === 404) {
      return null;
    }
    return err.response;
  }
}
async function getArticleCategory(id) {
  try {
    const { data } = await http.get(baseUrl + "/articles/category/" + id);
    return data;
  } catch (err) {
    return err.response;
  }
}
async function addArticle({
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

    const { data } = await http.post(baseUrl + "/articles", formData);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function addArticleCategory({ name, slug }) {
  try {
    const formData = new FormData();
    formData.append("name", JSON.stringify(name));
    formData.append("slug", slug);
    const { data } = await http.post(baseUrl + "/articles/category", formData);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function updateArticle({
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

    const { data } = await http.put(baseUrl + "/articles/" + id, formData);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function updateArticleCategory({ id, name, slug }) {
  try {
    const formData = new FormData();
    formData.append("name", JSON.stringify(name));
    formData.append("slug", slug);
    const { data } = await http.put(baseUrl + "/articles/category/" + id, formData);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function deleteArticle(id) {
  try {
    const { data } = await http.delete(baseUrl + "/articles/" + id);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function deleteBulkArticle(ids) {
  try {
    const result = await http.post(baseUrl + "/articles/delete", {
      ids: ids,
    });
    return result;
  } catch (err) {
    return err.response;
  }
}
async function deleteArticleCategory(id) {
  try {
    const { data } = await http.delete(baseUrl + "/articles/category/" + id);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function deleteBulkArticleCategory(ids) {
  try {
    const result = await http.post(baseUrl + "/articles/category/delete", {
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
    const { data } = await http.post(baseUrl + "/articles/views", formData);
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
    const { data } = await http.post(baseUrl + "/articles/views/clear", formData);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}

export {
  getArticleAsAdmin,
  getArticlesAsAdmin,
  getArticles,
  getArticlesLimited,
  getArticlesByPage,
  getArticle,
  getArticleBySlug,
  getArticleBySlugAsAdmin,
  getArticleCategories,
  addArticle,
  addArticleCategory,
  getArticleCategory,
  updateArticle,
  updateArticleCategory,
  deleteArticle,
  deleteBulkArticle,
  deleteArticleCategory,
  deleteBulkArticleCategory,
  incrementViews,
  clearViews,
};
