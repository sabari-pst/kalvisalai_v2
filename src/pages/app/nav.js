export default [
  {
    name: "Dashboard",
    path: "/app",
    icon: "fa-solid fa-house",
    module: "any",
    action: "any",
    exact: true,
  },
  {
    name: "File Manager",
    path: "/app/filemanager",
    icon: "fa-regular fa-folder",
    module: "cms_file_manager",
    action: "action_list",
    exact: true,
  },
  {
    name: "CMS",
    path: "/app/pages",
    icon: "fa-regular fa-chess-rook",
    roleGroup: ["CMS"],
    exact: false,
    childrens: [
      {
        name: "Announcements",
        path: "/app/web/announcements",
        icon: "bx fa-gear",
        exact: true,
        module: "cms_web_announcements",
        action: "action_list",
      },
      {
        name: "Events",
        path: "/app/web/events",
        icon: "bx fa-gear",
        exact: true,
        module: "cms_web_events",
        action: "action_list",
      },
      {
        name: "Pages",
        path: "/app/web/pages",
        icon: "bx fa-gear",
        exact: true,
        module: "cms_pages",
        action: "action_list",
      },
      {
        name: "Gallery",
        path: "/app/web/gallery",
        icon: "bx fa-gear",
        exact: true,
        module: "cms_web_gallery",
        action: "action_list",
      },
      {
        name: "Sliders",
        path: "/app/web/sliders",
        icon: "bx fa-gear",
        exact: true,
        module: "cms_web_sliders",
        action: "action_list",
      },

      /*{ name: 'Gallery', path: '/app/cms/contents/gallery/list', icon: 'bx fa-gear', exact: true,  },
			{ name: 'Events', path: '/app/cms/contents/event/list', icon: 'bx fa-gear', exact: true,  },
			{ name: 'Announcements', path: '/app/cms/contents/announcement/list', icon: 'bx fa-gear', exact: true,  },
			{ name: 'Slider', path: '/app/cms/contents/slider/list', icon: 'bx fa-gear', exact: true,  },*/
      {
        name: "Menus",
        path: "/app/cms/menus/list",
        icon: "bx fa-gear",
        exact: true,
        module: "cms_web_menus",
        action: "action_list",
      },
    ],
  },
  {
    name: "Department CMS",
    path: "/app/deptcms",
    icon: "fa-regular fa-chess-rook",
    roleGroup: ["Department CMS"],
    exact: false,
    childrens: [
      {
        name: "Courses",
        path: "/app/deptcms/courses",
        icon: "bx fa-gear",
        exact: true,
        module: "dept_cms_courses",
        action: "action_list",
      },
      {
        name: "Sliders",
        path: "/app/deptcms/sliders",
        icon: "bx fa-gear",
        exact: true,
        module: "dept_cms_sliders",
        action: "action_list",
      },
      {
        name: "About",
        path: "/app/deptcms/about",
        icon: "bx fa-gear",
        exact: true,
        module: "dept_cms_about",
        action: "action_list",
      },
      {
        name: "Vision & Mission",
        path: "/app/deptcms/vision",
        icon: "bx fa-gear",
        exact: true,
        module: "dept_cms_vision_mission",
        action: "action_list",
      },
      {
        name: "Activities",
        path: "/app/deptcms/activities",
        icon: "bx fa-gear",
        exact: true,
        module: "dept_cms_activities",
        action: "action_list",
      },
      {
        name: "Awards",
        path: "/app/deptcms/awards",
        icon: "bx fa-gear",
        exact: true,
        module: "dept_cms_awards",
        action: "action_list",
      },
      {
        name: "Syllabus",
        path: "/app/deptcms/syllabus",
        icon: "bx fa-gear",
        exact: true,
        module: "dept_cms_syllabus",
        action: "action_list",
      },
    ],
  },
  {
    name: "Settings",
    path: "/app/settings",
    icon: "fa-brands fa-nfc-symbol",
    module: [
      "master_settings_menu",
      "settings_batch_semester",
      "settings_user_roles",
      "settings_user_login",
    ],
    action: "action_list",
    exact: false,
    childrens: [
      {
        name: "Master Settings",
        path: "/app/master-settings/variable-settings",
        icon: "bx bx-pen",
        exact: true,
        module: "master_settings_menu",
        action: "action_list",
      },
      {
        name: "College Year",
        path: "/app/master-settings/collegeyear",
        icon: "bx bx-pen",
        exact: true,
        module: "settings_college_year",
        action: "action_list",
      },
      {
        name: "Batch & Semester",
        path: "/app/master-settings/batch",
        icon: "bx bx-pen",
        exact: true,
        module: "settings_batch_semester",
        action: "action_list",
      },
      {
        name: "Cash Books",
        path: "/app/master-settings/cashbook",
        icon: "bx bx-pen",
        exact: true,
      },
      {
        name: "CCA Sub Accounts",
        path: "/app/master-settings/cca-subaccounts",
        icon: "bx bx-pen",
        exact: true,
      },
      {
        name: "SMS Templates",
        path: "/app/master-settings/sms-templates",
        icon: "bx fa-gear",
        exact: true,
      },
      {
        name: "Mail Templates",
        path: "/app/master-settings/mail-templates",
        icon: "bx fa-gear",
        exact: true,
      },
      {
        name: "Modules",
        path: "/app/master-settings/modules",
        icon: "bx bx-pen",
        exact: true,
      },

      {
        name: "User Roles",
        path: "/app/master-settings/userroles",
        icon: "bx bx-pen",
        exact: true,
        module: "settings_user_roles",
        action: "action_list",
      },
      {
        name: "User Login",
        path: "/app/master-settings/userlogin",
        icon: "bx bx-pen",
        exact: true,
        module: "settings_user_login",
        action: "action_list",
      },
    ],
  },
  {
    name: "Utilities",
    path: "/app/utilities",
    icon: "fa-solid fa-pen-nib",
    roleGroup: ["Utilities"],
    exact: false,
    childrens: [
      {
        name: "Student Certificates",
        path: "/app/uti/student-certificates",
        icon: "bx bx-pen",
        exact: true,
        module: "stu_certificates",
        action: "action_list",
      },
      {
        name: "Attendance Day Order",
        path: "/app/uti/att-dayorder",
        icon: "bx bx-pen",
        exact: true,
        module: "util_att_day_order",
        action: "action_list",
      },
      {
        name: "Attendance Percentage",
        path: "/app/uti/att-percentage",
        icon: "bx bx-pen",
        exact: true,
        module: "util_att_percentage_set",
        action: "action_list",
      },
    ],
  },
  {
    name: "User Logs",
    path: "/app/user-logs",
    icon: "fa-solid fa-table-cells-large",
    exact: true,
    module: "user_action_logs",
    action: "action_list",
  },

  {
    name: "NAAC",
    path: "/app/naac",
    icon: "fa-regular fa-paste",
    roleGroup: ["NAAC"],
    exact: false,
    childrens: [
      {
        name: "SSR Report",
        path: "/app/naac/ssr-report",
        icon: "bx bx-pen",
        exact: true,
        module: "naac_ssr_report",
        action: "action_list",
      },
      {
        name: "Criteria Group",
        path: "/app/naac/criteria-group",
        icon: "bx bx-pen",
        exact: true,
        module: "naac_criteria_group",
        action: "action_list",
      },
      {
        name: "Criteria",
        path: "/app/naac/criteria",
        icon: "bx bx-pen",
        exact: true,
        module: "naac_criteria_titles",
        action: "action_list",
      },
    ],
  },

  //Time Table
  { name: "ACADEMICS", type: "title", roleGroup: ["Academics", "TimeTable"] },
  {
    name: "Departments",
    path: "/app/master-settings/departments",
    icon: "fa-regular fa-hourglass",
    exact: true,
    //module: "academic_departments",
    //action: "action_list",
  },
  {
    name: "Courses",
    path: "/app/master-settings/courses",
    icon: "fa-solid fa-book-open",
    exact: true,
    module: "academics_course_management",
    action: "action_list",
  },
  {
    name: "Subject Nature",
    path: "/app/master-settings/subject-nature",
    icon: "fa-solid fa-wrench",
    exact: true,
    module: "academic_subject_nature",
    action: "action_list",
  },
  {
    name: "Subjects",
    path: "/app/master-settings/subjects",
    icon: "fa-solid fa-book",
    exact: true,
    module: "academic_subject_management",
    action: "action_list",
  },
  {
    name: "Allocation",
    path: "/app/allocation",
    icon: "fa-solid fa-book-medical",
    module: "academic_subject_allocation",
    action: "action_list",
    exact: false,
    childrens: [
      {
        name: "Course & Subjects",
        path: "/app/master-settings/courseSubjects",
        icon: "bx bx-pen",
        exact: true,
        module: "academic_course_subject_allocate",
        action: "action_list",
      },
      {
        name: "Staff & Subjects",
        path: "/app/master-settings/staffsubject",
        icon: "bx bx-pen",
        exact: true,
        module: "academic_staff_subject_allocate",
        action: "action_list",
      },
    ],
  },
  {
    name: "Time Table",
    path: "/app/timetable",
    icon: "fa-regular fa-calendar-days",
    exact: false,
    module: "timetable_allow_menu",
    action: "action_list",
    childrens: [
      {
        name: "Create TimeTable",
        path: "/app/timetable/create-timetable",
        icon: "bx bx-pen",
        exact: true,
        module: "timetable_create_timetable",
        action: "action_list",
      },
      {
        name: "Class TimeTable",
        path: "/app/timetable/print-timetable",
        icon: "bx bx-pen",
        exact: true,
        module: "timetable_class_timetable",
        action: "action_list",
      },
      /*{
        name: "My TimeTable",
        path: "/app/timetable/my-timetable",
        icon: "bx bx-pen",
        exact: true,
        module: "timetable_my_timetable",
        action: "action_list",
      },*/
    ],
  },
  {
    name: "Student Attendance",
    path: "/app/timetable",
    icon: "fa-regular fa-clock",
    exact: false,
    roleGroup: ["Student Attendance"],
    childrens: [
      {
        name: "Attendance Entry",
        path: "/app/stuatt/new",
        icon: "bx bx-pen",
        exact: true,
        module: "stu_att_new_entry",
        action: "action_create",
      },
      {
        name: "Edit Attendance Entry",
        path: "/app/stuatt/modify",
        icon: "bx bx-pen",
        exact: true,
        module: "academic_modify_student_attendance",
        action: "action_update",
      },
      {
        name: "Bulk OD Entry",
        path: "/app/stuatt/bulk-od",
        icon: "bx bx-pen",
        exact: true,
        module: "stu_attendance_bulk_od",
        action: "action_list",
      },
      {
        name: "Long Absenties",
        path: "/app/stuatt/longabsenties",
        icon: "bx bx-pen",
        exact: true,
        module: "stu_attendance_long_absenties",
        action: "action_list",
      },
      {
        name: "Monthly Report",
        path: "/app/stuatt/monthly",
        icon: "bx bx-pen",
        exact: true,
        module: "stu_att_monthly_report",
        action: "action_list",
      },
      {
        name: "Percentage Report",
        path: "/app/stuatt/monthly-percentage",
        icon: "bx bx-pen",
        exact: true,
        module: "stu_att_sem_month_per_report",
        action: "action_list",
      },
      {
        name: "Student Details Report",
        path: "/app/stuatt/singlestudent",
        icon: "bx bx-pen",
        exact: true,
        module: "stu_att_students_detail_view",
        action: "action_list",
      },
      {
        name: "Delete Day Entry",
        path: "/app/stuatt/deletedayentry",
        icon: "bx bx-pen",
        exact: true,
        module: "stu_att_delete_day_entry",
        action: "action_list",
      },
      {
        name: "Day order Summary",
        path: "/app/stuatt/dayorder-summary",
        icon: "bx bx-pen",
        exact: true,
        module: "stu_att_dayorder_report",
        action: "action_list",
      },
      {
        name: "SMS Alert",
        path: "/app/stuatt/manual-sms",
        icon: "bx bx-pen",
        exact: true,
        module: "stu_att_manual_sms",
        action: "action_list",
      },
    ],
  },

  // Students
  {
    name: "STUDENTS",
    type: "title",
    roleGroup: ["Students", "Students Certificates"],
  },
  {
    name: "Students",
    path: "/app/students",
    icon: "fa-solid fa-users",
    exact: true,
    module: "list_students",
    action: "action_list",
  },
  {
    name: "Add Student",
    path: "/app/student/new",
    icon: "fa-solid fa-user-plus",
    module: "add_student",
    action: "action_create",
    exact: true,
  },
  {
    name: "Import Students",
    path: "/app/student/bulk-import",
    icon: "fa-solid fa-upload",
    module: "student_bulk_import",
    action: "action_create",
    exact: true,
  },
  {
    name: "Students Search",
    path: "/app/student-search",
    icon: "fa-solid fa-magnifying-glass",
    module: "list_students",
    action: "action_list",
    exact: true,
  },
  {
    name: "Left Students",
    path: "/app/left-students",
    icon: "fa-solid fa-user",
    module: "students_manage_left",
    action: "action_list",
    exact: true,
  },
  {
    name: "Certificate",
    path: "/app/certificate",
    icon: "fa-regular fa-clipboard",
    module: "students_cert_menu",
    action: "action_list",
    exact: false,
    childrens: [
      {
        name: "Bonafied Certificate",
        path: "/app/bonafied-certificates",
        icon: "bx bx-pen",
        exact: true,
        module: "students_cert_bonafied",
        action: "action_list",
      },
      {
        name: "Conduct Certificate",
        path: "/app/list-conduct",
        icon: "bx bx-pen",
        exact: true,
        module: "student_conduct_certificate",
        action: "action_list",
      },
      {
        name: "Medium Certificate",
        path: "/app/medium-instraction",
        icon: "bx bx-pen",
        exact: true,
        module: "Student_medium_certificate",
        action: "action_list",
      },
      {
        name: "Verification Certificate",
        path: "/app/verification-certificate",
        icon: "bx bx-pen",
        exact: true,
        module: "student_verification_certificate",
        action: "action_list",
      },
      {
        name: "Attendance Certificate",
        path: "/app/Certificate/attendance",
        icon: "bx bx-pen",
        exact: true,
      },
    ],
  },
  {
    name: "Bulk Edit",
    path: "/app/students-bulk-edit",
    icon: "fa-solid fa-file-pen",
    module: "student_bulk_edit",
    action: "action_list",
    exact: true,
  },
  {
    name: "Subject Allocation",
    path: "/app/stu-subjects",
    icon: "fa-solid fa-book",
    module: ["student_sub_alloc_byclass", "student_sub_alloc_bystudent"],
    action: "action_list",
    exact: false,
    childrens: [
      {
        name: "Class Wise Allocation",
        path: "/app/stu-subjects/classwise-allocation",
        icon: "bx bx-pen",
        exact: true,
        module: "student_sub_alloc_byclass",
        action: "action_list",
      },
      {
        name: "Student Wise Allocation",
        path: "/app/stu-subjects/studentwise-allocation",
        icon: "bx bx-pen",
        exact: true,
        module: "student_sub_alloc_bystudent",
        action: "action_list",
      },
    ],
  },
  {
    name: "Students Reports",
    path: "/app/stu-reports",
    icon: "fa-regular fa-paste",
    module: "students_reports_menu",
    action: "action_list",
    exact: false,
    childrens: [
      {
        name: "Strength Report",
        path: "/app/stu-reports/strength",
        icon: "bx bx-pen",
        exact: true,
        module: "students_reports_strength",
        action: "action_list",
      },
    ],
  },
  {
    name: "Students Promotion",
    path: "/app/students-promotion",
    icon: "fa-solid fa-clipboard",
    module: "student_promotion",
    action: "action_list",
    exact: true,
  },
  {
    name: "Class wise Promotion",
    path: "/app/students-cls-promotion",
    icon: "fa-solid fa-clipboard",
    module: "student_custom_promotion",
    action: "action_list",
    exact: true,
  },

  // Hostellers
  {
    name: "Hostellers",
    path: "/app/stu-hostel",
    icon: "fa-solid fa-users",
    module: "student_hostellers",
    action: "action_list",
    exact: false,
    childrens: [
      {
        name: "View Students",
        path: "/app/stu-hostel/list-all",
        icon: "bx bx-pen",
        exact: true,
        module: "student_hostellers",
        action: "action_list",
      },
      {
        name: "Bulk Admission",
        path: "/app/stu-hostel/bulk-admission",
        icon: "bx bx-pen",
        exact: true,
        module: "student_hosteler_bulkadd",
        action: "action_create",
      },
    ],
  },

  {
    name: "FEE COLLECTION",
    type: "title",
    roleGroup: [
      "Fees",
      "Fee Settings",
      "Fee Assigning",
      "Fee Adjusting",
      "Fee Reports",
      "Transport Fee",
      "Fee Bank Details",
    ],
  },

  {
    name: "Bank Challan",
    path: "/app/fee-payment",
    icon: "fa-solid fa-file-invoice",
    module: ["fee_bank_challan", "fee_bank_chellan_print"],
    action: "action_list",
    exact: false,
    childrens: [
      {
        name: "List Bank Challans",
        path: "/app/fee/bank-challans",
        icon: "fa-solid fa-receipt",
        exact: true,
        module: "fee_bank_challan",
        action: "action_list",
      },
      {
        name: "Create Bank Challan",
        path: "/app/fee/bank-challan-new",
        icon: "fa-solid fa-receipt",
        exact: true,
        module: "fee_bank_challan",
        action: "action_create",
      },
    ],
  },
  {
    name: "Fee Payment",
    path: "/app/fee-payment",
    icon: "fa-solid fa-cash-register",
    module: "fee_payment",
    action: "action_list",
    exact: false,
    childrens: [
      {
        name: "New Payment",
        path: "/app/fee-payment/new-payment",
        icon: "bx bx-pen",
        module: "fees_new_payment",
        action: "action_create",
        exact: true,
      },
      {
        name: "Payment List",
        path: "/app/fee-payment/payment-list",
        icon: "bx bx-pen",
        module: "fee_payment_list",
        action: "action_list",
        exact: true,
      },
    ],
  },
  {
    name: "Cancel Bills",
    path: "/app/cancelled-bills",
    icon: "fa-solid fa-ban",
    module: "fee_cancel",
    action: "action_list",
    exact: true,
  },
  {
    name: "Fee Reports",
    path: "/app/fee-reports",
    icon: "fa-solid fa-book-open",
    module: "fee_report",
    action: "action_list",
    exact: false,
    childrens: [
      {
        name: "Day Report",
        path: "/app/fee-reports/day-report",
        icon: "bx bx-pen",
        module: "fee_report_day_report",
        action: "action_list",
        exact: true,
      },
      {
        name: "Category Report",
        path: "/app/fee-reports/category-report",
        icon: "bx bx-pen",
        module: "fee_report_category_wise",
        action: "action_list",
        exact: true,
      },
      {
        name: "Category Summary",
        path: "/app/fee-reports/category-summary",
        icon: "bx bx-pen",
        module: "fee_report_category_summary",
        action: "action_list",
        exact: true,
      },
      {
        name: "Course Summary",
        path: "/app/fee-reports/course-summary",
        icon: "bx bx-pen",
        module: "fee_report_course_summary",
        action: "action_list",
        exact: true,
      },
      {
        name: "Sem Wise Collection",
        path: "/app/fee-reports/fee-collection/sem",
        icon: "bx bx-pen",
        module: "fee_report_sem_collection",
        action: "action_list",
        exact: true,
      },
      {
        name: "Class wise Pending",
        path: "/app/fee-reports/class-wise-pending",
        icon: "bx bx-pen",
        module: "fee_report_class_wise_pending",
        action: "action_list",
        exact: true,
      },
      {
        name: "Student Demand Report",
        path: "/app/fee-reports/student-wise-demand",
        icon: "bx bx-pen",
        module: "fee_report_student_demand",
        action: "action_list",
        exact: true,
      },
      {
        name: "Class Demand Report",
        path: "/app/fee-reports/class-wise-demand",
        icon: "bx bx-pen",
        module: "fee_report_class_wise_demand",
        action: "action_list",
        exact: true,
      },
      {
        name: "Sem Demand Report",
        path: "/app/fee-reports/semester-wise-demand",
        icon: "bx bx-pen",
        module: "fee_report_sem_wise",
        action: "action_list",
        exact: true,
      },
      {
        name: "Year Demand Report",
        path: "/app/fee-reports/year-wise-demand",
        icon: "bx bx-pen",
        module: "fee_report_year_wise",
        action: "action_list",
        exact: true,
      },
    ],
  },
  {
    name: "Fee Settings",
    path: "/app/fee-settings",
    icon: "fa-solid fa-gear",
    module: "fee_settings_menu",
    action: "action_list",
    exact: false,
    childrens: [
      {
        name: "Fee Templates",
        path: "/app/fee-settings/fee-template",
        icon: "bx bx-pen",
        module: "fee_settings_feetemplate",
        action: "action_list",
        exact: true,
      },
      {
        name: "Fee Category",
        path: "/app/fee-settings/fee-category",
        icon: "bx bx-pen",
        module: "fee_settings_category",
        action: "action_list",
        exact: true,
      },
      {
        name: "Fee Groups",
        path: "/app/fee-settings/fee-groups",
        icon: "bx bx-pen",
        module: "fee_settings_feegroup",
        action: "action_list",
        exact: true,
      },
      {
        name: "Fee Payment Methods",
        path: "/app/fee-settings/fee-payment-methods",
        icon: "bx bx-pen",
        module: "fee_settings_payment_method",
        action: "action_list",
        exact: true,
      },
      {
        name: "Fee Delete",
        path: "/app/fee-settings/fee-delete",
        icon: "bx bx-pen",
        module: "fee_settings_delete",
        action: "action_list",
        exact: true,
      },
      {
        name: "Class Wise Fee Delete",
        path: "/app/fee-settings/classwise-fee-delete",
        icon: "bx bx-pen",
        module: "fee_setting_delete_class_wise_duplicate",
        action: "action_list",
        exact: true,
      },
      {
        name: "Paid Date Adjustmentt",
        path: "/app/fee-settings/paid-date-adjustmeent",
        icon: "bx bx-pen",
        module: "fee_paid_date_adjust",
        action: "action_update",
        exact: true,
      },
    ],
  },
  {
    name: "Fee Bank Accounts",
    path: "/app/fee/bank-accounts",
    icon: "fa-solid fa-building-columns",
    exact: true,
    module: "fee_bank_accounts",
    action: "action_list",
  },

  {
    name: "Fee Assigning",
    path: "/app/fee-assigning",
    icon: "fa-solid fa-book-bible",
    module: "fee_assing_menu",
    action: "action_list",
    exact: false,
    childrens: [
      {
        name: "Course wise Fee Assign",
        path: "/app/fee-assigning/class-wise",
        icon: "bx bx-pen",
        module: "fee_assign_course_wise",
        action: "action_create",
        exact: true,
      },
      {
        name: "Student Wise Fee Assign",
        path: "/app/fee-assigning/student-wise",
        icon: "bx bx-pen",
        module: "fee_assing_student_wise",
        action: "action_create",
        exact: true,
      },
      {
        name: "Course wise Fee Adjust",
        path: "/app/fee-assigning/class-wise-adjust",
        icon: "bx bx-pen",
        module: "fee_adjust_course_wise",
        action: "action_list",
        exact: true,
      },
      {
        name: "Student wise Fee Adjust",
        path: "/app/fee-assigning/student-wise-adjust",
        icon: "bx bx-pen",
        module: "fee_adjust_student_wise",
        action: "action_list",
        exact: true,
      },
    ],
  },
  {
    name: "Fine Definition",
    path: "/app/fee-fine-definition",
    icon: "fa-regular fa-file-code",
    module: ["fee_auto_fine_define"],
    exact: false,
    childrens: [
      {
        name: "Add Fine",
        path: "/app/fee-fine-definition/new",
        icon: "bx bx-pen",
        module: "fee_auto_fine_define",
        action: "action_create",
        exact: true,
      },
      {
        name: "Entry Logs",
        path: "/app/fee-fine-definition/logs",
        icon: "bx bx-pen",
        module: "fee_auto_fine_define",
        action: "action_list",
        exact: true,
      },
    ],
  },
  {
    name: "Transport",
    path: "/app/transport",
    icon: "fa-solid fa-bus",
    module: "transport_fee",
    action: "action_list",
    exact: false,
    childrens: [
      {
        name: "Pending & Fees",
        path: "/app/transport/pending-fees",
        icon: "bx bx-pen",
        module: "transport_fee_pending_list",
        action: "action_list",
        exact: true,
      },
      {
        name: "Destination & Fee",
        path: "/app/transport/destination",
        icon: "bx bx-pen",
        module: "transport_fee_destination",
        action: "action_list",
        exact: true,
      },
      {
        name: "Vehicles",
        path: "/app/transport/vehicles",
        icon: "bx bx-pen",
        module: "transport_fee_vehicles",
        action: "action_list",
        exact: true,
      },
    ],
  },

  //HR
  { name: "HR", type: "title", roleGroup: ["HR"] },
  {
    name: "Employees",
    path: "/app/hr-employees",
    icon: "fa-solid fa-users",
    exact: true,
    module: "hr_employees",
    action: "action_list",
  },
  {
    name: "Attendance Sheet",
    path: "/app/hr-attendance",
    icon: "fa-solid fa-sheet-plastic",
    exact: true,
    module: "hr_emp_attendance_sheet_machine",
    action: "action_list",
  },
  {
    name: "HR Settings",
    path: "/app/hr-settings",
    icon: "fa-solid fa-gear",
    roleGroup: ["HR"],
    //module: "hr_settings_menu",
    //action: "action_list",
    exact: false,
    childrens: [
      {
        name: "Branch Master",
        path: "/app/hr/branch-master",
        icon: "fa-solid fa-rectangle-list",
        exact: true,
        module: "hr_branches",
        action: "action_list",
      },
      {
        name: "Department Master",
        path: "/app/hr/department-master",
        icon: "fa-solid fa-rectangle-list",
        exact: true,
        module: "hr_department",
        action: "action_list",
      },
      {
        name: "Designation Master",
        path: "/app/hr/designation-master",
        icon: "fa-solid fa-rectangle-list",
        exact: true,
        module: "hr_designation",
        action: "action_list",
      },
      {
        name: "Holiday Master",
        path: "/app/hr-holidays",
        icon: "bx bx-pen",
        exact: true,
        module: "hr_holidays",
        action: "action_list",
      },
      {
        name: "Bio-Metric Devices",
        path: "/app/hr-biometric-devices",
        icon: "bx bx-pen",
        exact: true,
        module: "hr_biometric_devices",
        action: "action_list",
      },
    ],
  },
];
