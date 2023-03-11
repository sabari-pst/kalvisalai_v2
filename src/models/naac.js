import Ract from "react";
import Axios from "axios";
import toast from "react-hot-toast";
import { ServiceUrl } from "../utils/serviceUrl";

export const listCriteria = async (status = false, params = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.NAAC.LIST_CRITERIA}?`;
    if (status) url += "status=1";
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

export const listCriteriaGroup = async (status = false, params = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.NAAC.LIST_CRITERIA_GROUP}?`;
    if (status) url += "status=1";
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

export const listNaacReports = async (status = false, params = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.NAAC.LIST_REPORTS}?`;
    if (status) url += "status=1";
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
