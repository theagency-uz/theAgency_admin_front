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
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const AddRole = ({ handleSubmit, role }) => {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: role?.name || "",
      createAdmin: role?.createAdmin === 0 ? false : true,
      create: role?.create === 0 ? false : true,
      read: role?.read === 0 ? false : true,
      update: role?.update === 0 ? false : true,
      del: role?.del === 0 ? false : true,
    },
    validationSchema: Yup.object({
      name: Yup.string().max(255).required("Имя обязательное поле"),
      createAdmin: Yup.boolean(),
      create: Yup.boolean(),
      read: Yup.boolean(),
      update: Yup.boolean(),
      del: Yup.boolean(),
    }),
    onSubmit: async ({ name, createAdmin, create, read, update, del }) => {
      const result = await handleSubmit({
        name,
        createAdmin,
        create,
        read,
        update,
        del,
      });
      if (result.status === 400) {
        result.data.forEach((r) => {
          formik.errors[r["param"]] = r["msg"];
        });
      }
      if (result.status === 200) {
        toast.success(role ? "Роль обновлен!" : "Роль создан!");
        if (result.id) {
          router.push(`/admin/users/add-role?id=${result.id}`);
        }
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
      <Card>
        <CardHeader subheader={role ? "Редктировать роль" : "Добавить роль"} title="Role" />
        <Divider />
        <CardContent>
          <TextField
            error={Boolean(formik.touched.name && formik.errors.name)}
            fullWidth
            helperText={formik.touched.name && formik.errors.name}
            label="Название"
            margin="normal"
            name="name"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.name}
            variant="outlined"
            inputProps={{}}
          />
          <Box sx={{ display: "flex", gap: "10px" }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.createAdmin}
                  onChange={formik.handleChange}
                  name="createAdmin"
                />
              }
              label="создание админа"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.create}
                  onChange={formik.handleChange}
                  name="create"
                />
              }
              label="создание"
            />
            <FormControlLabel
              control={
                <Switch checked={formik.values.read} onChange={formik.handleChange} name="read" />
              }
              label="чтение"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.update}
                  onChange={formik.handleChange}
                  name="update"
                />
              }
              label="обновление"
            />
            <FormControlLabel
              control={
                <Switch checked={formik.values.del} onChange={formik.handleChange} name="del" />
              }
              label="удаление"
            />
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
          <Button color="primary" variant="contained" type="submit">
            {role ? "Обновить" : "Создать"}
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default AddRole;
