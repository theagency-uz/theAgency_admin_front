import { useState, Suspense, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  CircularProgress,
  Typography,
} from "@mui/material";

import Loading from "src/Components/common/Loading";

import FileUpload from "./file-upload";
import MailingText from "./mailing-text";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const AddMailingForm = ({ handleSubmit, work, categories }) => {
  const router = useRouter();
  const [formLoading, setFormLoading] = useState(false);
  const [sendLaterTime, setSendLaterTime] = useState(null);

  useEffect(() => {
    console.log(sendLaterTime);
  }, [sendLaterTime]);

  return (
    <Suspense fallback={<Loading />}>
      <form encType="multipart/form-data">
        <Card sx={{ overflow: "visible" }}>
          <CardHeader
            subheader={work ? "Редактировать рассылку" : "Создать рассылку"}
            title="Рассылкa"
          />

          <Divider />

          <CardContent>
            <FileUpload />
            <MailingText />
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                value={sendLaterTime}
                onChange={setSendLaterTime}
                referenceDate={dayjs(new Date())}
              />
            </LocalizationProvider>
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

export default AddMailingForm;
