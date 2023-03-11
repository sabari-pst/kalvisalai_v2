import Ract from "react";
import Axios from "axios";
import toast from "react-hot-toast";
import { ServiceUrl } from "../utils/serviceUrl";

export const listStudentTemplates = async () => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.UTILITIES.LIST_STUDENT_CERTIFICATES}`;
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

export const getStudentTemplate = async (id) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.UTILITIES.GET_STUDENT_CERTIFICATE}?id=${id}`;
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

export const listSmsLogs = async (status = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.STUDENTS.STUDENT_SMS_LOGS}`;
    if (status) url = url + "?status=" + status;
    Axios.get(url)
      .then(function ({ data }) {
        if (data.status != "1") {
          toast.error(data.message || "Error");
        }
        resolve({ data: data.data, count: data.count });
      })
      .catch(function (error) {
        //resolve([]);
        return [];
      });
  });
};
