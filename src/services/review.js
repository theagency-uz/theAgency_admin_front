import http from "./httpService";
import auth from "./auth";
import baseUrl from "../utils/endpoint";
async function getReviews() {
  try {
    const { data } = await http.get(baseUrl + "/review");
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getReview(reviewId) {
  try {
    const { data } = await http.get(baseUrl + "/review/" + reviewId);
    return data;
  } catch (err) {
    return err.response;
  }
}
async function postReview({ text, file, name, phone }) {
  try {
    const formData = new FormData();
    formData.append("text", text);
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("file", file);
    const result = await http.post(baseUrl + "/review", formData);

    return result;
  } catch (err) {
    return err.response;
  }
}
async function deleteReview(id) {
  try {
    const result = await http.delete(baseUrl + "/review/" + id);
    return result;
  } catch (err) {
    return err.response;
  }
}
async function deleteReviewsBulk(ids) {
  try {
    const result = await http.post(baseUrl + "/review/delete", { ids: ids });
    return result;
  } catch (err) {
    return err.response;
  }
}

export { getReviews, getReview, postReview, deleteReview, deleteReviewsBulk };
