import http from "./httpService";
import auth from "./auth";
import baseUrl from "../utils/endpoint";
async function getFaq() {
  try {
    const { data } = await http.get(baseUrl + "/faq");
    return data;
  } catch (err) {
    return err.response;
  }
}
async function postFaq(faq) {
  try {
    const result = await http.post(baseUrl + "/faq", { faq: faq });
    return result;
  } catch (err) {
    return err.response;
  }
}

export { getFaq, postFaq };
