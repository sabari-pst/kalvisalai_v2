// FOR ADMIN
import Dashboard from "./admin/dashboard";

//new entries
import VariableSettings from "./admin/settings/variableSettings";
import SmsTemplates from "./admin/settings/smsTemplates";

import MyProfile from "./admin/user";
import MailTemplates from "./admin/settings/mailTemplates";
import Admin_userLogin from "./admin/userLogin";
import FeeCategory from "./feeSettings/feeCategory";
import FeePaymentMethods from "./feeSettings/feePaymentMethods";
import ClassWiseFeeAssigning from "./feeAssigning/classWiseFeeAssigning";
import UserRoles from "./settings/userRoles";
import StudentWiseFeeAssigning from "./feeAssigning/studentWiseFeeAssigning";
import NewFeePayment from "./feePayment/newFeePayment";
import FeePaymentList from "./feePayment/feePaymentList";
import CategoryReport from "./feeReports/categoryReport";
import CategorySummary from "./feeReports/categorySummary";
import ClassWisePending from "./feeReports/classWisePending";

import AttendanceSheet from "./hr/attendanceSheet";
import Hr_Employees from "./hr/employees";
import Hr_BioDevices from "./hr/bioDevices";
import Hr_HolidayMaster from "./hr/holidayMaster";
import Hr_BranchMaster from "./hr/branchMaster";
import Hr_DepartmentMaster from "./hr/departmentMaster";
import Hr_DesignationMaster from "./hr/designationMaster";

import FeeTemplates from "./feeSettings/feeTemplates";
import CancelledBills from "./cancellBills/cancelledBills";
import vehicles from "./vehicles";
import vehicleDestinations from "./vehicleDestinations";
import students from "./students";
import TransportPendingReport from "./feeReports/transportPendingReport";

import courseSubjects from "./settings/courseSubjects";
import staffsubject from "./settings/staffsubject";
import StudentBoanfiedCertificates from "./Certificate/bonofied";
import attendance from "./Certificate/attendance";
import PrintTimeTable from "./TimeTable/PrintimeTable";
import Createtable from "./TimeTable/Createtable";

import Admin_Subjects from "./settings/subjects";
import academicDepartments from "./settings/academicDepartments";
import ClassWiseDemandReport from "./feeReports/classWiseDemandReport";
import semsterSetup from "./semsterSetup";
import batchSetup from "./batchSetup";
import MyTimeTable from "./TimeTable/myTimeTable";

import Pages from "./cms/pages";
import AddPage from "./cms/pages/addPage";
import EditPage from "./cms/pages/editPage";
import ViewPage from "./cms/pages/viewPage";
import MenuList from "./cms/menus";

import ClassWiseFeeAdjusting from "./feeAdjustment/classWiseFeeAdjusting";
import StudentWiseFeeAdjusting from "./feeAdjustment/studentWiseFeeAdjusting";
import FeeGroups from "./feeSettings/feeGroups";
import studentPromotion from "./studentPromotion";
import studentBulkEdit from "./studentBulkEdit";
import SearchStudents from "./students/searchStudents";
import NewBonafiedCertificate from "./Certificate/bonofied/newBonafiedCertificate";
import addStudent from "./students/addStudent";
import studentStrength from "./studentReports/studentStrength";
import AccessModules from "./settings/modules";
import fileManager from "./fileManager";
import pages from "./website/pages";
import addWebPage from "./website/pages/addWebPage";
import editWebPage from "./website/pages/editWebPage";
import announcements from "./website/announcements";
import webEvents from "./website/webEvents";
import addWebEvent from "./website/webEvents/addWebEvent";
import editWebEvents from "./website/webEvents/editWebEvents";
import CashBookSettings from "./admin/settings/cashBookSettings";
import webGallery from "./website/webGallery";
import webSliders from "./website/webSliders";
import naacCriteria from "./naac/naacCriteria";
import naacCriteriaGroup from "./naac/naacCriteriaGroup";
import naacSsrReport from "./naac/naacSsrReport";
import addNaacSsrReport from "./naac/naacSsrReport/addNaacSsrReport";
import editNaacSsrReport from "./naac/naacSsrReport/editNaacSsrReport";
import feeBankAccounts from "./feeBankAccounts";
import feeBankChallan from "./feeBankChallan";
import studentCertificates from "./utilities/studentCertificates";
import editStudentCertificate from "./utilities/studentCertificates/editStudentCertificate";
import FeeDelete from "./feeSettings/feeDelete";
import attendanceDayOrder from "./utilities/attendanceDayOrder";
import EditStudentAttendanceEntry from "./studentAttendance/editStudentAttendanceEntry";
import longAbsenties from "./studentAttendance/longAbsenties";
import CollegeYear from "./admin/settings/collegeYear";
import classWisePromotion from "./studentPromotion/classWisePromotion";
import userLogs from "./userLogs";
import SemesterWiseDemandReport from "./feeReports/semesterWiseDemandReport";
import academicCourses from "./settings/academicCourses";
import YearWiseDemandReport from "./feeReports/yearWiseDemandReport";
import FeeDayReport from "./feeReports/feeDayReport";
import FeeSemYearCollectionReport from "./feeReports/feeSemYearCollectionReport";
import classWise from "./studentSubjectAllocation/classWise";
import classWiseallocatedList from "./studentSubjectAllocation/classWise/classWiseallocatedList";
import studentWiseSubjectAllocation from "./studentSubjectAllocation/studentWiseSubjectAllocation";
import CourseSummary from "./feeReports/courseSummary";
import printBankChallan from "./feeBankChallan/printBankChallan";
import BankChallanList from "./feeBankChallan/bankChallanList";
import StudentWiseDemandReport from "./feeReports/studentWiseDemandReport";
import CashierDashboard from "./dashboards/cashierDashboard";
import leftStudents from "./leftStudents";
import attendanceMonthlyReport from "./studentAttendance/attendanceMonthlyReport";
import AttendanceStudentDetailsReport from "./studentAttendance/attendanceStudentDetailsReport";
import paymentGatewaySubaccounts from "./paymentGatewaySubaccounts";
import deleteDayEntry from "./studentAttendance/deleteDayEntry";

import mediumInstruction from "./Certificate/mediumInstruction";
import verification from "./Certificate/verification";
import conductCertificate from "./Certificate/conductCertificate";
import incompleteEntry from "./studentAttendance/incompleteEntry";
import StudentWiseBulkAllocation from "./studentSubjectAllocation/studentWiseBulkAllocation";
import bulkOdEntry from "./studentAttendance/bulkOdEntry";
import StudentsImport from "./studentsImport";
import deptCoursesList from "./departmentCms/deptCoursesList";
import deptSliders from "./departmentCms/deptSliders";
import deptVisionMission from "./departmentCms/deptVisionMission";
import deptAbout from "./departmentCms/deptAbout";
import deptActivities from "./departmentCms/deptActivities";
import deptAwards from "./departmentCms/deptAwards";
import deptSyllabus from "./departmentCms/deptSyllabus";
import StudentAttendanceEntry from "./studentAttendance/studentAttendanceEntry";
import subjectNatures from "./settings/subjectNatures";
import ClassWiseFeeDelete from "./feeSettings/classWiseFeeDelete";
import AttendanceMonthlyPercentage from "./studentAttendance/attendanceMonthlyPercentage";
import attendancePercentageSettings from "./utilities/attendancePercentageSettings";
import AddFineDefinition from "./fineDefinition/addFineDefinition";
import listHostelStudents from "./hostellers/listHostelStudents";
import FineDefinitionLogs from "./fineDefinition/fineDefinitionLogs";
import HostelBulkAdmission from "./hostellers/hostelBulkAdmission";
import studentAttendanceManualSms from "./studentAttendanceManualSms";
import FeeDateAdjustment from "./feeSettings/feeDateAdjustment";

export default [
  {
    path: "/app",
    component: Dashboard,
    title: "Dashboard",
    module: "master_settings_menu",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app",
    component: CashierDashboard,
    title: "Dashboard",
    module: "fee_payment",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/filemanager",
    component: fileManager,
    title: "File Manager",
    module: "cms_file_manager",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/user-logs",
    component: userLogs,
    title: "User Logs",
    module: "user_action_logs",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/master-settings/modules",
    component: AccessModules,
    title: "Access Modules",
    module: "settings_menu",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/master-settings/collegeyear",
    component: CollegeYear,
    title: "College Year",
    exact: true,
    module: "settings_college_year",
    action: "action_list",
  },
  {
    path: "/app/master-settings/cashbook",
    component: CashBookSettings,
    title: "Cash Book",
    exact: true,
  },
  {
    path: "/app/master-settings/cca-subaccounts",
    component: paymentGatewaySubaccounts,
    title: "CCA Sub Accounts",
    exact: true,
  },
  {
    path: "/app/master-settings/variable-settings",
    component: VariableSettings,
    title: "Master Settings",
    module: "master_settings_menu",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/master-settings/sms-templates",
    component: SmsTemplates,
    title: "SMS Templates",
    exact: true,
  },
  {
    path: "/app/master-settings/mail-templates",
    component: MailTemplates,
    title: "Mail Templates",
    exact: true,
  },

  {
    path: "/app/web/pages",
    component: pages,
    title: "Pages",
    exact: true,
    module: "cms_pages",
    action: "action_list",
  },
  {
    path: "/app/web/pages/new",
    component: addWebPage,
    title: "Add Page",
    exact: true,
    module: "cms_pages",
    action: "action_create",
  },
  {
    path: "/app/web/pages/edit/:id/:title",
    component: editWebPage,
    title: "Edit Page",
    exact: true,
    module: "cms_pages",
    action: "action_update",
  },
  {
    path: "/app/web/announcements",
    component: announcements,
    title: "Announcements",
    exact: true,
    module: "cms_web_announcements",
    action: "action_list",
  },
  {
    path: "/app/web/gallery",
    component: webGallery,
    title: "Gallery",
    exact: true,
    module: "cms_web_gallery",
    action: "action_list",
  },
  {
    path: "/app/web/sliders",
    component: webSliders,
    title: "Sliders",
    exact: true,
    module: "cms_web_sliders",
    action: "action_list",
  },
  {
    path: "/app/web/events",
    component: webEvents,
    title: "Events",
    exact: true,
    module: "cms_web_events",
    action: "action_list",
  },
  {
    path: "/app/web/events/new",
    component: addWebEvent,
    title: "Add Events",
    exact: true,
    module: "cms_web_events",
    action: "action_create",
  },
  {
    path: "/app/web/events/edit/:id/:title",
    component: editWebEvents,
    title: "Edit Events",
    exact: true,
    module: "cms_web_events",
    action: "action_update",
  },

  {
    path: "/app/cms/contents/:content_type/list",
    component: Pages,
    title: "Pages",
    exact: true,
  },
  {
    path: "/app/cms/contents/:content_type/add",
    component: AddPage,
    title: "Add Page",
    exact: true,
  },
  {
    path: "/app/cms/contents/:content_type/edit/:id",
    component: EditPage,
    title: "Add Page",
    exact: true,
  },
  {
    path: "/app/cms/contents/:content_type/view/:id",
    component: ViewPage,
    title: "Add Page",
    exact: true,
  },
  {
    path: "/app/cms/menus/list",
    component: MenuList,
    title: "Menu List",
    exact: true,
    module: "cms_web_menus",
    action: "action_list",
  },

  {
    path: "/app/user",
    component: MyProfile,
    title: "My Profile",
    module: "any",
    action: "any",
    exact: true,
  },
  {
    path: "/app/master-settings/userlogin",
    component: Admin_userLogin,
    title: "User Login",
    module: "settings_user_login",
    action: "action_list",
    exact: true,
  },

  {
    path: "/app/master-settings/batch",
    component: batchSetup,
    title: "Batch Setup",
    exact: true,
    module: "settings_batch_semester",
    action: "action_list",
  },
  {
    path: "/app/master-settings/semester-setup",
    component: semsterSetup,
    title: "Semester Setup",
    exact: true,
  },
  {
    path: "/app/master-settings/userroles",
    component: UserRoles,
    title: "User Roles",
    exact: true,
    module: "settings_user_roles",
    action: "action_list",
  },

  {
    path: "/app/master-settings/departments",
    component: academicDepartments,
    title: "Academic Departments",
    exact: true,
    //module: "academic_departments",
    //action: "action_list",
  },
  {
    path: "/app/master-settings/courses",
    component: academicCourses,
    title: "Academic Courses",
    exact: true,
    module: "academics_course_management",
    action: "action_list",
  },
  {
    path: "/app/master-settings/subject-nature",
    component: subjectNatures,
    title: "Subject Nature",
    exact: true,
    module: "academic_subject_nature",
    action: "action_list",
  },
  {
    path: "/app/master-settings/subjects",
    component: Admin_Subjects,
    title: "Subjects",
    exact: true,
    module: "academic_subject_management",
    action: "action_list",
  },

  {
    path: "/app/master-settings/courseSubjects",
    component: courseSubjects,
    title: "courseSubjects",
    exact: true,
    module: "academic_course_subject_allocate",
    action: "action_list",
  },
  {
    path: "/app/master-settings/staffsubject",
    component: staffsubject,
    title: "Staff Subject Master",
    exact: true,
    module: "academic_staff_subject_allocate",
    action: "action_list",
  },

  {
    path: "/app/timetable/my-timetable",
    component: MyTimeTable,
    title: "My TimeTable",
    exact: true,
    module: "timetable_my_timetable",
    action: "action_list",
  },
  {
    path: "/app/timetable/print-timetable",
    component: PrintTimeTable,
    title: "Print TimeTable",
    exact: true,
    module: "timetable_class_timetable",
    action: "action_list",
  },
  {
    path: "/app/timetable/create-timetable",
    component: Createtable,
    title: "Create Table",
    exact: true,
    module: "timetable_create_timetable",
    action: "action_list",
  },

  // Master Settings

  // Fee Settings
  {
    path: "/app/fee-settings/fee-category",
    component: FeeCategory,
    title: "Fee Category",
    module: "fee_settings_category",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/fee-settings/fee-groups",
    component: FeeGroups,
    title: "Fee Groups",
    module: "fee_settings_feegroup",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/fee-settings/fee-payment-methods",
    component: FeePaymentMethods,
    title: "Fee Payment Methods",
    module: "fee_settings_payment_method",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/fee-settings/fee-template",
    component: FeeTemplates,
    title: "Fee Templates",
    module: "fee_settings_feetemplate",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/fee-settings/fee-delete",
    component: FeeDelete,
    title: "Delete Assigned Fees",
    module: "fee_settings_delete",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/fee-settings/classwise-fee-delete",
    component: ClassWiseFeeDelete,
    title: "Class wise Fee Delete",
    module: "fee_setting_delete_class_wise_duplicate",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/fee-settings/paid-date-adjustmeent",
    component: FeeDateAdjustment,
    title: "Fee Paid Date Adjustment",
    module: "fee_paid_date_adjust",
    action: "action_update",
    exact: true,
  },

  {
    path: "/app/fee-assigning/class-wise",
    component: ClassWiseFeeAssigning,
    title: "Class Wise Fee Assigning",
    module: "fee_assign_course_wise",
    action: "action_create",
    exact: true,
  },
  {
    path: "/app/fee-assigning/student-wise",
    component: StudentWiseFeeAssigning,
    title: "Class Wise Fee Assigning",
    module: "fee_assing_student_wise",
    action: "action_create",
    exact: true,
  },
  {
    path: "/app/fee-assigning/class-wise-adjust",
    component: ClassWiseFeeAdjusting,
    title: "Class Wise Fee Adjusting",
    module: "fee_adjust_course_wise",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/fee-assigning/student-wise-adjust",
    component: StudentWiseFeeAdjusting,
    title: "Student Wise Fee Adjusting",
    module: "fee_adjust_student_wise",
    action: "action_list",
    exact: true,
  },

  {
    path: "/app/fee-payment/new-payment",
    component: NewFeePayment,
    title: "Fee Payment Entry",
    module: "fees_new_payment",
    action: "action_create",
    exact: true,
  },
  {
    path: "/app/fee-payment/payment-list",
    component: FeePaymentList,
    title: "Fee Payment List",
    module: "fee_payment_list",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/cancelled-bills",
    component: CancelledBills,
    title: "Cancelled Bills",
    module: "fee_cancel",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/fee/bank-accounts",
    component: feeBankAccounts,
    title: "Fee Bank Accounts",
    module: "fee_bank_accounts",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/fee/bank-challan-new",
    component: feeBankChallan,
    title: "Create Bank Challan",
    module: "fee_bank_challan",
    action: "action_create",
    exact: true,
  },
  {
    path: "/app/fee/bank-challans",
    component: BankChallanList,
    title: "Bank Challan List",
    module: "fee_bank_challan",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/fee/bank-challan-print/:uuid",
    component: printBankChallan,
    title: "Print Bank Challan",
    module: "fee_bank_challan",
    action: "action_print",
    exact: true,
  },

  // Fee Reports
  {
    path: "/app/fee-reports/day-report",
    component: FeeDayReport,
    title: "Fee Day Report",
    module: "fee_report_day_report",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/fee-reports/category-report",
    component: CategoryReport,
    title: "Fee Category Report",
    module: "fee_report_category_wise",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/fee-reports/category-summary",
    component: CategorySummary,
    title: "Fee Category Summary",
    module: "fee_report_category_summary",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/fee-reports/course-summary",
    component: CourseSummary,
    title: "Fee Course Summary",
    module: "fee_report_course_summary",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/fee-reports/fee-collection/:type",
    component: FeeSemYearCollectionReport,
    title: "Fee  Collection Report",
    module: "fee_report_sem_collection",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/fee-reports/class-wise-pending",
    component: ClassWisePending,
    title: "Class Wise Fee Pending",
    module: "fee_report_class_wise_pending",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/fee-reports/student-wise-demand",
    component: StudentWiseDemandReport,
    title: "Student Wise Demand Report",
    module: "fee_report_student_demand",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/fee-reports/class-wise-demand",
    component: ClassWiseDemandReport,
    title: "Class Wise Demand Report",
    module: "fee_report_class_wise_demand",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/fee-reports/semester-wise-demand",
    component: SemesterWiseDemandReport,
    title: "Semester Wise Demand Report",
    module: "fee_report_sem_wise",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/fee-reports/year-wise-demand",
    component: YearWiseDemandReport,
    title: "Year Wise Demand Report",
    module: "fee_report_year_wise",
    action: "action_list",
    exact: true,
  },

  // Fee Definition
  {
    path: "/app/fee-fine-definition/new",
    component: AddFineDefinition,
    title: "Add Fine",
    module: "fee_auto_fine_define",
    action: "action_create",
    exact: true,
  },
  {
    path: "/app/fee-fine-definition/logs",
    component: FineDefinitionLogs,
    title: "Fine Definition Logs",
    module: "fee_auto_fine_define",
    action: "action_list",
    exact: true,
  },

  {
    path: "/app/transport/pending-fees",
    component: TransportPendingReport,
    title: "Transport Pending Fee Report",
    module: "transport_fee_pending_list",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/transport/vehicles",
    component: vehicles,
    title: "Vehciles",
    module: "transport_fee_vehicles",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/transport/destination",
    component: vehicleDestinations,
    title: "Destination & Fee Management",
    module: "transport_fee_destination",
    action: "action_list",
    exact: true,
  },

  {
    path: "/app/students",
    component: students,
    title: "Students",
    exact: true,
    module: "list_students",
    action: "action_list",
  },
  {
    path: "/app/student/new",
    component: addStudent,
    title: "Add Student",
    exact: true,
    module: "add_student",
    action: "action_create",
  },
  {
    path: "/app/student/bulk-import",
    component: StudentsImport,
    title: "Import Students",
    exact: true,
    module: "student_bulk_import",
    action: "action_create",
  },

  {
    path: "/app/left-students",
    component: leftStudents,
    title: "Left Students",
    module: "students_manage_left",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/students-promotion",
    component: studentPromotion,
    title: "Students Promotion",
    module: "student_promotion",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/students-cls-promotion",
    component: classWisePromotion,
    title: "Class wise Student Promotion",
    module: "student_custom_promotion",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/student-search",
    component: SearchStudents,
    title: "Student Search",
    module: "list_students",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/students-bulk-edit",
    component: studentBulkEdit,
    title: "Students Bulk Edit",
    module: "student_bulk_edit",
    action: "action_list",
    exact: true,
  },
  {
    path: "/app/stu-reports/strength",
    component: studentStrength,
    title: "Students Strength",
    exact: true,
    module: "students_reports_strength",
    action: "action_list",
  },

  // Hostellers
  {
    path: "/app/stu-hostel/list-all",
    component: listHostelStudents,
    title: "Hostel Students",
    exact: true,
    module: "student_hostellers",
    action: "action_list",
  },
  {
    path: "/app/stu-hostel/bulk-admission",
    component: HostelBulkAdmission,
    title: "Hostel Bulk Admission",
    exact: true,
    module: "student_hosteler_bulkadd",
    action: "action_create",
  },

  // HR
  {
    path: "/app/hr-attendance",
    component: AttendanceSheet,
    title: "Attendance Sheet",
    exact: true,
    module: "hr_emp_attendance_sheet_machine",
    action: "action_list",
  },
  {
    path: "/app/hr-employees",
    component: Hr_Employees,
    title: "Employees",
    exact: true,
    module: "hr_employees",
    action: "action_list",
  },
  {
    path: "/app/hr-biometric-devices",
    component: Hr_BioDevices,
    title: "Bio-Metric Devices",
    exact: true,
    module: "hr_biometric_devices",
    action: "action_list",
  },
  {
    path: "/app/hr-holidays",
    component: Hr_HolidayMaster,
    title: "Holiday Master",
    exact: true,
    module: "hr_holidays",
    action: "action_list",
  },
  {
    path: "/app/hr/branch-master",
    component: Hr_BranchMaster,
    title: "Branch Master",
    exact: true,
    module: "hr_branches",
    action: "action_list",
  },
  {
    path: "/app/hr/department-master",
    component: Hr_DepartmentMaster,
    title: "Department Master",
    exact: true,
    module: "hr_department",
    action: "action_list",
  },
  {
    path: "/app/hr/designation-master",
    component: Hr_DesignationMaster,
    title: "Designation Master",
    exact: true,
    module: "hr_designation",
    action: "action_list",
  },

  // NAAC
  {
    path: "/app/naac/criteria",
    component: naacCriteria,
    title: "NAAC Criteria",
    exact: true,
    module: "naac_criteria_titles",
    action: "action_list",
  },
  {
    path: "/app/naac/criteria-group",
    component: naacCriteriaGroup,
    title: "NAAC Criteria Group",
    exact: true,
    module: "naac_criteria_group",
    action: "action_list",
  },
  {
    path: "/app/naac/ssr-report",
    component: naacSsrReport,
    title: "NAAC SSR Report",
    exact: true,
    module: "naac_ssr_report",
    action: "action_list",
  },
  {
    path: "/app/naac/ssr-report/new",
    component: addNaacSsrReport,
    title: "NAAC SSR Add Report",
    exact: true,
    module: "naac_ssr_report",
    action: "action_create",
  },
  {
    path: "/app/naac/ssr-report/edit/:id",
    component: editNaacSsrReport,
    title: "Update NAAC SSR Report",
    exact: true,
    module: "naac_ssr_report",
    action: "action_update",
  },

  // Utilities
  {
    path: "/app/uti/student-certificates",
    component: studentCertificates,
    title: "Student Certificates",
    exact: true,
    module: "stu_certificates",
    action: "action_list",
  },
  {
    path: "/app/uti/student-certificates/edit/:id/:name",
    component: editStudentCertificate,
    title: "Edit Student Certificate",
    exact: true,
    module: "stu_certificates",
    action: "action_update",
  },
  {
    path: "/app/uti/att-dayorder",
    component: attendanceDayOrder,
    title: "Attendace Day Order",
    exact: true,
    module: "util_att_day_order",
    action: "action_list",
  },
  {
    path: "/app/uti/att-percentage",
    component: attendancePercentageSettings,
    title: "Attendace Percentage Settings",
    exact: true,
    module: "util_att_percentage_set",
    action: "action_list",
  },

  // certificate
  {
    path: "/app/bonafied-certificates",
    component: StudentBoanfiedCertificates,
    title: "Bonafied Certificates",
    exact: true,
    module: "students_cert_bonafied",
    action: "action_list",
  },
  {
    path: "/app/bonafied-certificate/new",
    component: NewBonafiedCertificate,
    title: "New Bonafied Certificat",
    exact: true,
    module: "students_cert_bonafied",
    action: "action_create",
  },
  {
    path: "/app/list-conduct",
    component: conductCertificate,
    title: "Conduct Certificate",
    exact: true,
    module: "student_conduct_certificate",
    action: "action_list",
  },
  {
    path: "/app/medium-certificate",
    component: mediumInstruction,
    title: "Student Medium Certificate",
    exact: true,
    module: "student_medium_certificate",
    action: "action_list",
  },
  {
    path: "/app/verification-certificate",
    component: verification,
    title: "Student Verification Instraction",
    exact: true,
    module: "student_verification_certificate",
    action: "action_list",
  },
  {
    path: "/app/attendance-certificate",
    component: attendance,
    title: "Class Wise Fee Pending",
    exact: true,
  },

  //Student Attendace Entry
  {
    path: "/app/stuatt/new",
    component: StudentAttendanceEntry,
    title: "Student Attendance Entry",
    exact: true,
    module: "stu_att_new_entry",
    action: "action_create",
  },
  {
    path: "/app/stuatt/modify",
    component: EditStudentAttendanceEntry,
    title: "Edit Student Attendance",
    exact: true,
    module: "academic_modify_student_attendance",
    action: "action_update",
  },
  {
    path: "/app/stuatt/longabsenties",
    component: longAbsenties,
    title: "Long Absenties",
    exact: true,
    module: "stu_attendance_long_absenties",
    action: "action_list",
  },
  {
    path: "/app/stuatt/monthly",
    component: attendanceMonthlyReport,
    title: "Monthly Report",
    exact: true,
    module: "stu_att_monthly_report",
    action: "action_list",
  },
  {
    path: "/app/stuatt/monthly-percentage",
    component: AttendanceMonthlyPercentage,
    title: "Percentage Report",
    exact: true,
    module: "stu_att_sem_month_per_report",
    action: "action_list",
  },
  {
    path: "/app/stuatt/singlestudent",
    component: AttendanceStudentDetailsReport,
    title: "Student Details Attendance Report",
    exact: true,
    module: "stu_att_students_detail_view",
    action: "action_list",
  },
  {
    path: "/app/stuatt/deletedayentry",
    component: deleteDayEntry,
    title: "Delete Day wise Attendance Entry",
    exact: true,
    module: "stu_att_delete_day_entry",
    action: "action_list",
  },
  {
    path: "/app/stuatt/dayorder-summary",
    component: incompleteEntry,
    title: "Attendance Day Order Summary",
    exact: true,
    module: "stu_att_dayorder_report",
    action: "action_list",
  },
  {
    path: "/app/stuatt/bulk-od",
    component: bulkOdEntry,
    title: "Students Bulk OD Entry",
    exact: true,
    module: "stu_attendance_bulk_od",
    action: "action_list",
  },
  {
    path: "/app/stuatt/manual-sms",
    component: studentAttendanceManualSms,
    title: "Manual SMS alert to Absentees",
    exact: true,
    module: "stu_att_manual_sms",
    action: "action_list",
  },

  {
    path: "/app/stu-subjects/classwise-allocation",
    component: classWiseallocatedList,
    title: "Class Wise Subject Allocated",
    exact: true,
    module: "student_sub_alloc_byclass",
    action: "action_list",
  },
  {
    path: "/app/stu-subjects/classwise-allocation-new",
    component: classWise,
    title: "Class Wise Subject Allocation",
    exact: true,
    module: "student_sub_alloc_byclass",
    action: "action_create",
  },
  {
    path: "/app/stu-subjects/studentwise-allocation",
    component: studentWiseSubjectAllocation,
    title: "Student Wise Subject Allocation",
    exact: true,
    module: "student_sub_alloc_bystudent",
    action: "action_list",
  },
  {
    path: "/app/stu-subject/bulk-allocation",
    component: StudentWiseBulkAllocation,
    title: "Student Wise Subject Allocation",
    exact: true,
    module: "student_sub_alloc_bystudent",
    action: "action_create",
  },

  //Department CMS
  {
    path: "/app/deptcms/courses",
    component: deptCoursesList,
    title: "Course List",
    exact: true,
    module: "dept_cms_courses",
    action: "action_list",
  },
  {
    path: "/app/deptcms/sliders",
    component: deptSliders,
    title: "Course List",
    exact: true,
    module: "dept_cms_sliders",
    action: "action_list",
  },
  {
    path: "/app/deptcms/vision",
    component: deptVisionMission,
    title: "Vision & Mission",
    exact: true,
    module: "dept_cms_vision_mission",
    action: "action_list",
  },
  {
    path: "/app/deptcms/about",
    component: deptAbout,
    title: "About Page",
    exact: true,
    module: "dept_cms_about",
    action: "action_list",
  },
  {
    path: "/app/deptcms/activities",
    component: deptActivities,
    title: "Activities",
    exact: true,
    module: "dept_cms_activities",
    action: "action_list",
  },
  {
    path: "/app/deptcms/awards",
    component: deptAwards,
    title: "Awards",
    exact: true,
    module: "dept_cms_awards",
    action: "action_list",
  },
  {
    path: "/app/deptcms/syllabus",
    component: deptSyllabus,
    title: "Syllabus",
    exact: true,
    module: "dept_cms_syllabus",
    action: "action_list",
  },
];
