import http from "./httpService";
// import mailingUrl from "../utils/endpoint";
const mailingUrl = "http://192.168.0.132:5000"

async function getMailings({ limit = 10, page = 1 } = { limit: 10, page: 1 }) {
    try {
        const result = await http.get(mailingUrl + "/post", { params: { limit, page } });
        return result.data;
    } catch (err) {
        return err.response;
    }
}
async function getMailingById(id) {
    try {
        const result = await http.get(mailingUrl + "/post/" + id);
        return result.data;
    } catch (err) {
        return err.response;
    }
}
async function deleteMailing(id) {
    try {
        const result = await http.delete(mailingUrl + "/post/" + id);
        return result.data;
    } catch (err) {
        return err.response;
    }
}
async function addMailing({ textRu, textUz, image, video }) {
    try {
        const formData = new FormData();
        formData.append("text", JSON.stringify({ ru: textRu, uz: textUz }))
        if (image) {
            formData.append("image", (image))
        } else if (video) {
            formData.append("video", (video))
        }

        const result = await http.post(mailingUrl + "/post", formData);

        return result;
    } catch (err) {
        return err.response;
    }
}
async function updateMailing({ id, textRu, textUz, image, video }) {
    try {
        const formData = new FormData();
        formData.append("text", JSON.stringify({ ru: textRu, uz: textUz }))
        if (image) {
            formData.append("image", (image))
        } else if (video) {
            formData.append("video", (video))
        }

        const result = await http.put(mailingUrl + "/post/" + id, formData);

        return result;
    } catch (err) {
        return err.response;
    }
}
async function getBotUsers({ limit = 10, page = 1, search = "" } = { limit: 10, page: 1, search: "" }) {
    try {
        const result = await http.get(mailingUrl + "/user", { params: { limit, page, search } });
        return result.data;
    } catch (err) {
        return err.response;
    }
}

async function sendMailings(id) {
    try {
        const formData = new FormData();
        formData.append("userIds", "all")
        formData.append("postId", id)
        const result = await http.post(mailingUrl + "/post/send", formData);
        return result;
    } catch (err) {
        return err.response;
    }
}

export {
    getBotUsers,
    getMailings,
    addMailing,
    getMailingById,
    updateMailing,
    deleteMailing,
    sendMailings
};
