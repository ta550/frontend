import Cookies from "js-cookie";

const setLogin = (state = "", action) => {
  switch (action.type) {
    case "login":
      return Cookies.get("access");
    case "logout":
      return "";
    default:
      return state;
  }
};

export default setLogin;
