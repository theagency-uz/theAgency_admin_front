import Layout from "src/layout";

function Error({ statusCode, err, ...props }) {
  console.log("error: ", err);
  console.log("error props: ", props);
  return (
    <p style={{ textAlign: "center", fontSize: "20px" }}>
      {statusCode
        ? `Ошибка ${statusCode} произошла на строное сервера`
        : "На стороне клиента произошла ошибка. Мы скоро это исправим!"}
    </p>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode, err };
};
Error.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};
export default Error;
