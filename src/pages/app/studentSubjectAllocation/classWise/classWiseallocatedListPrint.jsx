import React, { useState, useEffect, useContext } from "react";

import PsContext from "../../../../context";

import { groupByMultiple, printDocument, upperCase } from "../../../../utils";
import { TABLE_STYLES } from "../../../../utils/data";

const ClassWiseallocatedListPrint = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);

  useEffect(() => {
    setDataList(props.dataSource);
    let m = groupByMultiple(props.dataSource, function (obj) {
      return [obj.course_id];
    });

    setDataView(m);
  }, [props.dataSource]);

  useEffect(() => {
    if (dataView.length > 0) {
      printDocument("tbl_course_subject_print");
      if (props.onSuccess) props.onSuccess();
    }
  }, [dataView]);

  const getInnerRow = (items) => {
    return items.map((item, i) => {
      return (
        <tr>
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
      <div id="tbl_course_subject_print" style={{ display: "none" }}>
        <table
          width="100%"
          align="center"
          className=""
          style={TABLE_STYLES.tableCollapse}
        >
          <thead>
            <tr>
              <th colSpan={4}>
                <b>{context.settingValue("billheader_name")}</b>
                <br />
                {context.settingValue("billheader_addresscity") && (
                  <>{context.settingValue("billheader_addresscity")} </>
                )}
              </th>
            </tr>
            <tr style={TABLE_STYLES.borderBottom}>
              <th colSpan={4} height="25" align="left">
                {props.title}
              </th>
            </tr>
          </thead>
          <tbody>
            {dataView.map((item, i) => {
              return (
                <>
                  <tr key={i} className="bg-light">
                    <td colSpan={4} className="fw-bold" heightt="20">
                      <br />
                      <b>
                        {item[0].degree_name} {item[0].course_name}{" "}
                        {item[0].coursetype == "regular" ? "(R)" : "(SF)"}
                      </b>
                    </td>
                  </tr>
                  {getInnerRow(item)}
                  <tr style={TABLE_STYLES.borderTop}>
                    <td colSpan={4}></td>
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

export default ClassWiseallocatedListPrint;
