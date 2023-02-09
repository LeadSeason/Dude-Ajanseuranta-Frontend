export const BACKEND_URL = "http://192.168.192.12:8082";
// export const BACKEND_URL = "http://localhost:8080";

export class USER {
  static GET_URL = BACKEND_URL + "/user/get";
	static ADD_URL = BACKEND_URL + "/user/add";
	static REMOVE_URL = BACKEND_URL + "/user/remove";
	static UPDATE_URL = BACKEND_URL + "/user/update";
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
}

export const LOGIN_URL = BACKEND_URL + "/login";
export const LOGOUT_URL = BACKEND_URL + "/logout";
export const VALIDATE_URL = BACKEND_URL + "/validate";