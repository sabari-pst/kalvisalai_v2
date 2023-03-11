import { Button, Dialog, List } from "antd-mobile";
import React, { useState, useContext, useEffect } from "react";

import { withRouter } from "react-router-dom";

import PsContext from "../../../context";
import { momentDate, sleep } from "../../../utils";
import FooterTab from "../layout/footerTab";
import HeaderBar from "../layout/headerBar";

const MyProfile = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);

  const lockClick = () => {
    Dialog.confirm({
      content: "Do you want to lock?",
      confirmText: "Yes",
      cancelText: "No",
      onConfirm: async () => {
        await sleep(2000);
        context.logout();
        window.location.reload(true);
      },
    });
  };

  const logoutClick = () => {
    Dialog.confirm({
      content: "Do you want to logout?",
      confirmText: "Yes",
      cancelText: "No",
      onConfirm: async () => {
        await sleep(2000);
        context.logout();
        context.updateMobileUserId("");
        context.updateMobilePassword("");
      },
    });
  };

  return (
    <div>
      <HeaderBar title="My Profile" />
      <div className="mt-50">
        <List>
          <List.Item
            prefix={<i className="fa-sharp fa-solid fa-user me-2"></i>}
          >
            {context.user.emp_name}
          </List.Item>
          <List.Item
            prefix={<i className="fa-sharp fa-solid fa-calendar me-2"></i>}
          >
            {momentDate(context.user.emp_dob, "DD-MMM-YYYY")}
          </List.Item>
          <List.Item
            prefix={<i className="fa-sharp fa-solid fa-phone me-2"></i>}
          >
            {context.user.emp_personal_mobile}
          </List.Item>
          <List.Item
            prefix={<i className="fa-sharp fa-solid fa-envelope me-2"></i>}
          >
            {context.user.emp_personal_mail}
          </List.Item>
          <List.Item prefix={<i className="fa-sharp fa-solid fa-map me-2"></i>}>
            {context.user.emp_current_address}
          </List.Item>
          <List.Item
            prefix={
              <i className="fa-sharp fa-solid fa-location-crosshairs me-2"></i>
            }
          >
            {context.user.emp_current_city}
          </List.Item>
        </List>
        <div className="mt-5 text-center">
          <Button
            size="middle"
            color="danger"
            onClick={(e) => logoutClick()}
            className="me-2"
          >
            <i className="fa-sharp fa-solid fa-arrow-right-from-bracket me-2"></i>
            Logout App
          </Button>
          <Button size="middle" color="primary" onClick={(e) => lockClick()}>
            <i className="fa-sharp fa-solid fa-arrow-right-from-bracket me-2"></i>
            Lock Screen
          </Button>
        </div>
      </div>
      <FooterTab />
    </div>
  );
};

export default withRouter(MyProfile);
