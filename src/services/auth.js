import http from "./httpService";
import jwtDecode from "jwt-decode";
import baseUrl from "../utils/endpoint";
const apiEndpoint = baseUrl + "/auth";
const tokenKey = "token";
http.setJwt(getJwt());

export const login = async (user) => {
  try {
    let { data: token } = await http.post(apiEndpoint, user);
    if (typeof window !== "undefined") {
      localStorage.setItem(tokenKey, token);

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
    localStorage.setItem(tokenKey, jwt);
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
      const jwt = localStorage.getItem(tokenKey);
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
    localStorage.removeItem(tokenKey);
    window.location.assign("/login");
  }
};
export const logoutUser = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(tokenKey);
    window.location.assign("/");
  }
};
export function getJwt() {
  if (typeof window !== "undefined") {
    return localStorage.getItem(tokenKey);
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


      localStorage.setItem(tokenKey, result.data.token);

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
      localStorage.setItem(tokenKey, token);

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
