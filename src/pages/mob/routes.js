// FOR ADMIN
import Dashboard from "./dashboard";
import markAttendance from "./markAttendance";
import myProfile from "./myProfile";

export default [
  {
    path: "/mob/app",
    component: Dashboard,
    title: "Dashboard",
    exact: true,
  },
  {
    path: "/mob/app/myprofile",
    component: myProfile,
    title: "My Profile",
    exact: true,
  },
  {
    path: "/mob/app/attendancentry",
    component: markAttendance,
    title: "Attendance Entry",
    exact: true,
  },
];
