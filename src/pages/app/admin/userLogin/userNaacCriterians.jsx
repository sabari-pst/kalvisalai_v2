import React, { useEffect, useState } from "react";
import { Form, ListGroup, ListGroupItem } from "react-bootstrap";
import axios from "axios";

import { listCriteria } from "../../../../models/naac";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { toast } from "react-hot-toast";

const UserNaacCriterians = (props) => {
  const [loader, setLoader] = useState(false);
  const [criterainList, setCriterianList] = useState([]);

  const [selectedCriterians, setSelectedCriterians] = useState([]);

  const field = (fieldName) => {
    if (props.dataSource && props.dataSource[fieldName])
      return props.dataSource[fieldName];
  };

  useEffect(() => {
    setLoader(true);
    let alc = field("allowed_naac_criterians");
    if (alc && alc.length > 0) {
      let xz = alc.split(",");
      setSelectedCriterians(xz);
    }

    listCriteria("1").then((res) => {
      if (res.data) setCriterianList(res.data);
      setLoader(false);
    });
  }, []);

  const checkCritirainExist = (item) => {
    let exist = selectedCriterians.findIndex((obj) => obj == item);
    return exist > -1 ? true : false;
  };

  const updateCriterian = (item, e) => {
    let msg = e.target.checked
      ? "Do you want to allow ?"
      : "Do you want to disable ?";
    if (!window.confirm(msg)) return;
    let s = [...selectedCriterians];
    if (e.target.checked) {
      s.push(item);
    } else {
      let index = s.findIndex((obj) => obj == item);
      if (index > -1) s.splice(index, 1);
    }

    setLoader(true);

    const form = new FormData();
    form.append("id", field("id"));
    form.append("emp_code", field("employee_code"));
    form.append("field_name", "allowed_naac_criterians");
    form.append("field_value", s.toString());

    axios.post(ServiceUrl.ADMISSION.USER_STATUS_CHANGE, form).then((res) => {
      if (res["data"].status == "1") {
        toast.success(res["data"].message || "Success");
        //if (props.onSuccess) props.onSuccess();
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
    setSelectedCriterians(s);
  };

  return (
    <div>
      <ListGroup>
        {criterainList.map((item, i) => {
          return (
            <ListGroup.Item className="border-bottom">
              <span className="float-start">
                {item.criteria_code}. {item.criteria_title}
              </span>
              <div className="text-end">
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  className="check-input-lg"
                  checked={checkCritirainExist(item.id)}
                  onChange={(e) => updateCriterian(item.id, e)}
                />
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </div>
  );
};

export default UserNaacCriterians;
