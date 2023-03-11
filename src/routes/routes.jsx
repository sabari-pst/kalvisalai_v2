import React, { Suspense } from "react";
import { Switch, Route, BrowserRouter, HashRouter } from "react-router-dom";

import { Spinner } from "react-bootstrap";

const AppPage = React.lazy(() => import("../pages/app"));
const Login = React.lazy(() => import("../pages/login"));
const Layout = React.lazy(() => import("../pages/app/layout"));
const MobileLayout = React.lazy(() => import("../pages/mob/layout"));
const MobileLoginView = React.lazy(() =>
  import("../pages/login/mobileLoginView")
);

export default () => (
  <HashRouter>
    <Suspense
      fallback={
        <div className="text-center" style={{ marginTop: "calc(30vh)" }}>
          <Spinner animation="border" />
        </div>
      }
    >
      <Switch>
        <Route path="/mob/app" component={MobileLayout} />
        <Route path="/mob" component={MobileLoginView} />

        <Route path="/app" component={Layout} />

        <Route path="/" component={Login} />
      </Switch>
    </Suspense>
  </HashRouter>
);
