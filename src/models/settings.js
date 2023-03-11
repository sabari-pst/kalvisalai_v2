import Ract from "react";
import Axios from "axios";
import toast from "react-hot-toast";
import { ServiceUrl } from "../utils/serviceUrl";

export const listSettings = async (field_for, ug_pg, course_type) => {
  if (!field_for || !ug_pg || !course_type) {
    toast.error("Argument Missing");
    return;
  }
  return new Promise((resolve, reject) => {
    Axios.get(
      `${ServiceUrl.FIELD_SETTINGS.LIST}?field_for=${field_for}&ug_pg=${ug_pg}&course_type=${course_type}`
    )
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

export const listCashbooks = async (status = false) => {
  let url = ServiceUrl.SETTINGS.LIST_CASHBOOKS;
  if (status) url += "?status=1";

  return new Promise((resolve, reject) => {
    Axios.get(url)
      .then(function ({ data }) {
        if (data.status != "1") {
          //toast.error(data.message || "Error");
        }
        resolve(data.data);
      })
      .catch(function (error) {
        //resolve([]);
        return [];
      });
  });
};

export const listCommunity = async () => {
  return new Promise((resolve, reject) => {
    Axios.get(ServiceUrl.SETTINGS.LIST_COMMUNITY)
      .then(function ({ data }) {
        resolve(data.data);
      })
      .catch(function (error) {
        //resolve([]);
        return [];
      });
  });
};

export const listReligions = async () => {
  return new Promise((resolve, reject) => {
    Axios.get(ServiceUrl.SETTINGS.LIST_RELIGIONS)
      .then(function ({ data }) {
        resolve(data.data);
      })
      .catch(function (error) {
        //resolve([]);
        return [];
      });
  });
};

export const listSubjectNatures = async () => {
  return new Promise((resolve, reject) => {
    Axios.get(ServiceUrl.SETTINGS.LIST_SUBJECT_NATURE)
      .then(function ({ data }) {
        resolve(data.data);
      })
      .catch(function (error) {
        //resolve([]);
        return [];
      });
  });
};
