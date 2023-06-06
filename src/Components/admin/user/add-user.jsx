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
  Autocomplete,
  FormHelperText,
  IconButton,
  InputAdornment,
  OutlinedInput,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import ImageUpload from "src/Components/admin/common/imageUpload";

const AddUser = ({ handleSubmit, user, roles }) => {
  const router = useRouter();

  const [image, setImage] = useState(user?.imageUrl || "");
  const [roleOptions, setRoleOptions] = useState(
    roles.map((r) => {
      return { label: r.name, id: r.id };
    }) || []
  );

  const formik = useFormik({
    initialValues: {
      role: roleOptions?.find((r) => r.id === user?.userRoleId) || null,
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().max(255).required("Имя обязательное поле"),
      role: Yup.object().required("Роль обязательное поле"),
      email: Yup.string().email("Неправильный email").max(255),
      password: Yup.string().max(50),
      confirmPassword: Yup.string().max(50),
    }),
    validateOnChange: () => {
      // console.log(formik.errors);
    },
    validate: ({ confirmPassword, password, role }) => {
      const errors = {};
      if (confirmPassword !== password) {
        errors.confirmPassword = "Пароли должны совпадать";
      }

      return errors;
    },
    onSubmit: async ({
      role,
      name,
      email,
      password,
      confirmPassword,
    }) => {
      const result = await handleSubmit({
        roleId: role.id,
        name,
        email,
        password,
        confirmPassword,
        image,
      });
      if (result.status === 400) {
        toast.error(result.data);
        result.data.forEach((r) => {
          formik.errors[r["param"]] = r["msg"];
        });
      }
      if (result.status === 200) {
        toast.success(user ? "Пользователь обновлен!" : "Пользователь добавлен!");
        if (result.id) {
          router.push(`/users/add-user?id=${result.id}`);
        }
      }
    },
  });

  const [values, setValues] = useState({
    showPassword: false,
    showPasswordConfirm: false,
  });
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseDownPasswordConfirm = (event) => {
    event.preventDefault();
  };

  const handleClickShowPasswordConfirm = () => {
    setValues({ ...values, showPasswordConfirm: !values.showPasswordConfirm });
  };
  return (
    <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
      <Card>
        <CardHeader
          subheader={user ? "Редактировать пользователя" : "Добавить пользователя"}
          title="Пользователь"
        />
        <Divider />
        <CardContent>
          <Autocomplete
            disablePortal
            id="role-select"
            options={roleOptions}
            sx={{ width: 500, marginBottom: "20px" }}
            value={formik.values.role}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onBlur={formik.handleBlur}
            onChange={(e, newValue) => {
              formik.setFieldValue("role", newValue);
            }}
            renderInput={(params) => <TextField {...params} label="Роль" />}
          />
          <TextField
            error={Boolean(formik.touched.name && formik.errors.name)}
            fullWidth
            helperText={formik.touched.name && formik.errors.name}
            label="Имя"
            margin="normal"
            name="name"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.name}
            variant="outlined"
            inputProps={{}}
          />
          <ImageUpload
            onChange={(file) => setImage({ file: file })}
            image={image}
            title={"Картинка пользователя"}
            sizes={{ width: 50, height: 50 }}
          />
          <TextField
            error={Boolean(formik.touched.email && formik.errors.email)}
            fullWidth
            helperText={formik.touched.email && formik.errors.email}
            label="Email"
            margin="normal"
            name="email"
            type={"email"}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.email}
            variant="outlined"
            inputProps={{}}
          />
         
          {formik.values.role?.id === 1 || formik.values.role?.id === 2 ? (
            <>
              <p style={{ fontWeight: "bold", paddingTop: "20px" }}>
                {"Оставьте пустым чтобы сохранить текущий пароль"}
              </p>
              <Box sx={{ display: "flex", gap: "10px" }}>
                <FormControl
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={Boolean(formik.touched.password && formik.errors.password)}
                >
                  <InputLabel htmlFor="outlined-adornment-password">Пароль</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={values.showPassword ? "text" : "password"}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    name="password"
                    error={Boolean(formik.touched.password && formik.errors.password)}
                    onBlur={formik.handleBlur}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {values.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Пароль"
                  />
                  <FormHelperText>
                    {formik.touched.password && formik.errors.password}
                  </FormHelperText>
                </FormControl>

                <FormControl
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)}
                >
                  <InputLabel htmlFor="outlined-adornment-passwordConfirm">
                    Подтверждение пароля
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-passwordConfirm"
                    type={values.showPasswordConfirm ? "text" : "password"}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    name="confirmPassword"
                    error={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)}
                    onBlur={formik.handleBlur}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPasswordConfirm}
                          onMouseDown={handleMouseDownPasswordConfirm}
                          edge="end"
                        >
                          {values.showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Подтверждение пароля"
                  />
                  <FormHelperText>
                    {formik.touched.confirmPassword && formik.errors.confirmPassword}
                  </FormHelperText>
                </FormControl>
              </Box>
            </>
          ) : null}
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
            {user ? "Обновить" : "Создать"}
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default AddUser;
