import { useState, Suspense, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CircularProgress,
} from "@mui/material";

import Loading from "src/Components/common/Loading";

import FileUpload from "./file-upload";
import MailingText from "./mailing-text";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { sendMailings } from "src/services/mailing";

const AddMailingForm = ({ handleSubmit, mailing }) => {
  const router = useRouter();
  const id = router.query.id;
  const [formLoading, setFormLoading] = useState(false);
  const [formLoading2, setFormLoading2] = useState(false);
  const fileInit = mailing?.image
    ? { image: mailing?.image }
    : mailing?.video
    ? { video: mailing?.video }
    : null;

  const [file, setFile] = useState(null);
  const formik = useFormik({
    initialValues: {
      textRu: mailing?.text.ru || "",
      textUz: mailing?.text.uz || "",
    },
    validationSchema: Yup.object({
      textRu: Yup.string().required("Название ru обязательное поле"),
      textUz: Yup.string().required("Название uz обязательное поле"),
    }),
    validateOnChange: (e) => {},
    onSubmit: async ({ textRu, textUz }) => {
      setFormLoading(true);
      const result = await handleSubmit({
        textRu: textRu,
        textUz: textUz,
        ...file,
      });
      setFormLoading(false);

      if (result.status === 200) {
        toast.success("Статья создана!");
        // toast.success(blog ? "Статья обновлена!" : "Статья создана!");
        !mailing && router.push(`/mailings`);
      } else {
        console.log(result?.data || result);
        toast.error(result?.data);
      }
    },
  });

  useEffect(() => {
    setFile(fileInit);
  }, [mailing]);
  const mailingsParams = {
    textRu: formik.values.textRu,
    textUz: formik.values.textUz,
    handleChange: formik.handleChange,
    formikErrors: formik.errors,
  };

  const handleSendMailings = async () => {
    try {
      setFormLoading2(true);
      const result = await sendMailings(id);

      setFormLoading2(false);
      if (result.status === 200) {
        toast.success("Статья отправлена!");
        // toast.success(blog ? "Статья обновлена!" : "Статья создана!");
      } else {
        console.log(result?.data || result);
        toast.error(result?.data);
      }
    } catch (err) {}
  };

  return (
    <Suspense fallback={<Loading />}>
      <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
        <Card sx={{ overflow: "visible" }}>
          <CardHeader
            subheader={mailing ? "Редактировать рассылку" : "Создать рассылку"}
            title="Рассылкa"
          />

          <Divider />

          <CardContent>
            <FileUpload setFile={setFile} file={file} />
            <MailingText {...mailingsParams} />
          </CardContent>

          <Divider />

          <Box
            sx={{
              display: "flex",
              gap: "10px",
              justifyContent: "flex-end",
              p: 2,
            }}
          >
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                value={sendLaterTime}
                onChange={setSendLaterTime}
                referenceDate={dayjs(new Date())}
              />
            </LocalizationProvider> */}
            {mailing ? (
              <Button
                color="primary"
                variant="contained"
                onClick={handleSendMailings}
                sx={{ display: "flex", gap: "5px" }}
              >
                Отправить
                {formLoading2 && <CircularProgress sx={{ color: "#fff" }} size={20} />}
              </Button>
            ) : (
              ""
            )}
            <Button
              color="primary"
              variant="contained"
              type="submit"
              sx={{ display: "flex", gap: "5px" }}
            >
              {mailing ? "Обновить" : "Создать"}
              {formLoading && <CircularProgress sx={{ color: "#fff" }} size={20} />}
            </Button>
          </Box>
        </Card>
      </form>
    </Suspense>
  );
};

export default AddMailingForm;
