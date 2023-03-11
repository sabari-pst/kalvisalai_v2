import React, { useState, useEffect, useContext } from "react";

import PsContext from "../../../../context";

import { groupByMultiple, printDocument, upperCase } from "../../../../utils";
import { TABLE_STYLES } from "../../../../utils/data";

const StudentWiseallocatedListPrint = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);

  useEffect(() => {
    setDataList(props.dataSource);
    let m = groupByMultiple(props.dataSource, function (obj) {
      return [obj.student_uuid];
    });

    setDataView(m);
  }, [props.dataSource]);

  useEffect(() => {
    if (dataView.length > 0) {
      printDocument("tbl_student_subject_print");
      if (props.onSuccess) props.onSuccess();
    }
  }, [dataView]);

  const getInnerRow = (items) => {
    return items.map((item, i) => {
      return (
        <tr>
          <td></td>
          <td height="20">Part-{item.subject_part_type}</td>
          <td>{upperCase(item.subject_code)}</td>
          <td>{upperCase(item.subject_name)}</td>
          <td>{item.subject_type}</td>
        </tr>
      );
    });
  };

  return (
    <>
      <div id="tbl_student_subject_print" style={{ display: "none" }}>
        <table
          width="100%"
          align="center"
          className=""
          style={TABLE_STYLES.tableCollapse}
        >
          <thead>
            <tr>
              <th colSpan={5}>
                <b>{context.settingValue("billheader_name")}</b>
                <br />
                {context.settingValue("billheader_addresscity") && (
                  <>{context.settingValue("billheader_addresscity")} </>
                )}
              </th>
            </tr>
            <tr style={TABLE_STYLES.borderBottom}>
              <th colSpan={5} height="25" align="center">
                {props.title}
              </th>
            </tr>
          </thead>
          <tbody>
            {dataView.map((item, i) => {
              return (
                <>
                  <tr key={i} className="bg-light">
                    <td>
                      <br />
                      {i + 1}
                    </td>
                    <td colSpan={4} className="fw-bold" heightt="20">
                      <br />
                      <b className="text-danger">
                        {item[0].registerno || item[0].rollno} - {item[0].name}
                      </b>
                    </td>
                  </tr>
                  {getInnerRow(item)}
                  <tr style={TABLE_STYLES.borderTop}>
                    <td colSpan={5}></td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default StudentWiseallocatedListPrint;
