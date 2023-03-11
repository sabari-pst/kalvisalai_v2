import React, { useContext } from "react";
import PsContext from "../../../../context";
import { momentDate, timeTableDayFromNumber } from "../../../../utils";
import { TABLE_STYLES } from "../../../../utils/data";

const DayOrderRowWithStaff = (props) => {
  const context = useContext(PsContext);

  let dayOrderInDayName = context.settingValue(
    "attendance_dayorder_as_day_name"
  );
  const attendance_hour_per_day = context.settingValue(
    "hour_for_attendance_per_day"
  );

  const dayOrder = props.dayOrderSource;
  const timeTable = props.timeTableSource;
  const attendance = props.attendanceSource;
  const status = props.status;

  const checkAttendanceMarked = (date, dayOrder, hour) => {
    let m = attendance.find(
      (obj) =>
        obj.attendance_date == date &&
        //obj.day_value == dayOrder &&
        obj.hour_value == hour
    );
    return m;
  };

  const listTimeTablesOnDay = (dayORderItem) => {
    let dayOrderTimeTableList = timeTable.filter(
      (item) => item.day_value == dayORderItem.day_order_value
    );

    return dayOrderTimeTableList.map((item, i) => {
      let marked = checkAttendanceMarked(
        dayORderItem.day_order_date,
        item.day_value,
        item.hour_value
      );

      let tr = (
        <tr>
          <td height="22">
            {momentDate(dayORderItem.day_order_date, "DD/MM/YYYY")}
          </td>
          <td>
            {item.emp_name} {item.emp_initial}
          </td>
          <td>
            {item.subject_code} - {item.subject_name}
            {marked && (
              <>
                <br />
                {marked && marked.subject_name} - {marked && marked.emp_name}
              </>
            )}
          </td>
          <td>{timeTableDayFromNumber(item.day_value, dayOrderInDayName)}</td>
          <td align="center">{item.hour_value}</td>
          <td align="center">{marked ? "Yes" : "-"}</td>
        </tr>
      );
      if (status == -1) return tr;
      if (status == 0 && !marked) return tr;
      if (status == 1 && marked) return tr;
    });
  };

  return (
    <>
      <table width="100%" align="center" style={TABLE_STYLES.tableCollapse}>
        <thead style={{ fontSize: "12px" }}>
          <tr style={TABLE_STYLES.borderTopBottom}>
            <th align="left" width="100">
              Date
            </th>
            <th align="left">Staff Name</th>
            <th align="left">Subject</th>
            <th width="120" align="left">
              Day Order
            </th>
            <th width="100" align="center">
              Hour
            </th>
            <th width="80" align="center">
              Status
            </th>
          </tr>
        </thead>
        <tbody style={{ fontSize: "12px" }}>
          {dayOrder.map((item, i) => {
            return listTimeTablesOnDay(item);
          })}
        </tbody>
      </table>
    </>
  );
};

export default DayOrderRowWithStaff;
