import React, { Component } from "react";

import AVI from "./images/filetype/avi.png";
import CSS from "./images/filetype/css.png";
import CSV from "./images/filetype/csv.png";
import DBF from "./images/filetype/dbf.png";
import DOC from "./images/filetype/doc.png";
import FILE from "./images/filetype/file.png";
import FLA from "./images/filetype/fla.png";
import HTML from "./images/filetype/html.png";
import ISO from "./images/filetype/iso.png";
import JAVASCRIPT from "./images/filetype/javascript.png";
import JPG from "./images/filetype/jpg.png";
import JSON from "./images/filetype/json.png";
import MP3 from "./images/filetype/mp3.png";
import MP4 from "./images/filetype/mp4.png";
import PDF from "./images/filetype/pdf.png";
import PHOTOSHOP from "./images/filetype/photoshop.png";
import PNG from "./images/filetype/png.png";
import PPT from "./images/filetype/ppt.png";
import PSD from "./images/filetype/psd.png";
import RTF from "./images/filetype/rtf.png";
import SVG from "./images/filetype/svg.png";
import TXT from "./images/filetype/txt.png";
import XLS from "./images/filetype/xls.png";
import XML from "./images/filetype/xml.png";
import ZIP from "./images/filetype/zip.png";
import SQL from "./images/filetype/sql.png";
import PHP from "./images/filetype/php.png";

import FOLDER from "./images/filetype/folder.png";
import FOLDER_EMPTY from "./images/filetype/folder_empty.png";
import { removeBothSlash, S3_BUCKET_HOME_PATH } from "../../../utils";
import { Breadcrumb } from "react-bootstrap";

export function getFolderName(item) {
  let paths = removeBothSlash(item).split("/");
  if (paths && paths.length > 0) return paths[paths.length - 1];
}

export function getFileTypeImage(item) {
  try {
    let paths = removeBothSlash(item).split("/");
    let extension = item.substring(item.lastIndexOf("."));
    //let extension = item.split(".").slice(0, -1).join(".");

    var size = item.size;

    let fileType = getFileExtension(item);

    /*if (fileType == "..") {
      if (size == "0" || size == "0 bytes") return FOLDER_EMPTY;
      return FOLDER;
    } else if (
      fileType == "png" ||
      fileType == "jpg" ||
      fileType == "jpeg" ||
      fileType == "gif" ||
      fileType == "bmp" ||
      fileType == "PNG" ||
      fileType == "JPG" ||
      fileType == "JPEG" ||
      fileType == "GIF" ||
      fileType == "BMP"
    ) {
      //return Api.Url + item.path + "/" + item.name;
	  return FOLDER;
    }*/

    switch (fileType) {
      case "png":
        return PNG;
        break;
      case "jpeg":
        return JPG;
        break;
      case "jpg":
        return JPG;
        break;
      case "doc":
        return DOC;
        break;
      case "docx":
        return DOC;
        break;
      case "xls":
        return XLS;
        break;
      case "xlsx":
        return XLS;
        break;
      case "ppt":
        return PPT;
        break;
      case "pdf":
        return PDF;
        break;
      case "svg":
        return SVG;
        break;
      case "xml":
        return XML;
        break;
      case "css":
        return CSS;
        break;
      case "html":
        return HTML;
        break;
      case "txt":
        return TXT;
        break;
      case "rtf":
        return RTF;
        break;
      case "js":
        return JAVASCRIPT;
        break;
      case "zip":
        return ZIP;
        break;
      case "json":
        return JSON;
        break;
      case "mp3":
        return MP3;
        break;
      case "mp4":
        return MP4;
        break;
      case "sql":
        return SQL;
        break;
      case "php":
        return PHP;
        break;
      default:
        return FOLDER;
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

export function getFileBgColor(item) {
  try {
    let paths = removeBothSlash(item).split("/");
    let extension = item.substring(item.lastIndexOf("."));
    //let extension = item.split(".").slice(0, -1).join(".");

    var fileType = extension.replace(".", "");
    var size = item.size;

    switch (fileType) {
      case "png":
        return "#f1ffe5";
        break;
      case "jpeg":
        return "#f4fffd";
        break;
      case "jpg":
        return "#f4fffd";
        break;
      case "doc":
        return "#f4fffd";
        break;
      case "docx":
        return "#f4fffd";
        break;
      case "xls":
        return "#f1ffe5";
        break;
      case "xlsx":
        return "#f1ffe5";
        break;
      case "ppt":
        return "#fff3ed";
        break;
      case "pdf":
        return "#fff3ed";
        break;
      case "svg":
        return "#fff3ed";
        break;
      case "xml":
        return "#f4fffd";
        break;
      case "css":
        return "#f4fffd";
        break;
      case "html":
        return "#f4fffd";
        break;
      case "txt":
        return "#f4fffd";
        break;
      case "rtf":
        return "#f4fffd";
        break;
      case "js":
        return "#f4fffd";
        break;
      case "zip":
        return "#fff3ed";
        break;
      case "json":
        return "#fff3ed";
        break;
      case "mp3":
        return "#fff3ed";
        break;
      case "mp4":
        return "#fff3ed";
        break;
      default:
        return "#fff";
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

export function getFileExtension(item) {
  let paths = removeBothSlash(item).split("/");
  let extension = item.substring(item.lastIndexOf("."));
  //let extension = item.split(".").slice(0, -1).join(".");

  return extension.replace(".", "");

  //return fileType;
}

export function isImage(item) {
  let ext = getFileExtension(item.Key);

  return ext == "png" ||
    ext == "jpg" ||
    ext == "jpeg" ||
    ext == "gif" ||
    ext == "tiff"
    ? true
    : false;
}
