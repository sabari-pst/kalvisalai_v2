import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import PsContext from ".";
import { findCommonElement, upperCase } from "../utils";

const ModuleAccess = (props) => {
  const context = useContext(PsContext);

  const checkUserAllowed = () => {
    try {
      let permissions = context.accessPermissions;

      if (upperCase(context.user.role) == "DEV") return true;

      if (props.roleGroup && props.roleGroup.length > 0) {
        let allowedRoleGroups = findCommonElement(
          permissions.map((item) => item.role_group),
          props.roleGroup
        );

        return allowedRoleGroups;
      }

      if (props.module && Array.isArray(props.module)) {
        let allowedModules = findCommonElement(
          permissions.map((item) => item.module),
          props.module
        );
        return allowedModules;
      }

      if (!props.module || !props.action) return false;

      if (upperCase(props.module) == "ANY" && upperCase(props.action) == "ANY")
        return true;

      let moduleExist = permissions.filter(
        (item) => upperCase(item.module) == upperCase(props.module)
      );

      if (moduleExist.length < 1) return false;

      let allowed = moduleExist.find(
        (item) => upperCase(item.action_name) == upperCase(props.action)
      );

      return allowed ? true : false;

      //return (moduleExist.actions.hasOwnProperty(props.action)) ? true : false;
    } catch (er) {
      console.log(er);
      return false;
    }
  };

  return checkUserAllowed() && <>{props.children}</>;
};
export default ModuleAccess;
