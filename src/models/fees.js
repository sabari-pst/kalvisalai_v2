import Ract from "react";
import Axios from "axios";
import toast from "react-hot-toast";
import { ServiceUrl } from "../utils/serviceUrl";

export const listFeeCategoy = async (status = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.FEE_CATEGORY.LIST_CATEGORY}`;
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

export const listPaymentMethods = async (status = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.FEE_CATEGORY.LIST_PAYMENT_METHOD}`;
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

export const listFeeGroups = async (status = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.FEE_CATEGORY.LIST_FEE_GROUP}`;
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

export const listFeeTemplates = async (status = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.FEES.LIST_TEMPLATES}`;
    if (status) url = `${url}?status=${status}`;

    Axios.post(url)
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

export const listFeeBanks = async (status = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.FEES.LIST_BANKS}`;
    if (status) url = `${url}?status=${status}`;

    Axios.post(url)
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

export const listGatewaySubAccounts = async (status = false) => {
  return new Promise((resolve, reject) => {
    let url = `${ServiceUrl.SETTINGS.LIST_GATEWAY_SUBACCOUNT}`;
    if (status) url = `${url}?status=${status}`;

    Axios.post(url)
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
