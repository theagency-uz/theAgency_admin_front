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
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import Flag from "src/Components/admin/common/flag";
import ImageUpload from "src/Components/admin/common/imageUpload";

import { TabContext, TabList } from "@mui/lab";
import Link from "next/link";
import Loading from "src/Components/common/Loading";
import SunEditor from "src/Components/common/suneditor";

const AddWorkForm = ({ handleSubmit, work, categories }) => {
  const router = useRouter();
  const [formLoading, setFormLoading] = useState(false);
  const [image, setImage] = useState(work?.image || "");
  const [descriptionRu, setDescriptionRu] = useState(work?.description.ru || []);
  const [descriptionUz, setDescriptionUz] = useState(work?.description.uz || []);

  const [categoryOptions, setCategoryOptions] = useState(
    categories.map((c) => {
      return { label: c.name.ru, id: c.id };
    }) || []
  );
  const formik = useFormik({
    initialValues: {
      nameRu: work?.name?.ru || "",
      nameUz: work?.name?.uz || "",

      slug: work?.slug || "",
      type: work?.type || "",
      order: work?.order || 0,

      category:
        work?.spheres.length > 0
          ? categoryOptions.filter((c) => work?.spheres.some((w) => c.id === w.id))
          : [],
      isActive: work?.isActive || false,
      isNewPage: (work?.isNewPage === false ? false : work?.isNewPage) || false,
    },
    validationSchema: Yup.object({
      nameRu: Yup.string().max(255).required("Название ru обязательное поле"),
      nameUz: Yup.string().max(255).required("Название uz обязательное поле"),
      slug: Yup.string().max(255).required("Ссылка обязательное поле"),
      type: Yup.string().oneOf(["modal", "article", "link"]).required("Тип обязательное поле"),
      order: Yup.number().min(0, "Минимальное значение 0").required("Порядок обязательное поле"),

      category: Yup.array().required("Категория обязательное поле"),
      isActive: Yup.boolean(),
      isNewPage: Yup.boolean(),
    }),
    validate: async ({ type }) => {},

    onSubmit: async ({ nameRu, nameUz, slug, type, order, category, isActive, isNewPage }) => {
      setFormLoading(true);
      const result = await handleSubmit({
        isNewPage,
        name: { ru: nameRu, uz: nameUz },
        slug,
        type,
        order,
        description: {
          ru: descriptionRu,
          uz: descriptionUz,
        },
        image,
        category: category,
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
        toast.success(work ? "Работа обновлена!" : "Работа создана!");
        if (result.id) {
          router.push(`/works/add-work?id=${result.id}`);
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
          <CardHeader subheader={work ? "Редактировать работу" : "Создать статью"} title="Статья" />
          <Divider />
          <CardContent>
            {work ? (
              <Box>
                <a href={"/works/preview?slug=" + work?.slug} target="_blank" rel="noreferrer">
                  <Button sx={{ fontSize: "20px" }}>
                    <LinkIcon sx={{ marginRight: "10px" }} /> Превью работы
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
            <FormControl fullWidth>
              <FormLabel id="radio-buttons-type">Тип</FormLabel>
              <RadioGroup
                aria-labelledby="radio-buttons-type"
                name="type"
                value={formik.values.type}
                onChange={formik.handleChange}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                <FormControlLabel
                  value="modal"
                  control={<Radio />}
                  label="Модалка"
                  sx={{ width: "auto" }}
                />
                <FormControlLabel value="article" control={<Radio />} label="Статья" />
                <FormControlLabel value="link" control={<Radio />} label="Ссылка" />
              </RadioGroup>
            </FormControl>
            <TextField
              error={Boolean(formik.touched.order && formik.errors.order)}
              helperText={formik.touched.order && formik.errors.order}
              label="Порядок"
              margin="normal"
              name="order"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="number"
              value={formik.values.order}
              variant="outlined"
              sx={{ resize: "vertical" }}
              InputProps={{ inputProps: { min: 0 } }}
            />
            <Autocomplete
              multiple
              id="type-specifications"
              options={categoryOptions}
              sx={{ width: 500, marginBottom: "20px" }}
              getOptionLabel={(option) => option.label}
              value={formik.values.category}
              defaultValue={[]}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(e, newValue) => {
                formik.setFieldValue("category", newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Категория" />
              )}
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
                      multiline
                      rows={2}
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
                      multiline
                      rows={2}
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
                image={image}
                onChange={(file) => setImage({ file: file })}
                title={"Загрузить картинку превью"}
              />
            </Box>

            {formik.values.type === "article" && (
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
                </TabContext>
              </Box>
            )}
            {formik.values.type === "modal" && (
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
                    </TabList>
                  </Box>
                  <Zoom in={fullTab == 1} value={1} hidden={fullTab != 1}>
                    <Box sx={{ overflow: "visible" }}>
                      <SunEditor onChange={setDescriptionRu} value={descriptionRu} type="modal" />
                      {/* <Editor lang={"ru"} onChange={setDescriptionRu} value={descriptionRu} /> */}
                    </Box>
                  </Zoom>
                  <Zoom in={fullTab == 2} value={2} hidden={fullTab != 2}>
                    <Box sx={{ overflow: "visible" }}>
                      <SunEditor onChange={setDescriptionUz} value={descriptionUz} type="modal" />
                      {/* <Editor lang={"uz"} onChange={setDescriptionUz} value={descriptionUz} /> */}
                    </Box>
                  </Zoom>
                </TabContext>
              </Box>
            )}
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
              {work ? "Обновить" : "Создать"}
              {formLoading && <CircularProgress sx={{ color: "#fff" }} size={20} />}
            </Button>
          </Box>
        </Card>
      </form>
    </Suspense>
  );
};

export default AddWorkForm;
