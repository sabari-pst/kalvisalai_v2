import moment from "moment";
import qs from "qs";
import React from "react";
import { toast } from "react-hot-toast";

export const appName = "KalviSalai";

export const SITE_FILE_DOWNLOAD_DIR = "files_list/";

export const baseUrl = "http://localhost/college/law/api/";

// v2 demo
/*export const baseUrl = "https://collegeerp.kalvisalai.in/api/";
export const siteUrl = "https://collegeerp.kalvisalai.in/";
export const S3_BUCKET_HOME_PATH = "v2demo/"; //end trailing slash is must*/

// LIVE
// RAC Women - Thiruvarur
/*export const baseUrl = "https://racollege.kalvisalai.in/manage/api/";
export const siteUrl = "https://racollege.kalvisalai.in/";
export const S3_BUCKET_HOME_PATH = "racwomen/"; //end trailing slash is must*/

// Government Law College - Thrichy
/*export const baseUrl = "https://glctry.tndls.ac.in/api/";
export const siteUrl = "https://glctry.tndls.ac.in/";
export const S3_BUCKET_HOME_PATH = "trichy/"; //end trailing slash is must*/

//S.Vellasamy Nadar College - Madurai
//export const baseUrl = "https://svncollege.kalvisalai.in/api/";
export const siteUrl = "https://svncollege.kalvisalai.in/";
export const S3_BUCKET_HOME_PATH = "svn/"; //end trailing slash is must*/

//St.Johns College - Tirunelveli
/*export const baseUrl = "https://stjohnscollege.kalvisalai.in/api/";
export const siteUrl = "https://stjohnscollege.kalvisalai.in/";
export const S3_BUCKET_HOME_PATH = "stjohns/"; //end trailing slash is must*/

// SOEL - CHENNAi (LAW UNIVERSITY)
/*export const baseUrl = "https://soelerp.kalvisalai.in/api/";
export const siteUrl = "https://soelerp.kalvisalai.in/";
export const S3_BUCKET_HOME_PATH = "soel/"; //end trailing slash is must*/

export const sleep = (time) =>
  new Promise((resolve) => setTimeout(resolve, time));

export const CardFixedTop = ({ title, children }) => {
  return (
    <div className="card card-fixed-top">
      <div className="card-body">
        <div className="d-flex  justify-content-between">
          <div style={{ padding: "5px 0 0 8px" }}>
            <b>{title}</b>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export const getFileLiveUrl = (item, originalImage = false) => {
  let url = siteUrl + SITE_FILE_DOWNLOAD_DIR;
  if (item && item.Key) url += item.Key;
  else url += item;
  let ext = getFileExtension(url);
  ext = lowerCase(ext);
  if (["png", "jpg", "jpeg", "bmp", "gif"].includes(ext))
    if (!originalImage) url = url.replace("fm", "fm_thumb");
  return url;
};

export const printDocument = (printId) => {
  var content = document.getElementById(printId);
  var pri = document.getElementById("print_frame").contentWindow;
  pri.document.open();
  pri.document.write(
    '<style>@font-face {font-family: "Bookman Old Style";src: local("Bookman Old Style"), url("fonts/bookold.woff") format("woff");}.font-bookman {font-family: "Bookman Old Style", sans-serif;font-size:12px;} .new_line {page-break-after: always;}html,body {font-family: Segoe UI, SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif !important;font-size:11px;}</style>'
  );
  pri.document.write(content.innerHTML);
  pri.document.close();
  pri.focus();
  pri.print();
};

export function subtractYears(date, years) {
  date.setFullYear(date.getFullYear() - years);
  return date;
}

export function jsonToQuery(params) {
  return qs.stringify(params);
}
/**
 * setLs
 * to store the user inputs into localStorage
 **/
export function setLs(key, value) {
  localStorage.setItem(key, value);
}

/**
 * getLs
 * to get the stored values from localStorage
 **/
export function getLs(key) {
  return localStorage.getItem(key) || false;
}

export function getAscSortOrder(prop) {
  return function (a, b) {
    if (a[prop] > b[prop]) {
      return 1;
    } else if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  };
}

/**
 * getDescSortOrder
 * to sort an array by particular field
 * @param Property of an array
 * @return int
 */
export function getDescSortOrder(prop) {
  return function (a, b) {
    if (a[prop] < b[prop]) {
      return 1;
    } else if (a[prop] > b[prop]) {
      return -1;
    }
    return 0;
  };
}

/**
 * removeBothSlash
 * to remove the first and last slash from a string
 * @param1 $string
 * @return String
 */
export function removeBothSlash(str) {
  return str.replace(/^\/|\/$/g, "");
}

/**
 * getAcronym
 * to get first letter of each word in a string
 * @param1 stringValue
 * @param2 noOfChars
 * @return String
 */
export function getAcronym(stringValue, noOfChars = 1) {
  try {
    const str = stringValue; // "Java Script Object Notation";
    const matches = str.match(/\b(\w)/g); // ['J','S','O','N']
    const acronym = matches.join(""); // JSON

    return acronym.slice(0, noOfChars);
  } catch (error) {}
}

/**
 * capitalizeFirst
 * to capitalize the first letter of the word
 * @param1 $str (string)
 * @return string
 */
export function capitalizeFirst(str) {
  if (str == "" || str == null || str == " ") {
    return "";
  }

  str = str.toLowerCase();
  //return str.charAt(0).toUpperCase() + str.slice(1);
  return str.replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
}

/**
 * upperCase
 * to conver the string to upper case
 * @param1 $str (string)
 * @return string
 */
export function upperCase(str) {
  if (str == "" || str == null || str == " " || str.length < 1) return "";
  return str.toString().toUpperCase();
}

/**
 * lowerCase
 * to conver the string to lower case
 * @param1 $str (string)
 * @return string
 */
export function lowerCase(str) {
  if (str == "" || str == null || str == " ") return "";
  return str.toString().toLowerCase();
}

/**
 * makeUrl
 * to convert the string into url
 * to remove all the special characters and remove space
 *
 * @param1 $str
 * @return String
 */
export function makeUrl(str) {
  try {
    str = str.replace(/[&\/\\#,+()$~%.\'":*?<>{}]/g, "");
    str = str.replace(/ /g, "-");
    return str.toLowerCase();
  } catch (error) {
    //console.log(error);
  }
}

export function groupByMultiple(array, f) {
  var groups = {};
  array.forEach(function (o) {
    var group = JSON.stringify(f(o));
    groups[group] = groups[group] || [];
    groups[group].push(o);
  });
  return Object.keys(groups).map(function (group) {
    return groups[group];
  });
}

export function filterArroyOfItems(arr, query) {
  return arr.filter((el) => el.toLowerCase().includes(query.toLowerCase()));
}

export function findCommonElement(array1, array2) {
  // Loop for array1
  for (let i = 0; i < array1.length; i++) {
    // Loop for array2
    for (let j = 0; j < array2.length; j++) {
      // Compare the element of each and
      // every element from both of the
      // arrays
      if (upperCase(array1[i]) === upperCase(array2[j])) {
        // Return if common element found
        return true;
      }
    }
  }

  // Return if no common element exist
  return false;
}
/**
 * yesorNo
 * to get the value yes or no form the boolean
 * @param1 $val (bool) true,false, 1,0
 * @param2 $withColor (true,false) default false
 * @return String
 */
export function yesorNo(val) {
  if (val == "" || val == null || val == " ") return "No";
  if (val == "1" || val == true) return "Yes";
  return "No";
}

/**
 * isNullOrEmpty
 * to check the given value is null or empty
 * @param $val
 * @return Boolean
 */
export function isNullOrEmpty(val) {
  try {
    if (val == "" || val == null || val == " " || val == NaN) return false;
    return true;
  } catch (error) {
    //console.log(error);
    return true;
  }
}

/**
 * calculateMessageCount
 * to calculate letters count
 * @param1 $textArea
 * @param2 $displayArea
 * @return HTML
 */
export function calculateMsgCount(textAreaId, divId) {
  try {
    const singleSmsLength = 160;
    const ele = document.getElementById(textAreaId);
    const charLength = ele.value.length;
    const msgCount = Math.ceil(charLength / singleSmsLength);
    document.getElementById(divId).innerHTML = `${charLength} / ${msgCount}`;
  } catch (error) {
    //console.log(error);
  }
}

/**
 * momentDate
 * to convert a date format using moment
 * @param1 $date
 * @param2 $format
 * @return date
 */
export function momentDate(value, toFormat = "DD/MMM/YYYY") {
  try {
    if (
      value == "0000-00-00" ||
      value == "" ||
      value == " " ||
      value == null ||
      value == NaN
    ) {
      return "";
    }

    // var d = new Date(value).getTime();
    return moment(value).format(toFormat);
  } catch (error) {
    //console.log(error);
    return "";
  }
}

/**
 * integerKeyPress
 * to handle textbox key press event and check whether the input is integer or not
 *
 * @param EVENT
 * @return NULL
 */
export function integerKeyPress(e) {
  if (e.which != 8 && (e.which < 48 || e.which > 57)) {
    // showAdvice(this, "Integer values only");
    e.preventDefault();
    return false;
  }
}

/**
 * decimalKeyPress
 * to handle textbox key press event and check whether the input is decimal or not
 *
 * @param EVENT
 * @return NULL
 */
export function decimalKeyPress(e) {
  if (e.which != 8 && e.which != 46 && (e.which < 48 || e.which > 57)) {
    // showAdvice(this, "Decimal numbers only");
    e.preventDefault();
    return false;
  }
  if (e.which == 46 && e.target.value.indexOf(".") != -1) {
    // showAdvice(this, "Only one period allowed in decimal numbers");
    e.preventDefault();
    return false; // only one decimal allowed
  }
}

/**
 * lettersOnly
 * to handle textbox key press event and check whether the input is alphabet or not
 *
 * @param EVENT
 * @return NULL
 */
export function lettersOnly(e) {
  const inputValue = e.which;
  // allow letters and whitespaces only.
  if (
    e.which != 8 &&
    !(inputValue >= 65 && inputValue <= 122) &&
    inputValue != 32 &&
    inputValue != 0
  ) {
    e.preventDefault();
    return false;
  }
}

/**
 * nameWithDotAndHypen
 * to handle textbox key press event and check whether the input is alphabet or not
 *
 * @param EVENT
 * @return NULL
 */
export function nameWithDotAndHypen(e) {
  const inputValue = e.which;
  // allow letters and whitespaces only.
  if (
    e.which != 8 &&
    e.which != 45 &&
    e.which != 46 &&
    !(inputValue >= 65 && inputValue <= 122) &&
    inputValue != 32 &&
    inputValue != 0
  ) {
    e.preventDefault();
    return false;
  }
}

/**
 * integerIndMobile
 * to handle textbox key press event and check whether the input is integer and less than 10 characters or not
 *
 * @param EVENT
 * @return NULL
 */
export function integerIndMobile(e) {
  const len = e.target.value.length;
  if (len >= 10) {
    e.preventDefault();
    return false;
  }

  if (e.which !== 8 && (e.which < 48 || e.which > 57)) {
    // showAdvice(this, "Integer values only");
    e.preventDefault();
    return false;
  }
}

export function integerAadhar(e) {
  const len = e.target.value.length;
  if (len >= 12) {
    e.preventDefault();
    return false;
  }

  if (e.which !== 10 && (e.which < 48 || e.which > 57)) {
    // showAdvice(this, "Integer values only");
    e.preventDefault();
    return false;
  }
}

export function integerGst(e) {
  const len = e.target.value.length;
  if (len >= 15) {
    e.preventDefault();
    return false;
  }

  if (e.which !== 10 && (e.which < 48 || e.which > 57)) {
    // showAdvice(this, "Integer values only");
    e.preventDefault();
    return false;
  }
}

export function removeExtension(filename) {
  if (filename && filename != "" && filename != null && filename.length > 3)
    return filename.split(".").slice(0, -1).join(".");
}

export function getFileExtension(item) {
  let paths = removeBothSlash(item).split("/");
  let extension = item.substring(item.lastIndexOf("."));
  //let extension = item.split(".").slice(0, -1).join(".");

  return extension.replace(".", "");

  //return fileType;
}

export function calculateAge(dob) {
  try {
    var a = moment();
    var b = moment(moment(dob), "YYYY");
    var diff = a.diff(b, "years");
    return diff;
  } catch (er) {}
}

export function replaceBulk(str, findArray, replaceArray) {
  var i,
    regex = [],
    map = {};
  for (i = 0; i < findArray.length; i++) {
    regex.push(findArray[i].replace(/([-[\]{}()*+?.\\^$|#,])/g, "\\$1"));
    map[findArray[i]] = replaceArray[i];
  }
  regex = regex.join("|");
  str = str.replace(new RegExp(regex, "g"), function (matched) {
    return map[matched];
  });
  return str;
}

/**
 * numberToWords
 * to convert number to words
 *
 * @param1 number (int)
 * @return string
 */
export function numberToWords(amount) {
  if (!amount) return "";
  const words = new Array();
  words[0] = "";
  words[1] = "One";
  words[2] = "Two";
  words[3] = "Three";
  words[4] = "Four";
  words[5] = "Five";
  words[6] = "Six";
  words[7] = "Seven";
  words[8] = "Eight";
  words[9] = "Nine";
  words[10] = "Ten";
  words[11] = "Eleven";
  words[12] = "Twelve";
  words[13] = "Thirteen";
  words[14] = "Fourteen";
  words[15] = "Fifteen";
  words[16] = "Sixteen";
  words[17] = "Seventeen";
  words[18] = "Eighteen";
  words[19] = "Nineteen";
  words[20] = "Twenty";
  words[30] = "Thirty";
  words[40] = "Forty";
  words[50] = "Fifty";
  words[60] = "Sixty";
  words[70] = "Seventy";
  words[80] = "Eighty";
  words[90] = "Ninety";
  amount = amount.toString();
  const atemp = amount.split(".");
  const number = atemp[0].split(",").join("");
  const n_length = number.length;
  let words_string = "";
  if (n_length <= 9) {
    const n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const received_n_array = new Array();
    for (var i = 0; i < n_length; i++) {
      received_n_array[i] = number.substr(i, 1);
    }
    for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
      n_array[i] = received_n_array[j];
    }
    for (var i = 0, j = 1; i < 9; i++, j++) {
      if (i == 0 || i == 2 || i == 4 || i == 7) {
        if (n_array[i] == 1) {
          n_array[j] = 10 + parseInt(n_array[j]);
          n_array[i] = 0;
        }
      }
    }
    let value = "";
    for (var i = 0; i < 9; i++) {
      if (i == 0 || i == 2 || i == 4 || i == 7) {
        value = n_array[i] * 10;
      } else {
        value = n_array[i];
      }
      if (value != 0) {
        words_string += `${words[value]} `;
      }
      if (
        (i == 1 && value != 0) ||
        (i == 0 && value != 0 && n_array[i + 1] == 0)
      ) {
        words_string += "Crores ";
      }
      if (
        (i == 3 && value != 0) ||
        (i == 2 && value != 0 && n_array[i + 1] == 0)
      ) {
        words_string += "Lakhs ";
      }
      if (
        (i == 5 && value != 0) ||
        (i == 4 && value != 0 && n_array[i + 1] == 0)
      ) {
        words_string += "Thousand ";
      }
      if (i == 6 && value != 0 && n_array[i + 1] != 0 && n_array[i + 2] != 0) {
        words_string += "Hundred and ";
      } else if (i == 6 && value != 0) {
        words_string += "Hundred ";
      }
    }
    words_string = words_string.split("  ").join(" ");
  }
  return words_string;
}

export function testResult(
  condition,
  fromRange,
  toRange,
  result,
  gender = false
) {
  if (!condition) return true;

  try {
    var from = fromRange; //(gender=='F') ? test.female_range_from : test.range_from;
    var to = toRange; //(gender=='F') ? test.female_range_to : test.range_to;
    var cond = condition; //(gender=='F') ? test.female_reference_condition : test.reference_condition;

    if (cond == "Nothing" || cond == "Nill") {
      return false;
    }

    if (cond == "Equal") {
      return result == from || result == to ? true : false;
    }
    if (cond == "Contain") {
      return result == from || result == to ? true : false;
    }
    if (cond == "Less_Than") {
      return parseFloat(result) < parseFloat(from) ||
        parseFloat(result) < parseFloat(to)
        ? true
        : false;
    }
    if (cond == "Greater_Than") {
      return parseFloat(result) > parseFloat(from) ||
        parseFloat(result) > parseFloat(to)
        ? true
        : false;
    }
    if (cond == "Between") {
      return parseFloat(result) >= parseFloat(from) &&
        parseFloat(result) <= parseFloat(to)
        ? true
        : false;
    }
  } catch (er) {}
}

export function getDrCrColor(amt) {
  amt = parseFloat(amt);
  if (amt == 0) return "text-dark";
  else if (amt > 0) return "text-dark-success";
  else if (amt < 0) return "text-dark-danger";
}

export function typeName(str) {
  if (str && str != "" && str != null && str != NaN) {
    str = str.split("_").join(" ");
    str = str.toLowerCase();
    //return str.charAt(0).toUpperCase() + str.slice(1);
    return str.replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  }
  return str;
}

export function startDateOfMonth(month, toFormat = "YYYY-MM-DD") {
  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  return moment(firstDay).format(toFormat);
}

export function endDateOfMonth(month, toFormat = "YYYY-MM-DD") {
  var date = new Date();
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return moment(lastDay).format(toFormat);
}

export function emptyRowsToAdd() {
  let height = window.outerHeight;
  return Math.round((window.outerHeight - 250) / 20).toFixed(0);
}

export function queryParam(search) {
  let rv = [];
  if (search.length < 1) {
    return rv;
  }
  let str = search; //props.location.search;
  str = str.replace(/\?/g, "");
  let ar = str.split("&");
  if (ar && ar.length > 0) {
    ar.map((item, i) => {
      let m = item.split("=");
      rv[m[0]] = m[1];
    });
  }
  return rv;
}

export function formToObject(form) {
  const data = new FormData(form);
  const value = Object.fromEntries(data.entries());
  return value;
}

export function yearBySem(num, asText = false) {
  if (num == "1" || num == "2") return asText ? "First Year" : "I-Year";
  else if (num == "3" || num == "4") return asText ? "Second Year" : "II-Year";
  else if (num == "5" || num == "6") return asText ? "Third Year" : "III-Year";
  else if (num == "7" || num == "8") return asText ? "Fourth Year" : "IV-Year";
  else if (num == "9" || num == "10") return asText ? "Fifth Year" : "V-Year";
}

export function semesterValue(num) {
  if (num == "1") return "SEM-I";
  else if (num == "2") return "SEM-II";
  else if (num == "3") return "SEM-III";
  else if (num == "4") return "SEM-IV";
  else if (num == "5") return "SEM-V";
  else if (num == "6") return "SEM-VI";
  else if (num == "7") return "SEM-VII";
  else if (num == "8") return "SEM-VIII";
  else if (num == "9") return "SEM-IX";
  else if (num == "10") return "SEM-X";
}

export function timeTableDayFromNumber(num, type = false) {
  if (num == "1") return type ? "Day 1" : "Mon";
  else if (num == "2") return type ? "Day 2" : "Tue";
  else if (num == "3") return type ? "Day 3" : "Wed";
  else if (num == "4") return type ? "Day 4" : "Thu";
  else if (num == "5") return type ? "Day 5" : "Fri";
  else if (num == "6") return type ? "Day 6" : "Sat";
}

export function customSorting(
  arrayOfDatas,
  sortOrderDatas,
  sortFieldName = "name"
) {
  const sortByObject = sortOrderDatas.reduce((obj, item, index) => {
    return {
      ...obj,
      [item]: index,
    };
  }, {});

  const customSort = arrayOfDatas.sort(
    (a, b) => sortByObject[a[sortFieldName]] - sortByObject[b[sortFieldName]]
  );

  return customSort;
}

export function yearByBatch(batch, maxSem = 6) {
  let currentMonth = moment(new Date()).format("MM");
  let currentYear = moment(new Date()).format("YYYY");
  if (parseInt(currentMonth) < 6) currentYear = parseInt(currentYear) - 1;
  let b = batch.split("-");
  if (b && b.length > 0) {
    if (b[0] == currentYear) return "I-Year";
    else if (b[0] == currentYear - 1 && maxSem > 2) return "II-Year";
    else if (b[0] == currentYear - 2 && maxSem > 4) return "III-Year";
    else if (b[0] == currentYear - 3 && maxSem > 6) return "IV-Year";
    else if (b[0] == currentYear - 4 && maxSem > 8) return "V-Year";
  } else return "";
}

export function objectToQueryString(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

export function localTime(time) {
  if (!time || time.length < 1) return null;
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time,
  ];

  if (time.length > 1) {
    // If time format correct
    time = time.slice(1); // Remove full string match value
    time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(""); // return adjusted time or original string
}

export function formatFileSize(bytes, decimalPoint) {
  if (bytes == 0) return "0 Bytes";
  var k = 1000,
    dm = decimalPoint || 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function bulkReplace(str, findArray, replaceArray) {
  try {
    var i,
      regex = [],
      map = {};
    for (i = 0; i < findArray.length; i++) {
      regex.push(findArray[i].replace(/([-[\]{}()*+?.\\^$|#,])/g, "\\$1"));
      map[findArray[i]] = replaceArray[i];
    }
    regex = regex.join("|");
    str = str.replace(new RegExp(regex, "g"), function (matched) {
      return map[matched];
    });
    return str;
  } catch (er) {}
}

export function getDaysBetweenTwoDates(start, end) {
  try {
    /*var start = moment("2016-09-01"), // Sept. 1st
    end = moment("2016-11-02"), // Nov. 2nd*/
    start = moment(start);
    end = moment(end);
    var day = 0; // Sunday
    var result = [];
    var current = start.clone();

    while (current.day(7 + day).isBefore(end)) {
      result.push(current.clone());
    }
    return result;
  } catch (error) {}
}

export function localSettingsValues(key, defaultReturn = false) {
  try {
    let settings =
      getLs("adm_settings") && getLs("adm_settings") !== "undefined"
        ? JSON.parse(getLs("adm_settings"))
        : [];

    let m = settings && settings.find((item) => item.field_name == key);

    let v = m && m.field_name ? m.field_value : false;

    return v ? v : defaultReturn;
  } catch (er) {}
}

export function listMonths(startDate, endDate) {
  try {
    startDate = moment(startDate);
    endDate = moment(endDate);
    var betweenMonths = [];

    if (startDate < endDate) {
      var date = startDate.startOf("month");

      while (date < endDate.endOf("month")) {
        betweenMonths.push(date.format("YYYY-MM"));
        date.add(1, "month");
      }
      return betweenMonths;
    }
  } catch (er) {
    return [];
  }
}

// end date
//alert
// start date
export function lessThanToday(dt, alert = false, st = new Date()) {
  try {
    let start = moment(st);
    let end = moment(dt);
    if (start.diff(end) < 0) {
      if (alert)
        toast.error(alert === true ? "Enter Date less than today" : alert);
      return false;
    }
    return true;
  } catch (er) {
    return false;
  }
}

export function ParseFloat(str, length) {
  str = str.toString();
  str = str.slice(0, str.indexOf(".") + length + 1);
  return Number(str);
}

export function differenceBetweenTwoDates(
  startDate = new Date(),
  endDate = new Date(),
  diffBy = "days"
) {
  try {
    let diff = moment(startDate).diff(moment(endDate), diffBy);
    return diff;
  } catch (er) {
    return 0;
  }
}
