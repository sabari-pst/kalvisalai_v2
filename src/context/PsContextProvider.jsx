import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import PsContext from "./index";
import { getLs, setLs, upperCase } from "../utils";
import { listSettingsFields } from "../models/fieldSettings";
import { Spinner } from "react-bootstrap";

import jwt from "jwt-simple";

const PsContextProvider = (props) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const breakpoint = 620;

  const token = "21R91541sD5411H0G5";

  useEffect(() => {
    /* Inside of a "useEffect" hook add an event listener that updates
       the "width" state variable when the window size changes */
    window.addEventListener("resize", () => setWindowWidth(window.innerWidth));

    /* passing an empty array as the dependencies of the effect will cause this
       effect to only run when the component mounts, and not each time it updates.
       We only want the listener to be added once */
  }, []);

  const isMobileView = () => (windowWidth < breakpoint ? true : false);

  const checkUserLogged = () => {
    return getLs("coa_logged") || "no";
  };

  const checkUserMobilePassword = () => {
    return getLs("coa_mob_pass") || "";
  };

  const checkMobileUserId = () => {
    return getLs("coa_mob_uuid") || "";
  };

  const getAdminUser = () => {
    return getLs("coa_user_data") && getLs("coa_user_data") !== "undefined"
      ? JSON.parse(getLs("coa_user_data"))
      : [];
  };

  const getAdminCompany = () => {
    return getLs("coa_company_data") &&
      getLs("coa_company_data") !== "undefined"
      ? JSON.parse(getLs("coa_company_data"))
      : [];
  };

  const getAdminApi = () => {
    return getLs("coa_api") || "";
  };

  const getSettings = () => {
    return getLs("adm_settings") && getLs("adm_settings") !== "undefined"
      ? JSON.parse(getLs("adm_settings"))
      : [];
  };

  const getAcyear = () => {
    return getLs("adm_acyear_cur") && getLs("adm_acyear_cur") !== "undefined"
      ? JSON.parse(getLs("adm_acyear_cur"))
      : [];
  };

  const getPermissions = () => {
    return getLs("adm_user_permissions") &&
      getLs("adm_user_permissions") !== "undefined"
      ? JSON.parse(getLs("adm_user_permissions"))
      : [];
  };

  const getCashbook = () => {
    return getLs("adm_user_cashbook") &&
      getLs("adm_user_cashbook") !== "undefined"
      ? JSON.parse(getLs("adm_user_cashbook"))
      : [];
  };

  const [state, setState] = useState([]);

  const [logged, setLogged] = useState(checkUserLogged());

  const [mobilePass, setMobilePass] = useState(checkUserMobilePassword());
  const [mobileUserId, setMobileUserId] = useState(checkMobileUserId());

  const [user, setUser] = useState(getAdminUser());
  const [api, setApi] = useState(getAdminApi());

  const [backgroundProcess, setBackgroundProcess] = useState(false);

  const [settings, setSettings] = useState(getSettings());
  const [acyear, setSAcyear] = useState(getAcyear());

  const [accessPermissions, setAccessPermissions] = useState(getPermissions());
  const [cashbook, setCashbook] = useState(getCashbook());

  const [selectedAdmissionYear, setadmissionYear] = useState("2022");

  const [loader, setLoader] = useState(false);

  const saveLogin = (user, api, permissions = [], cb = [], mobPass = "") => {
    /*var now = new Date();
		var minutes = 1;
		now.setTime(now.getTime() + (minutes * 60 * 1000));*/

    setLs("coa_user_data", JSON.stringify(user));
    setUser(user);

    setLs("coa_api", api);
    setApi(api);

    setLs("adm_user_permissions", JSON.stringify(permissions));
    setAccessPermissions(permissions);

    setLs("adm_user_cashbook", JSON.stringify(cb));
    setCashbook(cb);

    //setLs('mat_logged', 'yes');
    //setLogged('yes');
  };

  const logout = () => {
    setLs("coa_user_data", false);
    setUser([]);
    setSAcyear([]);
    setLs("coa_api", "");
    setLs("adm_acyear_cur", false);
    setApi(null);
    axios.defaults.headers.common["Api-Token"] = "";
    setLs("adm_user_permissions", "");
    setAccessPermissions([]);
    setCashbook([]);
    setLs("coa_logged", "no");
    setLogged("no");
  };

  const getDecodeApi = () => {
    let decoded = jwt.decode(api, token);
    return decoded;
  };

  const setEncodeApi = (decoded) => {
    let encoded = jwt.encode(decoded, token);
    axios.defaults.headers.common["Api-Token"] = encoded;
    setLs("coa_api", encoded);
    setApi(api);
  };

  const updateUser = (us) => {
    if (us.academic_department) {
      let decoded = getDecodeApi();
      decoded.academic_department = us.academic_department;
      setEncodeApi(decoded);
    }
    setLs("coa_user_data", JSON.stringify(us));
    setUser(us);
    forceUpdate();
  };

  const updateCashbook = (cb) => {
    let decoded = getDecodeApi();
    decoded.allowd_cash_books = cb.id;
    setEncodeApi(decoded);
    setLs("adm_user_cashbook", JSON.stringify(cb));
    setCashbook(cb);
    forceUpdate();
  };

  const updateLogged = () => {
    setLs("coa_logged", "yes");
    setLogged("yes");
  };

  const loadSettings = () => {
    listSettingsFields().then((res) => {
      setLs("adm_settings", JSON.stringify(res));
      setSettings(res);
    });
  };

  const settingValue = (key) => {
    let m = settings && settings.find((item) => item.field_name == key);
    return m && m.field_name ? m.field_value : false;
  };

  const updateAcyear = (v) => {
    setSAcyear(v);
    setLs("adm_acyear_cur", JSON.stringify(v));
  };

  const updateMobileUserId = (v) => {
    setMobileUserId(v);
    setLs("coa_mob_uuid", v);
  };

  const updateMobilePassword = (v) => {
    setLs("coa_mob_pass", v);
    setMobilePass(v);
  };

  const setStorage = (storageName, storageValue) => {
    setLs(storageName, storageValue);
  };

  const getStorage = (storageName) => {
    return getLs(storageName); /* && getLs(storageName) !== "undefined"
      ? getLs(storageName)
      : null;*/
  };

  const allowedAccess = (module, action) => {
    let permissions = accessPermissions;
    try {
      if (upperCase(user.role) == "DEV") return true;

      /* if (props.roleGroup && props.roleGroup.length > 0) {
        let allowedRoleGroups = findCommonElement(
          permissions.map((item) => item.role_group),
          props.roleGroup
        );
        return allowedRoleGroups;
      }*/

      if (!module || !action) return false;

      let moduleExist = permissions.filter(
        (item) => upperCase(item.module) == upperCase(module)
      );

      if (moduleExist.length < 1) return false;

      let allowed = moduleExist.find(
        (item) => upperCase(item.action_name) == upperCase(action)
      );

      return allowed ? true : false;
    } catch (er) {
      return false;
    }
  };

  const forceUpdate = useCallback(() => setState({}), []);

  return (
    <PsContext.Provider
      value={{
        state: state,
        logged: logged,
        user: user,
        acyear: acyear,
        api: api,
        saveLogin: saveLogin,
        updateUser: updateUser,
        updateLogged: updateLogged,
        setBackgroundProcess: setBackgroundProcess,
        backgroundProcess: backgroundProcess,
        logout: logout,
        loadSettings: loadSettings,
        settingValue: settingValue,
        selectedAdmissionYear: selectedAdmissionYear,
        updateAcyear: updateAcyear,
        accessPermissions: accessPermissions,
        allowedAccess: allowedAccess,
        cashbook: cashbook,
        updateCashbook: updateCashbook,
        isMobileView: isMobileView,
        mobilePass: mobilePass,
        mobileUserId: mobileUserId,
        updateMobileUserId: updateMobileUserId,
        updateMobilePassword: updateMobilePassword,
        setLoader: setLoader,
        setStorage: setStorage,
        getStorage: getStorage,
      }}
    >
      {loader && (
        <div className="ps__loader">
          <div className="ps__loader__body">
            <div className="ps__loader__content">
              <Spinner animation="grow" size="lg" />
              <br />
              Please Wait
            </div>
          </div>
        </div>
      )}

      {props.children}
    </PsContext.Provider>
  );
};

export default PsContextProvider;
