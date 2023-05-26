import http from "./httpService";
import baseUrl from "../utils/endpoint";
async function getActions() {
    try {
        const { data } = await http.get(baseUrl + "/tgAction");
        return data;
    } catch (err) {
        return err.response;
    }
}
async function getAction(id) {
    try {
        const { data } = await http.get(baseUrl + "/tgAction/" + id);
        return data;
    } catch (err) {
        return err.response;
    }
}

async function addAction({ title, description, isActive }) {
    try {

        const result = await http.post(baseUrl + "/tgAction", { title, description, isActive });
        return result;
    } catch (err) {
        return err.response;
    }
}
async function updateAction({ id, title, description, isActive }) {
    try {

        const result = await http.put(baseUrl + "/tgAction/" + id, { title, description, isActive });
        return result;
    } catch (err) {
        return err.response;
    }
}
async function deleteAction({ id }) {
    try {

        const result = await http.delete(baseUrl + "/tgAction/" + id);
        return result;
    } catch (err) {
        return err.response;
    }
}

export { getActions, getAction, addAction, updateAction, deleteAction };
