import Ract from "react";
import Axios from "axios";
import toast from "react-hot-toast";
import { ServiceUrl } from "../utils/serviceUrl";

export const listAcademicYears = async (status = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.ACADEMIC.LIST_ACADEMIC_YEARS}`;
    if (status) url = `${url}?status=${status}`;

    Axios.get(url)
      .then(function ({ data }) {
        if (data.status == "1") resolve(data.data);
        else resolve([]);
      })
      .catch(function (error) {
        //resolve([]);
        return [];
      });
  });
};

export const listBatches = async (status = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.SETTINGS.LIST_BATCH}`;
    if (status) url = `${url}?status=${status}`;

    Axios.get(url)
      .then(function ({ data }) {
        if (data.status == "1") resolve(data.data);
        else resolve([]);
      })
      .catch(function (error) {
        //resolve([]);
        return [];
      });
  });
};

export const listCollegeYears = async (status = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.SETTINGS.COLLEGE_YEARS}`;
    if (status) url = `${url}?status=${status}`;

    Axios.get(url)
      .then(function ({ data }) {
        if (data.status == "1") resolve(data.data);
        else resolve([]);
      })
      .catch(function (error) {
        //resolve([]);
        return [];
      });
  });
};

export const currentSemesterStartAndEndDate = async () => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.MOB.CURRENT_SEM_DATE}`;
    Axios.get(url)
      .then(function ({ data }) {
        if (data.status == "1") resolve(data.data);
        else resolve([]);
      })
      .catch(function (error) {
        //resolve([]);
        return [];
      });
  });
};

export const getSemesterDates = async (bat = false, sem = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.SETTINGS.SEMESTER_DATES}?`;
    if (bat) url += "&batch=" + bat;
    if (sem) url += "&semester=" + sem;
    Axios.get(url)
      .then(function ({ data }) {
        if (data.status == "1") resolve(data.data);
        else resolve([]);
      })
      .catch(function (error) {
        //resolve([]);
        return [];
      });
  });
};

export const listAttendancePercentages = async (bat = false, sem = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.UTILITIES.LIST_ATTENDANCE_PERCENTAGES}?`;

    Axios.get(url)
      .then(function ({ data }) {
        if (data.status == "1") resolve(data.data);
        else resolve([]);
      })
      .catch(function (error) {
        //resolve([]);
        return [];
      });
  });
};
