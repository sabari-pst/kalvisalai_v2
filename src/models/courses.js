import Ract from "react";
import Axios from "axios";
import toast from "react-hot-toast";
import { ServiceUrl } from "../utils/serviceUrl";
import { groupByMultiple, upperCase } from "../utils";

export const listAllCourses = async (status = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.ACADEMIC.LIST_COURSES}`;
    if (status) url = `${url}?status=${status}`;

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

export const listAllCoursesV2 = async (status = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.ACADEMIC.LIST_COURSES_V2}`;
    if (status) url = `${url}?status=${status}`;
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

export const loadDepartmentOptions = (
  optSource,
  groupField = "dept_type",
  defaultValue = false
) => {
  let m = groupByMultiple(optSource, function (obj) {
    return [obj[groupField]];
  });
  let rv = [];

  const innerOption = (item) => (
    <option
      value={item.id}
      selected={item.id == defaultValue ? "selected" : ""}
    >
      {item.department} - {item[groupField] == "unaided" ? "(SF)" : "(R)"}
    </option>
  );
  m.map((items, i) => {
    let x = items.map((item) => innerOption(item));
    rv.push(<optgroup label={upperCase(items[0][groupField])}>{x}</optgroup>);
  });
  return rv;
};

export const loadCourseOptions = (
  optSource,
  groupField = "dept_type",
  defaultValue = false
) => {
  let m = groupByMultiple(optSource, function (obj) {
    return [obj[groupField]];
  });
  let rv = [];

  const innerOption = (item) => (
    <option
      value={item.id}
      selected={item.id == defaultValue ? "selected" : ""}
    >
      {item.degreename} - {item.name}{" "}
      {item[groupField] == "unaided" ? "(SF)" : "(R)"}
    </option>
  );
  m.map((items, i) => {
    let x = items.map((item) => innerOption(item));
    rv.push(<optgroup label={upperCase(items[0][groupField])}>{x}</optgroup>);
  });
  return rv;
};
