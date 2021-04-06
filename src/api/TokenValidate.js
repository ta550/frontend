import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import moment from "moment";
import { history } from "../index";

const TokenValidate = async () => {
  let access_token = Cookies.get("access");
  let refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) return history.push("/admin/panel");
  // console.log(jwt_decode(access_token));
  let accessTokenExpireTime;
  try {
    accessTokenExpireTime = jwt_decode(access_token).exp;
  } catch (error) {
    return history.push("/admin/panel");
  }
  // console.log(
  //   "AccesssExpireTime - CurrentDate: ",
  //   moment.unix(accessTokenExpireTime) - moment(Date.now()),
  //   "  I came in hasAccess"
  // );
  if (moment.unix(accessTokenExpireTime) - moment(Date.now()) < 10000) {
    //generate new access_token
    console.log("refreshing the token...");
    let refreshTokenExpireTime;
    try {
      refreshTokenExpireTime = jwt_decode(refresh_token).exp;
    } catch (error) {
      return history.push("/admin/panel");
    }
    if (moment.unix(refreshTokenExpireTime) - moment(Date.now()) > 10000) {
      return new Promise((resolve, reject) => {
        axios
          .post("/superuser/refreshToken", { refresh_token: refresh_token })
          .then((res) => {
            if (!res?.data?.access_token) {
              //the execution will never reach here according to my estimation
              console.log("refresh token is gone");
              return history.push("/admin/panel");
              resolve(false);
            } else {
              const { access_token } = res?.data;
              //   props.set_login(res?.data?.access_token);
              console.log("refreshed the access token");
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
  return access_token;
};
export default TokenValidate;
