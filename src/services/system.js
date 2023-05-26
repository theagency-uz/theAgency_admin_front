import http from "./httpService";
import auth from "./auth";
import baseUrl from "../utils/endpoint";
async function getSystemArray() {
  try {
    const { data } = await http.get(baseUrl + "/system/array");
    return data;
  } catch (err) {
    return err.response;
  }
}

async function getSystem() {
  try {
    const result = await http.get(baseUrl + "/system")
    return result.data;
  } catch (err) {
    console.log("err: ", err);
    return err.response;
  }
}
async function getPlaceholder() {
  try {
    const { data } = await http.get(baseUrl + "/system/placeholder");
    return data.value;
  } catch (err) {
    return err.response;
  }
}
async function postSystem(system) {
  try {
    const formData = new FormData();
    system.map((sys) => {
      if (sys.imageFile) {
        formData.append(sys.name, sys.imageFile);
      } else if (sys.value !== null) {
        formData.append(sys.name, sys.value);
      }
    });
    const result = await http.post(baseUrl + "/system", formData);
    return result;
  } catch (err) {
    return err.response;
  }
}

export { getSystem, getSystemArray, getPlaceholder, postSystem };
