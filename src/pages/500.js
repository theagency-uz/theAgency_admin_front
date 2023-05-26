import Layout from "src/layout/site";

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
    return <Layout>{page}</Layout>;
};
export default Error500;
