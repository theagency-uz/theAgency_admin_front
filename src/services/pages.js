import http from "./httpService";
import auth from "./auth";
import baseUrl from "../utils/endpoint";
async function getPages() {
  try {
    const { data } = await http.get(baseUrl + "/pages");
    return data;
  } catch (err) {
    return err.response;
  }
}

async function getPage(name) {
  try {
    const { data } = await http.get(baseUrl + "/pages/" + name);
    return data;
  } catch (err) {
    return err.response;
  }
}

async function getPageByPageName(page) {
  try {
    const { data } = await http.get(baseUrl + "/pages/page/" + page);
    return data;
  } catch (err) {
    return err.response;
  }
}

async function updatePage({ name, page, value, images }) {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("page", page);
    formData.append("value", JSON.stringify(value));
    if (page === "main" && name === "slider") {
      value.forEach((v) => {

        if (v.imageMobileRu?.file) {
          formData.append("imageMobileRu", v.imageMobileRu.file);
        }
        if (v.imageDesktopRu?.file) {
          formData.append("imageDesktopRu", v.imageDesktopRu.file);
        }
        if (v.imageMobileUz?.file) {
          formData.append("imageMobileUz", v.imageMobileUz.file);
        }
        if (v.imageDesktopUz?.file) {
          formData.append("imageDesktopUz", v.imageDesktopUz.file);
        }
        if (v.imageMobileEn?.file) {
          formData.append("imageMobileEn", v.imageMobileEn.file);
        }
        if (v.imageDesktopEn?.file) {
          formData.append("imageDesktopEn", v.imageDesktopEn.file);
        }

      });
    }
    if (page === "contact") {
      value.forEach((v) => {
        if (v.image?.file) {
          formData.append("imagePage", v.image.file);
        }
      });
    }
    if (page === "main" && name === "banner") {
      for (const b in value) {
        if (value[b].imageMobileRu?.file) {
          formData.append("imageMobileRu", value[b].imageMobileRu.file);
        }
        if (value[b].imageDesktopRu?.file) {
          formData.append("imageDesktopRu", value[b].imageDesktopRu.file);
        }
        if (value[b].imageMobileUz?.file) {
          formData.append("imageMobileUz", value[b].imageMobileUz.file);
        }
        if (value[b].imageDesktopUz?.file) {
          formData.append("imageDesktopUz", value[b].imageDesktopUz.file);
        }
        if (value[b].imageMobileEn?.file) {
          formData.append("imageMobileEn", value[b].imageMobileEn.file);
        }
        if (value[b].imageDesktopEn?.file) {
          formData.append("imageDesktopEn", value[b].imageDesktopEn.file);
        }


      }
    }

    const { data } = await http.put(baseUrl + "/pages/" + name, formData);
    data.status = 200;
    return data;
  } catch (err) {
    console.log(err);
    return err.response;
  }
}
async function addPage({ name, page, value, images }) {
  try {
    const formData = new FormData();
    formData.append("page", page);
    formData.append("value", value);
    formData.append("value", value);
    images.forEach((image) => {
      formData.append("imagePage", image);
    });
    const { data } = await http.put(baseUrl + "/pages/" + name, formData);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}

export { getPages, getPage, getPageByPageName, addPage, updatePage };
