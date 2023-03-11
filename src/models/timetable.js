import Ract from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ServiceUrl } from "../utils/serviceUrl";

export const dayOrderByBatch = async (params = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.UTILITIES.DAY_ORDER_BY_BATCH}?`;
    if (params) url += params;
    axios
      .get(url)
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
