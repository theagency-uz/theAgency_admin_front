import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import auth from "../services/auth";
const withAuth = (WrappedComponent) => {
  return (props) => {
    const getLayout = WrappedComponent.getLayout ?? ((page) => page);
    const Router = useRouter();
    const [verified, setVerified] = useState(false);
    const [user, setUser] = useState(null);
    useEffect(() => {
      const user = auth.getUser();
      setUser(user);
      // if no accessToken was found,then we redirect to "/admin/login" page.
      if (!user || user.userRoleId > 2) {
        setVerified(false);
        Router.replace("/admin/login");
      } else {
        setVerified(true);
      }
    }, []);

    if (verified) {
      return getLayout(<WrappedComponent {...props} user={user} />);
    } else {
      return null;
    }
  };
};

export default withAuth;
