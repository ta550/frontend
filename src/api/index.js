import axios from "axios";
import Cookies from "js-cookie";

// axios.defaults.baseURL = "http://13.212.20.36:9090";

//Request Interceptor
axios.interceptors.request.use(
  async (config) => {
    console.log("I checked if it is login address");
    if (config.url.includes("/superuser/login")) return config;
    if (config.url.includes("/superuser/operator")) {
      config.headers["Content-Type"] = "application/json";
      return config;
    }
    TokenValidate().then((res) => {
      if (res === true) {
        history.push("/admin/panel");
      }
    });
    // await TokenValidate();
    console.log("I came to refresh the access token");
    config.headers["Authorization"] = "Bearer " + Cookies.get("access");
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    console.log("Error is:", error);
    return Promise.reject(error);
  }
);
// Response Interceptor
axios.interceptors.response.use(
  (response) => {
    console.log("I came in response section");
    console.log("Respones is:", response);
    return response;
  },
  (error) => {
    console.log("Error isi:", error);
    console.log(error);
    return Promise.reject(error);
  }
);

const hasAccess = async (access_token, refresh_token) => {
  if (!refresh_token) history.push("/admin/panel");
  console.log("I came in hasAccess");
  if (access_token === undefined) {
    //generate new access_token
    access_token = await refresh(refresh_token);
    return access_token;
  }
  console.log("I did not go for refresh");
  return access_token;
};
//refresh checks and validates the accessToken
const refresh = (refresh_token) => {
  console.log("refreshing the token...");
  return new Promise((resolve, reject) => {
    axios
      .post("/superuser/refreshToken", { refresh_token: refresh_token })
      .then((res) => {
        if (!res?.data?.access_token) {
          //set dialog to say, your session is expired, please login again
          //call logout reducer
          //the execution will never reach here according to my estimate
          console.log("refresh token is gone");
          history.push("/admin/panel");
          resolve(false);
        } else {
          const { access_token } = res?.data;
          props.set_login(res?.data?.access_token);
          console.log("here is access new token:", access_token);
          Cookies.set("access", access_token);
          resolve(access_token);
        }
      });
  });
};
