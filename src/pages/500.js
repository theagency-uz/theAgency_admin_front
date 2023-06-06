import { DashboardLayout } from "src/layout";

function Error500({ err = "", ...props }) {
    console.log("error: ", err);
    console.log("error props: ", props);
    return (
        <p style={{ textAlign: "center", fontSize: "20px" }}>
            Ошибка произошла на строное сервера. Мы скоро это исправим!
        </p>
    );
}

Error500.getLayout = (page) => {
    return <DashboardLayout>{page}</DashboardLayout>;
};
export default Error500;
