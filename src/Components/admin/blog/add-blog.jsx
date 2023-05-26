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
// import Editor from "src/Components/common/editor";

const Editor = lazy(() => import("src/Components/common/editor"), {
  ssr: false,
});

import { TabContext, TabList } from "@mui/lab";
import Link from "next/link";
import Loading from "src/Components/common/Loading";
import SunEditor from "src/Components/common/suneditor";

const AddBlog = ({ handleSubmit, blog, categories }) => {
  const router = useRouter();
  const [formLoading, setFormLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(blog?.previewImage || "");
  const [mainImage, setMainImage] = useState(blog?.mainImage || "");
  const [descriptionRu, setDescriptionRu] = useState(blog?.fullDescription.ru || []);
  const [descriptionUz, setDescriptionUz] = useState(blog?.fullDescription.uz || []);
  const [descriptionEn, setDescriptionEn] = useState(blog?.fullDescription.en || []);

  const [tgDescriptionRu, setTgDescriptionRu] = useState(blog?.tgDescription?.ru || "");
  const [tgDescriptionUz, setTgDescriptionUz] = useState(blog?.tgDescription?.uz || "");
  const [tgDescriptionEn, setTgDescriptionEn] = useState(blog?.tgDescription?.en || "");

  const [categoryOptions, setCategoryOptions] = useState(
    categories.map((c) => {
      return { label: c.name.ru, id: c.id };
    }) || []
  );
  const formik = useFormik({
    initialValues: {
      nameRu: blog?.name?.ru || "",
      nameUz: blog?.name?.uz || "",
      nameEn: blog?.name?.en || "",
      shortDescriptionRu: blog?.shortDescription?.ru || "",
      shortDescriptionUz: blog?.shortDescription?.uz || "",
      shortDescriptionEn: blog?.shortDescription?.en || "",
      slug: blog?.slug || "",
      category: categoryOptions.find((c) => c.id === blog?.articleCategoryId),
      isActive: blog?.isActive || false,
      isTg: blog?.isTg === false ? false : blog?.isTg || false,
      isNewPage: (blog?.isNewPage === false ? false : blog?.isNewPage) || false,
    },
    validationSchema: Yup.object({
      nameRu: Yup.string().max(255).required("Название ru обязательное поле"),
      nameUz: Yup.string().max(255).required("Название гя обязательное поле"),
      nameEn: Yup.string().max(255),
      slug: Yup.string().max(255).required("Ссылка обязательное поле"),
      shortDescriptionRu: Yup.string(),
      shortDescriptionUz: Yup.string(),
      shortDescriptionEn: Yup.string(),
      category: Yup.object().required("Категория обязательное поле"),
      isActive: Yup.boolean(),
      isTg: Yup.boolean(),
      isNewPage: Yup.boolean(),
    }),
    validateOnChange: (e) => {},

    onSubmit: async ({
      nameRu,
      nameUz,
      nameEn,
      slug,
      shortDescriptionRu,
      shortDescriptionUz,
      shortDescriptionEn,
      category,
      isActive,
      isTg,
      isNewPage,
    }) => {
      setFormLoading(true);
      const result = await handleSubmit({
        isTg,
        isNewPage,
        name: { ru: nameRu, uz: nameUz, en: nameEn },
        slug,
        shortDescription: {
          ru: shortDescriptionRu,
          uz: shortDescriptionUz,
          en: shortDescriptionEn,
        },
        fullDescription: { ru: descriptionRu, uz: descriptionUz, en: descriptionEn },
        tgDescription: { ru: tgDescriptionRu, uz: tgDescriptionUz, en: tgDescriptionEn },
        previewImage,
        mainImage,
        category: category.id,
        isActive: isActive,
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
          router.push(`/admin/blogs/add-blog?id=${result.id}`);
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
  const [shortTab, setShortTab] = useState("1");
  const shortTabChange = (event, newValue) => {
    setShortTab(newValue);
  };
  const [fullTab, setfullTab] = useState("1");
  const fullTabChange = (event, newValue) => {
    setfullTab(newValue);
  };

  return (
    <Suspense fallback={<Loading />}>
      <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
        <Card sx={{ overflow: "visible" }}>
          <CardHeader subheader={blog ? "Редактировать статью" : "Создать статью"} title="Статья" />
          <Divider />
          <CardContent>
            {blog ? (
              <Box>
                <a href={"/articles/preview/" + blog?.slug} target="_blank" rel="noreferrer">
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
                    <Tab icon={<Flag code="GB" />} value="3" />
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
                <Zoom in={value == 3} value="3" hidden={value != "3"}>
                  <Box>
                    <TextField
                      error={Boolean(formik.touched.nameEn && formik.errors.nameEn)}
                      fullWidth
                      helperText={formik.touched.nameEn && formik.errors.nameEn}
                      label="Название en"
                      margin="normal"
                      name="nameEn"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.nameEn}
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
              <ImageUpload
                image={mainImage}
                onChange={(file) => setMainImage(file ? { file: file } : "")}
                title={"Загрузить главную картинку"}
              />
            </Box>

            <Box sx={{ width: "100%", typography: "body1", marginBottom: "20px" }}>
              <TabContext value={shortTab}>
                <Box sx={{}}>
                  <TabList
                    onChange={shortTabChange}
                    aria-label="lab API tabs example"
                    sx={{
                      backgroundColor: "rgba(0,0,0,0.1)",
                      width: "fit-content",
                      borderRadius: "8px",
                    }}
                  >
                    <Tab icon={<Flag code="RU" />} value="1" />
                    <Tab icon={<Flag code="UZ" />} value="2" />
                    <Tab icon={<Flag code="GB" />} value="3" />
                  </TabList>
                </Box>

                <Zoom in={shortTab == 1} value="1" hidden={shortTab != "1"}>
                  <Box>
                    <TextareaAutosize
                      aria-label="Краткое описание"
                      placeholder="Краткое описание ru"
                      value={formik.values.shortDescriptionRu}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      name="shortDescriptionRu"
                      style={{
                        width: "100%",
                        minHeight: 100,
                        resize: "vertical",
                        border: "1px solid #E6E8F0",
                        borderRadius: "8px",
                        padding: "16.5px 14px",
                      }}
                    />
                  </Box>
                </Zoom>
                <Zoom in={shortTab == 2} value="2" hidden={shortTab != "2"}>
                  <Box>
                    <TextareaAutosize
                      aria-label="Краткое описание"
                      placeholder="Краткое описание uz"
                      value={formik.values.shortDescriptionUz}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      name="shortDescriptionUz"
                      style={{
                        width: "100%",
                        minHeight: 100,
                        resize: "vertical",
                        border: "1px solid #E6E8F0",
                        borderRadius: "8px",
                        padding: "16.5px 14px",
                      }}
                    />
                  </Box>
                </Zoom>
                <Zoom in={shortTab == 3} value="3" hidden={shortTab != "3"}>
                  <Box>
                    <TextareaAutosize
                      aria-label="Краткое описание"
                      placeholder="Краткое описание en"
                      value={formik.values.shortDescriptionEn}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      name="shortDescriptionEn"
                      style={{
                        width: "100%",
                        minHeight: 100,
                        resize: "vertical",
                        border: "1px solid #E6E8F0",
                        borderRadius: "8px",
                        padding: "16.5px 14px",
                      }}
                    />
                  </Box>
                </Zoom>
              </TabContext>
            </Box>

            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={fullTab}>
                <Box sx={{}}>
                  <TabList
                    onChange={fullTabChange}
                    aria-label="lab API tabs example"
                    sx={{
                      backgroundColor: "rgba(0,0,0,0.1)",
                      width: "fit-content",
                      borderRadius: "8px",
                    }}
                  >
                    <Tab icon={<Flag code="RU" />} value="1" />
                    <Tab icon={<Flag code="UZ" />} value="2" />
                    <Tab icon={<Flag code="GB" />} value="3" />
                  </TabList>
                </Box>
                <Zoom in={fullTab == 1} value={1} hidden={fullTab != 1}>
                  <Box sx={{ overflow: "visible" }}>
                    <SunEditor onChange={setDescriptionRu} value={descriptionRu} />
                    {/* <Editor lang={"ru"} onChange={setDescriptionRu} value={descriptionRu} /> */}
                  </Box>
                </Zoom>
                <Zoom in={fullTab == 2} value={2} hidden={fullTab != 2}>
                  <Box sx={{ overflow: "visible" }}>
                    <SunEditor onChange={setDescriptionUz} value={descriptionUz} />
                    {/* <Editor lang={"uz"} onChange={setDescriptionUz} value={descriptionUz} /> */}
                  </Box>
                </Zoom>
                <Zoom in={fullTab == 3} value={3} hidden={fullTab != 3}>
                  <Box sx={{ overflow: "visible" }}>
                    <SunEditor onChange={setDescriptionEn} value={descriptionEn} />
                    {/* <Editor lang={"en"} onChange={setDescriptionEn} value={descriptionEn} /> */}
                  </Box>
                </Zoom>
              </TabContext>
            </Box>

            <FormControlLabel
              control={
                <Switch checked={formik.values.isTg} onChange={formik.handleChange} name="isTg" />
              }
              label="Акция для телеграм бота"
            />

            <Box
              sx={{
                width: "100%",
                typography: "body1",
                display: formik.values.isTg ? "block" : "none",
              }}
            >
              <p>Описание</p>
              <p>
                * оберните текст в &lt;b&gt;<b>текст</b>&lt;/b&gt; - для жирности
              </p>
              <p>
                * оберните текст в &lt;i&gt;<i>текст</i>&lt;/i&gt; - для курсива
              </p>
              <p>
                * оберните текст в &lt;a href=&quot;ссылка&quot;&gt;<i>текст</i>&lt;/a&gt; - для
                ссылки
              </p>
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
                    <Tab icon={<Flag code="GB" />} value="3" />
                  </TabList>
                </Box>
                <Zoom in={value == 1} value={1} hidden={value != 1}>
                  <Box>
                    {/* <Editor lang={"ru"} onChange={setDescriptionRu} value={descriptionRu} /> */}
                    <TextareaAutosize
                      aria-label="empty textarea"
                      placeholder="Описание"
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        setTgDescriptionRu(e.target.value);
                      }}
                      value={tgDescriptionRu}
                      minRows="5"
                    />
                  </Box>
                </Zoom>
                <Zoom in={value == 2} value={2} hidden={value != 2}>
                  <Box>
                    {/* <Editor lang={"uz"} onChange={setDescriptionUz} value={descriptionUz} /> */}
                    <TextareaAutosize
                      aria-label="empty textarea"
                      placeholder="Описание"
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        setTgDescriptionUz(e.target.value);
                      }}
                      value={tgDescriptionUz}
                      minRows="5"
                    />
                  </Box>
                </Zoom>
                <Zoom in={value == 3} value={3} hidden={value != 3}>
                  <Box>
                    <TextareaAutosize
                      aria-label="empty textarea"
                      placeholder="Описание"
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        setTgDescriptionEn(e.target.value);
                      }}
                      value={tgDescriptionEn}
                      minRows="5"
                    />
                    {/* <Editor lang={"en"} onChange={setDescriptionEn} value={descriptionEn} /> */}
                  </Box>
                </Zoom>
              </TabContext>
            </Box>
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
              sx={{ display: "flex", gap: "5px" }}
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
