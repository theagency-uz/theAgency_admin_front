import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import auth from "../services/auth";
import UserContext from "src/context/userContext";
const withRegister = (WrappedComponent) => {
  return (props) => {
    const [open, setOpen] = useState(false);
    const getLayout = WrappedComponent.getLayout ?? ((page) => page);
    const Router = useRouter();
    const [verified, setVerified] = useState(false);
    const { user, setUser } = useContext(UserContext);
    useEffect(() => {
      const user = auth.getUser();
      setUser(user);
      // if no accessToken was found,then we redirect to previous page.
      if (!user || user.userRoleId !== 3) {
        setVerified(false);
        Router.back();
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

export default withRegister;
