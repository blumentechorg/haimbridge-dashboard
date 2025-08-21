import Cookies from "js-cookie";

export const saveToken = (token, expiresDays = 7) => {
  Cookies.set("owner_token", token, { expires: expiresDays });
};

export const clearToken = () => Cookies.remove("owner_token");

export const getToken = () => Cookies.get("owner_token");
