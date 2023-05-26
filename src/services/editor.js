import baseUrl from "../utils/endpoint";
import http from "./httpService";
async function postEditor(image) {
  try {
    const formData = new FormData();
    formData.append("editorImage", image);
    const result = await http.post(baseUrl + "/editor", formData);
    return result;
  } catch (err) {
    return err.response;
  }
}

export { postEditor };
