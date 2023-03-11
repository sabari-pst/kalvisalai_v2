import _LOGO from "../assets/images/kl_logo.png";
import _FORGOT from "../assets/images/forgot.png";
import _FORGOT_GIF from "../assets/images/forgot.gif";
import _MALE from "../assets/images/male_large.jpg";
import _FEMALE from "../assets/images/female_large.jpg";
import _SELECT_USER_PHOTO from "../assets/images/select_user_photo.png";
import _NABH_LOGO from "../assets/images/nabh_accredited.jpg";
import { baseUrl, localSettingsValues } from ".";

export const VENDOR_LOGO = baseUrl + "/public/app_fav.png";
export const NABH_LOGO = _NABH_LOGO;
export const LOGO = _LOGO;
export const FORGOT = _FORGOT;
export const FORGOT_GIF = _FORGOT_GIF;
export const MALE = _MALE;
export const FEMALE = _FEMALE;
export const SELECT_USER_PHOTO = _SELECT_USER_PHOTO;

export const MOB_LOGIN_TOP_BG = require("../assets/mob/bg_1.jpg");

export const MOB_ICONS = {
  KEY_256: require("../assets/mob/key_256.png"),
  PASSWORD_256: require("../assets/mob/password_256.png"),
  SCREEN_LOCK_256: require("../assets/mob/screen_lock_256.png"),
  USERLOGIN_256: require("../assets/mob/userlogin_256.png"),
  USER_BLACK_256: require("../assets/mob/user_black_256.png"),
  NO_PHOTO_256: require("../assets/mob/no_photo_256.png"),
  NO_PHOTO: require("../assets/mob/transparent.png"),
};

export const printHeader = "";

export const DEFAULT_PAGE_LIST_SIZE = "50";

export const aosInit = {
  offset: 100,
  duration: 600,
  easing: "ease-in-sine",
  delay: 100,
};

export const ROLES = {
  ALL: ["dev", "master_admin", "cashier", "accountant", "reception"],
  PROGRAMMER: ["dev", "master_admin"],
  ADMIN: ["dev", "master_admin"],
  SITE_ADMIN: ["dev", "master_admin", "site_admin"],
  ACCOUNTANT: ["dev", "master_admin", "accountant"],
  TEACHER: ["dev", "master_admin", "hod", "teacher"],
};

export const BLOOD_GROUPS = [
  "A+",
  "B+",
  "A-",
  "B-",
  "B1+",
  "O+",
  "O-",
  "AB+",
  "AB-",
  "A1+",
  "A1-",
  "A2+",
  "A2-",
  "A1B+",
  "A1B-",
  "A2B+",
  "A2B-",
];

export const PAGE_SIZE = ["a4", "a5", "legal"];
export const PAGE_LAYOUT = ["portrait", "landscape"];

export const CERTIFICATE_TEMPLATE_NAMES = {
  STUDENT_BONAFIED: "student_bonafied",
  STUDENT_CONDUCT: "student_conduct",
  STUDENT_MEDIUM: "student_medium",
  STUDENT_VERIFICATION: "student_verification",
};

export const COURSE_TYPE_SORT_ORDER = localSettingsValues(
  "academic_course_types",
  "ug"
)?.split(",");
/*export const COURSE_TYPE_SORT_ORDER = [
  "ug3y",
  "ug5y",
  "pg",
  //"mphil",
  //"phd",
  //"diploma",
];*/

export const TABLE_STYLES = {
  tableCollapse: {
    borderCollapse: "collapse",
    border: "none",
  },
  borderBottom: {
    borderCollapse: "collapse",
    borderBottom: "1px solid black",
  },
  borderTop: {
    borderCollapse: "collapse",
    borderTop: "1px solid black",
  },
  borderExceptLeft: {
    borderCollapse: "collapse",
    borderBottom: "1px solid black",
    borderTop: "1px solid black",
    borderRight: "1px solid black",
    padding: "3px",
  },
  borderExceptRight: {
    borderCollapse: "collapse",
    borderBottom: "1px solid black",
    borderTop: "1px solid black",
    borderLeft: "1px solid black",
    padding: "3px",
  },
  borderAll: {
    borderCollapse: "collapse",
    border: "1px solid black",
    padding: "4px",
  },
  borderAllNoPadding: {
    borderCollapse: "collapse",
    border: "1px solid black",
    padding: "0px",
  },
  trHideborderAll: {
    display: "none",
    borderCollapse: "collapse",
    border: "1px solid black",
    padding: "4px",
  },
  borderAllHead: {
    borderCollapse: "collapse",
    border: "1px solid black",
    padding: "4px",
    backgroundColor: "#efefef",
    printColorAdjust: "exact",
  },
  borderTopBottom: {
    borderCollapse: "collapse",
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    padding: "3px",
  },
  doubleBorderTop: { borderTop: "1px double black" },
};

export const DegreeType = [
  { text: "UG", value: "ug" },
  { text: "PG", value: "pg" },
  { text: "MPhil", value: "mphil" },
  { text: "PhD", value: "phd" },
  { text: "Diploma", value: "diploma" },
];

export const contentTypes = {
  ANNOUNCEMENT: "announcement",
  SLIDER: "slider",
  GALLERY: "gallery",
  ARTICLE: "article",
  PAGE: "page",
  EVENT: "event",
  //downloads,videos
};
