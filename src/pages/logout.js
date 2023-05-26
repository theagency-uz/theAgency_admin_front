import { useContext } from "react";
import UserContext from "src/context/userContext";
import { logoutUser } from "src/services/auth";
export default function Logout() {
  const { user, setUser } = useContext(UserContext);
  logoutUser();
  setUser(null);
  return null;
}
