import { Spin } from "antd";
import React, { useState, useEffect, useContext, useCallback } from "react";

import PsContext from "../../../context";
import { listCashbooks } from "../../../models/settings";
import PsModalWindow from "../../../utils/PsModalWindow";

const SelectCashbookModal = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoader(true);
    listCashbooks("1").then((res) => {
      if (res) setDataList(res);
      setLoader(false);
    });
  };

  const handleSelectClick = (item) => {
    context.updateCashbook(item);

    if (props.onHide) props.onHide();
  };

  return (
    <>
      <PsModalWindow title="Select Cashbook" size="md" {...props}>
        <div style={{ minHeight: "calc(100vh - 250px)" }}>
          <Spin spinning={loader}>
            <b>Cashbooks</b>
            <hr />
            <ul>
              {dataList.map((item, i) => {
                return (
                  <li className="py-3 border-bottom">
                    {item.cashbook_name}
                    <a
                      className="float-end btn btn-primary btn-sm"
                      onClick={(e) => handleSelectClick(item)}
                    >
                      Select
                    </a>
                  </li>
                );
              })}
            </ul>
          </Spin>
        </div>
      </PsModalWindow>
    </>
  );
};

export default SelectCashbookModal;
