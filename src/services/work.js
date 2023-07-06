import http from "./httpService";
import baseUrl from "../utils/endpoint";

async function getWorks() {
    try {
        const result = await http.get(baseUrl + "/work");
        return result.data;
    } catch (err) {
        return err.response;
    }
}
async function getWorkCategories() {
    try {
        const result = await http.get(baseUrl + "/work/category");
        return result.data;
    } catch (err) {
        return err.response;
    }
}
async function getWorkById(id) {
    try {
        const result = await http.get(baseUrl + "/work/" + id);
        return result.data;
    } catch (err) {
        return err.response;
    }
}
async function getWorkBySlug(slug) {
    try {
        const result = await http.get(baseUrl + "/work/slug/" + slug);
        return result.data;
    } catch (err) {
        return err.response;
    }
}
async function getWorkBySlugAsAdmin(slug) {
    try {
        const result = await http.get(baseUrl + "/work/admin/slug/" + slug);
        return result.data;
    } catch (err) {
        return err.response;
    }
}
async function getWorkCategoryById(id) {
    try {
        const result = await http.get(baseUrl + "/work/category/" + id);
        return result.data;
    } catch (err) {
        return err.response;
    }
}
async function addWork({
    name,
    slug,
    description,
    image,
    type,
    order,
    category,
    isActive,
    isNewPage }) {
    try {
        const formData = new FormData();
        formData.append("name", JSON.stringify(name));
        formData.append("slug", slug);
        formData.append("type", type);
        formData.append("order", order);
        formData.append("description", JSON.stringify(description));

        if (image.file) {
            formData.append("image", image.file);
        }

        category.forEach(c => {
            formData.append("category", c.id);
        });

        formData.append("isActive", isActive);
        formData.append("isNewPage", isNewPage);
        const result = await http.post(baseUrl + "/work", formData);
        return result;
    } catch (err) {
        return err.response;
    }
}
async function addWorkCategory({ name, slug }) {
    try {
        const result = await http.post(baseUrl + "/work/category", {
            name: JSON.stringify(name), slug
        });
        return result;
    } catch (err) {
        return err.response;
    }
}
async function updateWork({
    id,
    name,
    slug,
    description,
    image,
    type,
    order,
    category,
    isActive,
    isNewPage }) {
    try {
        const formData = new FormData();
        formData.append("name", JSON.stringify(name));
        formData.append("slug", slug);
        formData.append("type", type);
        formData.append("order", order);
        formData.append("description", JSON.stringify(description));

        if (image.file) {
            formData.append("image", image.file);
        } else {
            formData.append("image", image);

        }

        category.forEach(c => {
            formData.append("category", c.id);
        });
        formData.append("isActive", isActive);
        formData.append("isNewPage", isNewPage);
        const result = await http.put(baseUrl + "/work/" + id, formData);
        return result;
    } catch (err) {
        return err.response;
    }
}
async function updateWorkCategory({ id, name, slug }) {
    try {
        const result = await http.put(baseUrl + "/work/category/" + id, {
            name: JSON.stringify(name), slug
        });
        return result;
    } catch (err) {
        return err.response;
    }
}

async function deleteWork(id) {
    try {
        const { data } = await http.delete(baseUrl + "/work/" + id);
        data.status = 200;
        return data;
    } catch (err) {
        return err.response;
    }
}
async function deleteBulkWork(ids) {
    try {
        const result = await http.delete(baseUrl + "/work/bulk", {
            ids: ids,
        });
        return result;
    } catch (err) {
        return err.response;
    }
}
async function deleteWorkCategory(id) {
    try {
        const { data } = await http.delete(baseUrl + "/work/category/" + id);
        data.status = 200;
        return data;
    } catch (err) {
        return err.response;
    }
}
async function deleteBulkWorkCategory(ids) {
    try {
        const result = await http.delete(baseUrl + "/work/category/bulk", {
            ids: ids,
        });
        return result;
    } catch (err) {
        return err.response;
    }
}

export {
    getWorks,
    getWorkById,
    getWorkBySlug,
    getWorkBySlugAsAdmin,
    getWorkCategories,
    getWorkCategoryById,
    addWorkCategory,
    addWork,
    updateWorkCategory,
    updateWork,
    deleteWork,
    deleteBulkWork,
    deleteWorkCategory,
    deleteBulkWorkCategory
};
