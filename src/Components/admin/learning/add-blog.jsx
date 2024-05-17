import { useState, useEffect, lazy, Suspense } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Tab,
  TextareaAutosize,
  Autocomplete,
  Zoom,
  FormControlLabel,
  Switch,
  CircularProgress,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import Flag from "src/Components/admin/common/flag";
import ImageUpload from "src/Components/admin/common/imageUpload";

import { TabContext, TabList } from "@mui/lab";
import AddIcon from "@mui/icons-material/Add";
import Loading from "src/Components/common/Loading";
import ArticleBlock from "./articleBlock";
import Sortable from "../common/sortable";

const AddBlog = ({ handleSubmit, blog, categories }) => {
  const router = useRouter();
  const [formLoading, setFormLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(blog?.previewImage || "");

  const [blocks, setBlocks] = useState(blog?.learning_blocks || []);

  const [categoryOptions, setCategoryOptions] = useState(
    categories.map((c) => {
      return { label: c.name.ru, id: c.id };
    }) || []
  );
  const formik = useFormik({
    initialValues: {
      nameRu: blog?.name?.ru || "",
      nameUz: blog?.name?.uz || "",

      slug: blog?.slug || "",
      category: categoryOptions.find((c) => c.id === blog?.learningCategoryId),
      isActive: blog?.isActive || false,
      isNewPage: (blog?.isNewPage === false ? false : blog?.isNewPage) || false,
    },
    validationSchema: Yup.object({
      nameRu: Yup.string().max(255).required("Название ru обязательное поле"),
      nameUz: Yup.string().max(255).required("Название uz обязательное поле"),
      slug: Yup.string().max(255).required("Ссылка обязательное поле"),

      category: Yup.object().required("Категория обязательное поле"),
      isActive: Yup.boolean(),
      isNewPage: Yup.boolean(),
    }),
    validateOnChange: (e) => {},

    onSubmit: async ({ nameRu, nameUz, slug, category, isActive, isNewPage }) => {
      setFormLoading(true);
      const result = await handleSubmit({
        isNewPage,
        name: { ru: nameRu, uz: nameUz },
        slug,
        previewImage,
        category: category.id,
        isActive: isActive,
        blocks: blocks,
      });
      setFormLoading(false);
      // if (result.status === 400) {
      //   result.data.forEach((r) => {
      //     formik.errors[r["param"]] = r["msg"];
      //   });
      //   return;
      // }
      if (result.status === 200) {
        toast.success(blog ? "Статья обновлена!" : "Статья создана!");
        if (result.id) {
          router.push(`/learning/add-blog?id=${result.id}`);
        }
      } else {
        console.log(result?.data || result);
        toast.error(result?.data);
      }
    },
  });

  const [value, setValue] = useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function handleAddBlock() {
    setBlocks((tempBlocks) => [
      ...tempBlocks,
      {
        id: `new-${tempBlocks.length + 1}`,
        name: { ru: "", uz: "" },
        slug: "",
        description: { ru: "", uz: "" },
        order: tempBlocks.length > 0 ? Math.max(...tempBlocks.map((b) => b.order)) + 1 : 0,
      },
    ]);
  }

  function handleEditBlock({ value, name, index, lang = "" }) {
    setBlocks((tempBlocks) => {
      return [
        ...tempBlocks.slice(0, index),
        {
          ...tempBlocks[index],
          [name]: lang ? { ...tempBlocks[index][name], [lang]: value } : value,
        },
        ...tempBlocks.slice(index + 1),
      ];
    });
  }
  function handleSortBlock(tempBlocks) {
    setBlocks(
      tempBlocks.map((b, index) => {
        return { ...b, order: index };
      })
    );
  }

  function handleDeleteBlock(index) {
    setBlocks((blocks) => [...blocks.slice(0, index), ...blocks.slice(index + 1)]);
  }

  return (
    <Suspense fallback={<Loading />}>
      <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
        <Card sx={{ overflow: "visible", position: "relative" }}>
          <CardHeader subheader={blog ? "Редактировать статью" : "Создать статью"} title="Статья" />
          <Divider />
          <CardContent>
            {blog ? (
              <Box>
                <a href={"/learning/preview?slug=" + blog?.slug} target="_blank" rel="noreferrer">
                  <Button sx={{ fontSize: "20px" }}>
                    <LinkIcon sx={{ marginRight: "10px" }} /> Превью статьи
                  </Button>
                </a>
              </Box>
            ) : null}
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.isActive}
                  onChange={(e, value) => formik.setFieldValue("isActive", value)}
                  name="isActive"
                />
              }
              label="Активный"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.isNewPage}
                  onChange={(e, value) => formik.setFieldValue("isNewPage", value)}
                  name="isNewPage"
                />
              }
              label="Открывать новую страницу"
            />
            <Autocomplete
              disablePortal
              id="category-select"
              options={categoryOptions}
              sx={{ width: 500, marginBottom: "20px" }}
              onBlur={formik.handleBlur}
              value={formik.values.category}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(e, newValue) => {
                formik.setFieldValue("category", newValue);
              }}
              renderInput={(params) => <TextField {...params} label="Категория" />}
            />

            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box sx={{}}>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                    sx={{
                      backgroundColor: "rgba(0,0,0,0.1)",
                      width: "fit-content",
                      borderRadius: "8px",
                    }}
                  >
                    <Tab icon={<Flag code="RU" />} value="1" />
                    <Tab icon={<Flag code="UZ" />} value="2" />
                  </TabList>
                </Box>

                <Zoom in={value == 1} value="1" hidden={value != "1"}>
                  <Box>
                    <TextField
                      error={Boolean(formik.touched.nameRu && formik.errors.nameRu)}
                      fullWidth
                      helperText={formik.touched.nameRu && formik.errors.nameRu}
                      label="Название ru"
                      margin="normal"
                      name="nameRu"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.nameRu}
                      variant="outlined"
                      inputProps={{}}
                    />
                  </Box>
                </Zoom>
                <Zoom in={value == 2} value="2" hidden={value != "2"}>
                  <Box>
                    <TextField
                      error={Boolean(formik.touched.nameUz && formik.errors.nameUz)}
                      fullWidth
                      helperText={formik.touched.nameUz && formik.errors.nameUz}
                      label="Название uz"
                      margin="normal"
                      name="nameUz"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.nameUz}
                      variant="outlined"
                      inputProps={{}}
                    />
                  </Box>
                </Zoom>
              </TabContext>
            </Box>

            <TextField
              error={Boolean(formik.touched.slug && formik.errors.slug)}
              fullWidth
              helperText={formik.touched.slug && formik.errors.slug}
              label="Ссылка"
              margin="normal"
              name="slug"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.slug}
              variant="outlined"
              sx={{ resize: "vertical" }}
            />
            <Box
              sx={{
                display: "flex",
                marginBottom: "20px",
              }}
            >
              <ImageUpload
                image={previewImage}
                onChange={(file) => setPreviewImage({ file: file })}
                title={"Загрузить картинку превью"}
              />
            </Box>

            <Button onClick={handleAddBlock}>
              <AddIcon />
            </Button>

            <Sortable
              items={blocks}
              setItems={setBlocks}
              handleAdd={handleAddBlock}
              Component={ArticleBlock}
              handleChange={handleEditBlock}
              handleDelete={handleDeleteBlock}
              handleSort={handleSortBlock}
            />

            {/* <Box sx={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {blocks.map((block, index) => (
                <ArticleBlock
                  key={block.id}
                  block={block}
                  handleEditBlock={handleEditBlock}
                  handleDeleteBlock={handleDeleteBlock}
                  index={index}
                />
              ))}
              {blocks.length > 0 && (
                <Button onClick={handleAddBlock}>
                  <AddIcon />
                </Button>
              )}
            </Box> */}
          </CardContent>

          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 2,
            }}
          >
            <Button
              color="primary"
              variant="contained"
              type="submit"
              sx={{
                display: "flex",
                gap: "5px",

                position: "fixed",
                top: "10px",
                right: "160px",
                zIndex: 1101,
              }}
            >
              {blog ? "Обновить" : "Создать"}
              {formLoading && <CircularProgress sx={{ color: "#fff" }} size={20} />}
            </Button>
          </Box>
        </Card>
      </form>
    </Suspense>
  );
};

export default AddBlog;
