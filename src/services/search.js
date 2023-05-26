import http from "./httpService";
import auth from "./auth";
import baseUrl from "../utils/endpoint";
async function getSearch({ searchString, path }) {
  if (searchString) {
    try {
      const formData = new FormData();
      formData.append("path", path);
      formData.append("searchString", searchString);
      const { data } = await http.post(baseUrl + "/search", formData);
      return data;
    } catch (err) {
      return err.response;
    }
  }
}

export { getSearch };
