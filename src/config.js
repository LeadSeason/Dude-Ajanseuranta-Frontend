export const BACKEND_URL = "http://192.168.192.12:8082/api/v1";
// export const BACKEND_URL = "http://localhost:8080";

export class USER {
  static GET_URL = BACKEND_URL + "/user/get/";
  static GET_ALL_URL = BACKEND_URL + "/users/get";
	static ADD_URL = BACKEND_URL + "/user/add";
	static REMOVE_URL = BACKEND_URL + "/user/remove";
	static UPDATE_CARD_URL = BACKEND_URL + "/user/updatecard";
  static GET_TIMES_URL = BACKEND_URL + "/user/times/"
}

export class CARD {
  static GET_URL = BACKEND_URL + "/card/get";
  static REMOVE_URL = BACKEND_URL + "/card/remove";
  static RENAME_URL = BACKEND_URL + "/card/rename";

  /* CARD READING MODE */
  static READING_MODE_TIME = 300;
  static SET_READING_MODE_URL = BACKEND_URL + "/card/readingmode/start";
  static CANCEL_READING_MODE_URL = BACKEND_URL + "/card/readingmode/cancel";
}

export class PAGE {
  static MAIN = "/index.html";
  static LOGIN = "/login/index.html";
  static USERS = "/users/index.html"
  static USER = "/user/index.html"
}

export class ADMIN {
  static GET_URL = BACKEND_URL + "/admin/get/"
  static GET_ALL_URL = BACKEND_URL + "/admins/get"
  static ADD_URL = BACKEND_URL + "/admin/add"
}

export const LOGIN_URL = BACKEND_URL + "/login";
export const LOGOUT_URL = BACKEND_URL + "/logout";
export const CHANGE_PASSWORD_URL = BACKEND_URL + "/changepassword"
export const VALIDATE_URL = BACKEND_URL + "/validate";

export const UPDATE_INTERVAL_s = 10;
export const UPDATE_INTERVAL_ms = UPDATE_INTERVAL_s * 1000;