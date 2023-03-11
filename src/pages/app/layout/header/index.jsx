import React, { useState, useContext, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import routes from "../../routes";
import Logout from "./Logout";
import Notifications from "./Notifications";
import SearchForm from "./SearchForm";
import UserProfile from "./UserProfile";
import CompanyTitle from "./CompanyTitle";
import PsContext from "../../../../context";
import { Button } from "react-bootstrap";
import { appName } from "../../../../utils";
import DepartmentSelectLink from "../../departmentCms/departmentSelectLink";

const Header = (props) => {
  const context = useContext(PsContext);

  const handleSidebarCollapse = () => {
    if (document.body.classList.contains("sidebar-mini")) {
      document.body.classList.remove("sidebar-mini");
      document.body.classList.add("fixed-layout");
    } else {
      document.body.classList.remove("fixed-layout");
      document.body.classList.add("sidebar-mini");
    }
  };

  const [title, setTitle] = useState(null);

  useEffect(() => {
    updateTitle();
  }, [props.location.pathname]);

  const updateTitle = () => {
    let r = routes.find((item) => item.path == props.location.pathname);

    if (r && r.title) {
      setTitle(r.title);
    } else {
      setTitle(appName);
    }
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <header className="header">
        <div className="page-brand">
          <a className="link">
            <span className="brand">
              Kalvi
              <span className="brand-tip">
                Salai <sup style={{ fontSize: "10px" }}>V2</sup>
              </span>
            </span>
            <span className="brand-mini">KS</span>
          </a>
        </div>

        <div className="flexbox flex-1">
          <ul className="nav navbar-toolbar">
            <li>
              <a
                className="nav-link sidebar-toggler js-sidebar-toggler"
                onClick={() => handleSidebarCollapse()}
              >
                <i className="ti-menu"></i>
              </a>
            </li>
            <li className="d-none d-md-block">{<CompanyTitle />}</li>

            {/*<li className='d-none d-md-block' >
							<SearchForm />
						</li>*/}
          </ul>

          <ul className="nav navbar-toolbar">
            <DepartmentSelectLink />
            <li className="border-start">
              <UserProfile />
            </li>
            <li className="border-start text-center px-2">
              <div style={{ fontSize: "10px" }}>Financial Year</div>
              <Button size="sm" variant="transparent" className="fw-bold">
                {context.acyear.name}
              </Button>
            </li>

            <li className="border-start">
              <Logout />
            </li>
          </ul>
        </div>
      </header>
    </React.Fragment>
  );
};

export default withRouter(Header);
