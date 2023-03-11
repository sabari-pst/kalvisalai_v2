import Ract from "react";
import Axios from "axios";
import toast from "react-hot-toast";
import { ServiceUrl } from "../utils/serviceUrl";

export const listHrGrades = async (status = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.HR.LIST_GRADES}`;
    if (status) url = url + "?status=" + status;
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

export const listHrBreakupHeads = async (status = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.HR.LIST_BREAKUP_HEADS}`;
    if (status) url = url + "?status=" + status;
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

export const listBioMetricDevices = async (status = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.HR.LIST_BIOMETRIC_DEVICES}`;
    if (status) url = url + "?status=" + status;
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

export const listHolidays = async (status = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.HR.LIST_HOLIDAYS}`;
    if (status) url = url + "?status=" + status;
    Axios.get(url)
      .then(function ({ data }) {
        if (data.status != "1") {
          //toast.error(data.message || "Error");
        }
        resolve(data);
      })
      .catch(function (error) {
        //resolve([]);
        return [];
      });
  });
};

export const listEmployees = async (status = false, getValues = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.HR.LIST_EMPLOYEES}`;
    if (status) url = url + "?status=" + status;
    if (getValues) url = url + "&" + getValues;
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

export const listBranches = async (status = false, leaveDate = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.HR.LIST_BRANCHES}`;
    if (status) url = url + "?status=" + status;
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
export const listsubject = async (status = false, leaveDate = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.SETTINGS.LIST_SUBJECT}`;
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

export const listCourseSubjects = async (status = false, leaveDate = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.SETTINGS.LIST_COURSE_SUBJECT}`;
    if (status) url = url + "?status=" + status;
    Axios.get(url)
      .then(function ({ data }) {
        if (data.status != "1") {
          toast.error(data.message || "Error");
        }
        //resolve(data.data);
        resolve({ data: data.data, count: data.count });
      })
      .catch(function (error) {
        //resolve([]);
        return [];
      });
  });
};

export const lisstafftsubject = async (status = false, getValues = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.SETTINGS.LIST_STAFFSUBJECT}`;
    if (status) url = url + "?status=" + status;
    if (getValues) url = url + "&" + getValues;
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

export const liststDepartments = async (status = false, leaveDate = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.SETTINGS.LIST_DEPARTMENT}`;
    if (status) url = url + "?status=" + status;
    Axios.get(url)
      .then(function ({ data }) {
        if (data.status != "1") {
          //toast.error(data.message || 'Error');
        }
        resolve(data.data);
      })
      .catch(function (error) {
        //resolve([]);
        return [];
      });
  });
};

export const listDepartments = async (status = false, leaveDate = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.HR.LIST_DEPARTMENTS}`;
    if (status) url = url + "?status=" + status;
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

export const listDesignations = async (status = false, leaveDate = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.HR.LIST_DESIGNATIONS}`;
    if (status) url = url + "?status=" + status;
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

export const listGradeSettings = async (gradeId) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.HR.LIST_GRADE_SETTINGS}`;
    if (gradeId) url = url + "?grade_id=" + gradeId;
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
