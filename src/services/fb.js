import http from "./httpService";
import auth from "./auth";
import baseUrl from "../utils/endpoint";
async function startOrdering() {
  try {
    const result = await http.post(baseUrl + "/fb");
    return result;
  } catch (err) {
    return err.response;
  }
}
async function fbSubscribe({ type, path }) {
  try {
    const result = await http.post(baseUrl + "/fb/subscribe", { type: type, path: path });
    return result;
  } catch (err) {
    return err.response;
  }
}
async function fbLocation({ location, path }) {
  try {
    const result = await http.post(baseUrl + "/fb/location", { path: path, location: location });
    return result;
  } catch (err) {
    return err.response;
  }
}
async function fbWishList({ product, path }) {
  try {
    const result = await http.post(baseUrl + "/fb/wishlist", { path: path, product: product });
    return result;
  } catch (err) {
    return err.response;
  }
}
async function fbAddBag({ path }) {
  try {
    const result = await http.post(baseUrl + "/fb/add-bag", { path: path });
    return result;
  } catch (err) {
    return err.response;
  }
}
async function fbContact({ path }) {
  try {
    const result = await http.post(baseUrl + "/fb/contact", { path: path });
    return result;
  } catch (err) {
    return err.response;
  }
}

export { startOrdering, fbSubscribe, fbLocation, fbWishList, fbAddBag, fbContact };
