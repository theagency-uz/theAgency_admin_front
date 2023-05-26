import http from "./httpService";
import auth from "./auth";
import baseUrl from "../utils/endpoint";
async function getProducts() {
  try {
    const result = await http.get(baseUrl + "/products");
    return result.data;
  } catch (err) {
    return err.response;
  }
}
async function getPackageCodes() {
  try {
    const result = await http.get(baseUrl + "/products/packageCodes");
    return result.data;
  } catch (err) {
    return err.response;
  }
}
async function getProductsByPage({ itemPerPage, page, sort, filter = {} }) {
  try {
    const { data } = await http.post(
      baseUrl + "/products/page/" + itemPerPage + "/" + page + "/" + sort,
      { filter: filter }
    );
    return data;
  } catch (err) {
    console.log(err.response);
    return err.response;
  }
}

async function getProductsLimited({ number, sort }) {
  try {
    const { data } = await http.get(baseUrl + "/products/limit/" + number + "/" + sort);
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getProduct(id) {
  try {
    const { data } = await http.get(baseUrl + "/products/" + id);

    return data;
  } catch (err) {
    return err.response;
  }
}
async function getProductOfTheDay() {
  try {
    const { data } = await http.get(baseUrl + "/products/productOfTheDay");
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getCharacteristic(id) {
  try {
    const { data } = await http.get(baseUrl + "/products/characteristic/" + id);
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getProductVariationByProductId(id) {
  try {
    const { data } = await http.get(baseUrl + "/products/variation/product/" + id);
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getProductVariation(id) {
  try {
    const { data } = await http.get(baseUrl + "/products/variation/" + id);
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getProductVariationLastId() {
  try {
    const { data } = await http.get(baseUrl + "/products/variation/lastId");
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getProductByBrandId(brandId) {
  try {
    const { data } = await http.get(baseUrl + "/products/brand/" + brandId);
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getProductBySlug(slug) {
  try {
    const { data } = await http.get(baseUrl + "/products/slug/" + slug);

    return data;
  } catch (err) {
    return err.response;
  }
}
async function getProductVariationTypes() {
  try {
    const { data } = await http.get(baseUrl + "/products/variation-type");
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getProductVariationType(id) {
  try {
    const { data } = await http.get(baseUrl + "/products/variation-type/" + id);
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getProductVariationTypeItems() {
  try {
    const { data } = await http.get(baseUrl + "/products/variation-type-item");
    return data;
  } catch (err) {
    return err.response;
  }
}

async function getProductVariationTypeItemsLastId() {
  try {
    const { data } = await http.get(baseUrl + "/products/variation-type-item/lastId");
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getProductVariationTypeItem(id) {
  try {
    const { data } = await http.get(baseUrl + "/products/variation-type-item/" + id);
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getProductVariationTypeItemByTypeId(id) {
  try {
    const { data } = await http.get(baseUrl + "/products/variation-type-item/type/" + id);
    return data;
  } catch (err) {
    return err.response;
  }
}

async function getCategories() {
  try {
    const { data } = await http.get(baseUrl + "/products/category");
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getTypes() {
  try {
    const { data } = await http.get(baseUrl + "/products/type");
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getSpecificationByTypeId(id) {
  try {
    const { data } = await http.get(baseUrl + "/products/type/specification/" + id);
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getSpecificationLastId() {
  try {
    const { data } = await http.get(baseUrl + "/products/type/specification/lastId");
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getCharacteristics() {
  try {
    const { data } = await http.get(baseUrl + "/products/characteristic");
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getCategory(id) {
  try {
    const { data } = await http.get(baseUrl + "/products/category/" + id);
    return data;
  } catch (err) {
    return err.response;
  }
}
async function getType(id) {
  try {
    const { data } = await http.get(baseUrl + "/products/type/" + id);
    return data;
  } catch (err) {
    return err.response;
  }
}
async function addCategory({ name, slug, image }) {
  try {
    const formData = new FormData();
    formData.append("name", JSON.stringify(name));
    formData.append("slug", slug);
    formData.append("image", image.file);
    const { data } = await http.post(baseUrl + "/products/category", formData);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function addType({ name, slug, specifications }) {
  try {
    const formData = new FormData();
    formData.append("name", JSON.stringify(name));
    formData.append("slug", slug);
    specifications.map((specification) => {
      formData.append("specifications", JSON.stringify(specification));
    });
    const { data } = await http.post(baseUrl + "/products/type", formData);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function addCharacteristic({ name }) {
  try {
    const formData = new FormData();
    formData.append("name", JSON.stringify(name));
    const { data } = await http.post(baseUrl + "/products/characteristic", formData);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function addVariationType({ name }) {
  try {
    const formData = new FormData();
    formData.append("name", JSON.stringify(name));
    const { data } = await http.post(baseUrl + "/products/variation-type", formData);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function addVariationTypeItem({ items, variationTypeId }) {
  try {
    const formData = new FormData();
    if (!Array.isArray(items)) {
      items = [items];
    }
    items.forEach((i) => {
      formData.append("items", JSON.stringify(i));
      if (i.image?.file) {
        formData.append("imageVariationItem", i.image.file);
      } else {
        formData.append("imageVariationItem", i.image);
      }
    });
    formData.append("variationTypeId", variationTypeId);
    const { data } = await http.post(baseUrl + "/products/variation-type-item", formData);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}

async function addProduct({
  name,
  slug,
  price,
  discount,
  artikul,
  isHidden,
  productOfTheDay,
  brand,
  category,
  type,
  specification,
  description,
  details,
  images,
  pyramid,
  createdAt,
  packageCodeId,
  isDiscountable
}) {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("artikul", artikul);
    formData.append("isHidden", isHidden);
    formData.append("productOfTheDay", productOfTheDay);
    formData.append("brandId", brand);
    formData.append("productCategoryId", category);
    formData.append("createdAt", createdAt);
    formData.append("description", JSON.stringify(description));
    formData.append("details", JSON.stringify(details));
    formData.append("typeId", type.id);
    formData.append("packageCodeId", packageCodeId);
    formData.append("isDiscountable", isDiscountable);
    specification.forEach((s) => {
      formData.append("specifications", s.id);
    });
    pyramid.forEach((p) => {
      formData.append("pyramid", JSON.stringify(p));
    });
    images.forEach((image) => {
      formData.append("images", JSON.stringify(image));
    });
    images.forEach((image) => {
      if (image.file) {
        formData.append("imageProduct", image.file);
      }
    });
    const result = await http.post(baseUrl + "/products", formData);

    return result;
  } catch (err) {
    return err.response;
  }
}

async function addProductVariation({ variations, productId }) {
  try {
    const formData = new FormData();
    formData.append("productId", productId);
    variations.forEach((v) => {
      let sendData;
      if (String(v.id).startsWith("new")) {
        sendData = {
          name: v.name,
          price: v.price,
          discount: v.discount,
          artikul: v.artikul,
          productVariationTypeItemId: v.typeItem?.id || v.productVariationTypeItemId,
          order: v.order,
          isHidden: v.isHidden,
          images: v.images.map(i => JSON.stringify(i))
        };
      } else {
        sendData = {
          id: v.id,
          name: v.name,
          price: v.price,
          discount: v.discount,
          artikul: v.artikul,
          productVariationTypeItemId: v.typeItem?.id || v.productVariationTypeItemId,
          order: v.order,
          isHidden: v.isHidden,
          images: v.images.map(i => JSON.stringify(i))
        };

      }
      formData.append("variation", JSON.stringify(sendData));
    });

    for (let i = 0; i < variations.length; i++) {
      variations[i].images.forEach((i) => {
        if (i.file) {
          formData.append("imageProductVariation", i.file);
        }
      });
    }

    const result = await http.post(baseUrl + "/products/variation", formData);
    return result;
  } catch (err) {
    return err.response;
  }
}

async function updateProduct({
  id,
  name,
  slug,
  price,
  discount,
  artikul,
  isHidden,
  brand,
  category,
  type,
  specification,
  description,
  details,
  images,
  productOfTheDay,
  pyramid,
  packageCodeId,
  createdAt,
  isDiscountable
}) {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("artikul", artikul);
    formData.append("isHidden", isHidden);
    formData.append("productOfTheDay", productOfTheDay);
    formData.append("brandId", brand);
    formData.append("productCategoryId", category);
    formData.append("createdAt", createdAt);
    formData.append("description", JSON.stringify(description));
    formData.append("details", JSON.stringify(details));
    formData.append("typeId", type.id);
    formData.append("packageCodeId", packageCodeId);
    formData.append("isDiscountable", isDiscountable);
    specification.forEach((s) => {
      formData.append("specifications", s.id);
    });
    pyramid.forEach((p) => {
      formData.append("pyramid", JSON.stringify(p));
    });
    images.forEach((image) => {
      formData.append("images", JSON.stringify(image));
    });
    images.forEach((image) => {
      if (image.file) {
        formData.append("imageProduct", image.file);
      }
    });
    const result = await http.put(baseUrl + "/products/" + id, formData);
    return result;
  } catch (err) {
    return err.response;
  }
}

async function updateCategory({ id, name, slug, image }) {
  try {
    const formData = new FormData();
    formData.append("name", JSON.stringify(name));
    formData.append("slug", slug);
    if (image.file) {
      formData.append("image", image.file);
    } else {
      formData.append("imagePath", image);
    }
    const result = await http.put(baseUrl + "/products/category/" + id, formData);
    return result;
  } catch (err) {
    return err.response;
  }
}
async function updateType({ id, name, slug, specifications }) {
  try {
    const formData = new FormData();
    formData.append("name", JSON.stringify(name));
    formData.append("slug", slug);
    specifications.map((specification) => {
      formData.append("specifications", JSON.stringify(specification));
    });
    const { data } = await http.put(baseUrl + "/products/type/" + id, formData);
    return data;
  } catch (err) {
    return err.response;
  }
}
async function updateCharacteristic({ id, name }) {
  try {
    const formData = new FormData();
    formData.append("name", JSON.stringify(name));
    const result = await http.put(baseUrl + "/products/characteristic/" + id, formData);
    return result;
  } catch (err) {
    return err.response;
  }
}
async function updateVariationType({ name, id }) {
  try {
    const formData = new FormData();
    formData.append("name", JSON.stringify(name));
    const { data } = await http.put(baseUrl + "/products/variation-type/" + id, formData);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function deleteProduct(id) {
  try {
    const { data } = await http.delete(baseUrl + "/products/" + id);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function deleteProductVariation(id) {
  try {
    const { data } = await http.delete(baseUrl + "/products/variation/" + id);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function deleteProductBulk(ids) {
  try {
    const result = await http.post(baseUrl + "/products/delete", { ids: ids });
    return result;
  } catch (err) {
    return err.response;
  }
}
async function deleteProductVariationTypeItem(id) {
  try {
    const result = await http.delete(baseUrl + "/products/variation-type-item/" + id);
    return result;
  } catch (err) {
    return err.response;
  }
}

async function deleteCategory(id) {
  try {
    const { data } = await http.delete(baseUrl + "/products/category/" + id);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function deleteType(id) {
  try {
    const { data } = await http.delete(baseUrl + "/products/type/" + id);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function deleteProductCharacteristic(id) {
  try {
    const { data } = await http.delete(baseUrl + "/products/characteristic/" + id);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function deleteVariationType(id) {
  try {
    const { data } = await http.delete(baseUrl + "/products/variation-type/" + id);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function deleteBulkProductCategory(ids) {
  try {
    const result = await http.post(baseUrl + "/products/category/delete", {
      ids: ids,
    });
    return result;
  } catch (err) {
    return err.response;
  }
}
async function deleteBulkProductType(ids) {
  try {
    const result = await http.post(baseUrl + "/products/type/delete", {
      ids: ids,
    });
    return result;
  } catch (err) {
    return err.response;
  }
}
async function deleteBulkProductCharacteristic(ids) {
  try {
    const result = await http.post(baseUrl + "/products/characteristic/delete", {
      ids: ids,
    });
    return result;
  } catch (err) {
    return err.response;
  }
}
async function deleteBulkProductVariationType(ids) {
  try {
    const result = await http.post(baseUrl + "/products/variation-type/delete", {
      ids: ids,
    });
    return result;
  } catch (err) {
    return err.response;
  }
}
async function incrementViews(productId) {
  try {
    const formData = new FormData();
    formData.append("productId", productId);
    const { data } = await http.post(baseUrl + "/products/views", formData);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}
async function clearViews({ productId }) {
  try {
    const formData = new FormData();
    formData.append("productId", productId);
    const { data } = await http.post(baseUrl + "/products/views/clear", formData);
    data.status = 200;
    return data;
  } catch (err) {
    return err.response;
  }
}


async function productMassOperation({
  data
}) {
  try {
    const formData = new FormData();

    formData.append("products", JSON.stringify(data));

    const result = await http.post(baseUrl + "/products/price-import", formData);

    return result;
  } catch (err) {
    return err.response;
  }
}
async function productMassImport({
  data
}) {
  try {
    const formData = new FormData();

    // formData.append("products", JSON.stringify(data));

    for (let i = 0; i < data.length; i++) {
      formData.append("products", JSON.stringify(data[i]));
    }

    const result = await http.post(baseUrl + "/products/import", formData);

    return result;
  } catch (err) {

    return err;
  }
}

export {
  productMassOperation,
  productMassImport,
  getPackageCodes,
  getProducts,
  getProductsByPage,
  getProductsLimited,
  getProductOfTheDay,
  getProduct,
  getCharacteristic,
  getProductByBrandId,
  getProductBySlug,
  getCategories,
  getCategory,
  getTypes,
  getCharacteristics,
  getType,
  getSpecificationByTypeId,
  getSpecificationLastId,
  getProductVariation,
  getProductVariationLastId,
  getProductVariationByProductId,
  getProductVariationTypes,
  getProductVariationType,
  getProductVariationTypeItems,
  getProductVariationTypeItemsLastId,
  getProductVariationTypeItem,
  getProductVariationTypeItemByTypeId,
  addProduct,
  addProductVariation,
  addType,
  addCharacteristic,
  addCategory,
  addVariationType,
  addVariationTypeItem,
  updateProduct,
  updateCategory,
  updateType,
  updateCharacteristic,
  updateVariationType,
  deleteProduct,
  deleteProductCharacteristic,
  deleteProductVariation,
  deleteProductBulk,
  deleteProductVariationTypeItem,
  deleteCategory,
  deleteVariationType,
  deleteType,
  deleteBulkProductCategory,
  deleteBulkProductType,
  deleteBulkProductCharacteristic,
  deleteBulkProductVariationType,
  incrementViews,
  clearViews,
};
