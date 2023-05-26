import http from "./httpService";
import jwtDecode from "jwt-decode";
import baseUrl from "../utils/endpoint";
import { getCookie, setCookie } from "src/utils/cookie";
const apiEndpoint = baseUrl + "/auth";
const tokenKey = "token";
http.setJwt(getJwt());

export const login = async (user) => {
  try {
    let { data: token } = await http.post(apiEndpoint, user);
    if (typeof window !== "undefined") {
      // localStorage.setItem(tokenKey, token);
      const user = getUserByJwt(token);
      setCookie(tokenKey, token, user.expire);
      http.setJwt(token);
      // autoLogout();

      return { status: 200 };
    }
  } catch (err) {
    return err.response;
  }
};

export const loginWithJwt = async (jwt) => {
  if (typeof window !== "undefined") {
    const user = getUser(token);
    setCookie(tokenKey, token, user.expire);
    // localStorage.setItem(tokenKey, jwt);
  }
};

export const getUserByJwt = (jwt) => {
  if (typeof window !== "undefined") {
    try {
      const user = jwtDecode(jwt);
      return user;
    } catch (error) {
      return null;
    }
  }
};
export const getUser = () => {
  if (typeof window !== "undefined") {
    try {
      // const jwt = localStorage.getItem(tokenKey);
      const jwt = getCookie(tokenKey);
      const user = jwtDecode(jwt);
      return user;
    } catch (error) {
      return null;
    }
  }
  return null;
};
export const logout = () => {
  if (typeof window !== "undefined") {
    // localStorage.removeItem(tokenKey);
    setCookie(tokenKey, "", -1);
    window.location.assign("/admin/login");
  }
};
export const logoutUser = () => {
  if (typeof window !== "undefined") {
    // localStorage.removeItem(tokenKey);
    setCookie(tokenKey, "", -1);
    window.location.assign("/");
  }
};
export function getJwt() {
  if (typeof window !== "undefined") {
    // return localStorage.getItem(tokenKey);
    return getCookie(tokenKey);
  }
}
export async function sendSms({ phone, name }) {
  try {
    let result = await http.post(apiEndpoint + "/sms", { phone: phone, name: name });
    return result;
  } catch (err) {
    return err.response;
  }
}
export async function verifySms({ phone, code, name }) {
  try {
    if (typeof window !== "undefined") {
      const favorites = localStorage.getItem("favorite");
      const bag = localStorage.getItem("bag");
      let result = await http.post(apiEndpoint + "/sms/verify", {
        phone: phone,
        code: code,
        name: name,
        favorites: favorites,
        bag: bag,
      });


      const user = getUserByJwt(result.data.token);
      setCookie(tokenKey, result.data.token, user.expire);

      http.setJwt(result.data.token);
      return result;
    }
  } catch (err) {
    return err.response;
  }
}
export async function updateJwt() {
  try {
    if (typeof window !== "undefined") {
      const { data: token } = await http.post(apiEndpoint + "/newJwt");
      const user = getUserByJwt(token);
      setCookie(tokenKey, token, user.expire);
      http.setJwt(token);
      return token;
    }
  } catch (err) {
    return err.response;
  }
}
// export function autoLogout() {
//   const user = getUser();
//   const time = user.expire;
//   setTimeout(() => {
//     logout();
//   }, time * 60 * 60 * 1000);
// }
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  login,
  loginWithJwt,
  getUser,
  logout,
  logoutUser,
  getJwt,
  verifySms,
};
