import http from "./httpService";
import auth from "./auth";
import baseUrl from "../utils/endpoint";
async function getMainPage() {
  try {
    const { data } = await http.get(baseUrl + "/main");
    return data;
  } catch (err) {
    return err.response;
  }
}

export { getMainPage };
