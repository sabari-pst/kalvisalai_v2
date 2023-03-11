import Ract from "react";
import Axios from "axios";
import toast from "react-hot-toast";
import { ServiceUrl } from "../utils/serviceUrl";
import { param } from "jquery";

export const listCategoryNames = async (type = "page") => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.WEBSITE_CMS.LIST_CATEGORY_NAMES}?type=${type}`;
    Axios.get(url)
      .then(function ({ data }) {
        if (data.status != "1") {
          toast.error(data.message || "Error");
        }
        resolve(data.data);
      })
      .catch(function (error) {
        //resolve([]);
        return [];
      });
  });
};

export const getDepartmentPage = async (params = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.DEPT_CMS.GET_PAGE}?status=1&`;
    if (params) url += params;

    Axios.get(url)
      .then(function ({ data }) {
        if (data.status != "1") {
          toast.error(data.message || "Error");
        }
        resolve(data);
      })
      .catch(function (error) {
        //resolve([]);
        return [];
      });
  });
};

export const getDepartmentFiles = async (params = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.DEPT_CMS.LIST_FILES}?status=1&`;
    if (params) url += params;

    Axios.get(url)
      .then(function ({ data }) {
        if (data.status != "1") {
          toast.error(data.message || "Error");
        }
        resolve(data);
      })
      .catch(function (error) {
        //resolve([]);
        return [];
      });
  });
};
