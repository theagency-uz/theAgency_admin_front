import { useState, useEffect } from "react";
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
  Zoom,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { TabContext, TabList } from "@mui/lab";

import Flag from "src/Components/admin/common/flag";

const AddWorkCategory = ({ handleSubmit, category }) => {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      nameRu: category?.name?.ru || "",
      nameUz: category?.name?.uz || "",

      slug: category?.slug || "",
    },
    validationSchema: Yup.object({
      nameRu: Yup.string().max(255).required("Названеи ru обязательное поле"),
      nameUz: Yup.string().max(255).required("Названеи uz обязательное поле"),

      slug: Yup.string().max(255).required("Ссылка обязательное поле"),
    }),
    onSubmit: async ({ nameRu, nameUz, slug }) => {
      const result = await handleSubmit({
        name: { ru: nameRu, uz: nameUz },
        slug,
      });
      if (result.status === 400) {
        result.data.forEach((r) => {
          formik.errors[r["param"]] = r["msg"];
        });
      }
      if (result.status === 200) {
        toast.success(category ? "Категория обновлена!" : "Категория добавлена!");
        if (result.id) {
          router.push(`/blogs/category/add-category?id=${result.id}`);
        }
      }
    },
  });

  const [value, setValue] = useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
      <Card>
        <CardHeader
          subheader={category ? "Редактировать категорию" : "Добавить категорию"}
          title="Категория"
        />
        <Divider />
        <CardContent>
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
          />
        </CardContent>

        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
          }}
        >
          <Button color="primary" variant="contained" type="submit">
            {category ? "Обновить" : "Создать"}
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default AddWorkCategory;
