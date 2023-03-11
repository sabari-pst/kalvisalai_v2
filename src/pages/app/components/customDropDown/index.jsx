import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { Select } from "antd";
import { lowerCase, upperCase } from "../../../../utils";
import { useEffect } from "react";

const { Option } = Select;

const CustomDropDown = (props) => {
  const history = useHistory();

  const [value, setValue] = useState();

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const onChange = (v) => {
    setValue(v);
    let ds = [];
    if (props.dataSource) ds = props.dataSource;
    let s = ds.find((item) => upperCase(item[props.value]) == upperCase(v));

    if (props.onChange) props.onChange(v, s);
  };

  const loadOptions = () => {
    if (props.options) return;
    let ds = [];
    if (props.dataSource) ds = props.dataSource;
    let rv = [];
    if (props.defaultOption) rv.push({ value: 0, label: "All" });
    ds.map((item, i) => {
      rv.push({
        label: props.displayField
          ? props.displayField(item)
          : item[props.valueField],
        value: item[props.valueField || props.value || "id"],
      });
    });
    return rv;
    return ds.map((item) => (
      <Option value={item[props.value]}>
        {props.displayField ? props.displayField(item) : item[props.value]}
      </Option>
    ));
  };

  return (
    <>
      <Select
        showSearch
        disabled={props.disabled ? true : false}
        placeholder={props.placeholder}
        optionFilterProp="children"
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        style={{ width: "100%", fontSize: "12px" }}
        className="fw-bold"
        value={props.value}
        onChange={(v) => onChange(v)}
        options={props.options || loadOptions()}
      ></Select>
    </>
  );
};

export default CustomDropDown;
