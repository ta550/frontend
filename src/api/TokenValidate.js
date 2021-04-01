import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import moment from "moment";
import { history } from "../index";

const TokenValidate = async () => {
  let access_token = Cookies.get("access");
  let refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) history.push("/admin/panel");
  console.log(jwt_decode(access_token));
  const accessTokenExpireTime = jwt_decode(access_token).exp;
  console.log(
    "ExpireTime exp: ",
    accessTokenExpireTime,
    "  I came in hasAccess"
  );
  if (moment.unix(accessTokenExpireTime) - moment(Date.now()) < 10000) {
    //generate new access_token
    console.log("refreshing the token...");
    const refreshTokenExpireTime = jwt_decode(refresh_token).exp;
    if (moment.unix(refreshTokenExpireTime) - moment(Date.now()) > 10000) {
      return new Promise((resolve, reject) => {
        axios
          .post("/superuser/refreshToken", { refresh_token: refresh_token })
          .then((res) => {
            if (!res?.data?.access_token) {
              //the execution will never reach here according to my estimate
              console.log("refresh token is gone");
              history.push("/admin/panel");
              resolve(false);
            } else {
              const { access_token } = res?.data;
              //   props.set_login(res?.data?.access_token);
              console.log("here is access new token:", access_token);
              Cookies.set("access", access_token);
              resolve(access_token);
            }
          });
      });
    } else {
      console.log("refreshToken expired");
      history.push("/admin/panel");
    }
    return access_token;
  }
  console.log("I did not go for refresh");
  return access_token;
};
export default TokenValidate;
