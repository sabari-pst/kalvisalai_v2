import { Spin } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import PsContext from "../../../../context";
import ModuleAccess from "../../../../context/moduleAccess";
import { listStudentTemplates } from "../../../../models/utilities";
import { CardFixedTop, momentDate, upperCase } from "../../../../utils";

const StudentCertificates = (props) => {
  const context = useContext(PsContext);
  const [loader, setLoader] = useState(false);

  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoader(true);
    listStudentTemplates().then((res) => {
      if (res) {
        setDataList(res);
        setDataView(res);
      }
      setLoader(false);
    });
  };

  const handleSearch = (e) => {
    let v = upperCase(e.target.value);
    let m = dataList.filter(
      (item) => upperCase(item.certificate_title).indexOf(v) > -1
    );
    setDataView(m);
  };

  return (
    <>
      <CardFixedTop title="Student Certificates">
        <ul className="list-inline mb-0">
          <li className="list-inline-item">
            <Button
              size="sm"
              variant="transparent"
              className="fs-6 border-start"
              onClick={(e) => loadData()}
            >
              <i className="fa-solid fa-arrows-rotate px-2"></i> Refresh
            </Button>
          </li>
        </ul>
      </CardFixedTop>

      <div className="container py-2">
        <Card>
          <Card.Body>
            <Row className="mb-2">
              <Col md={4}>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fa-sharp fa-solid fa-magnifying-glass fs-6"></i>
                  </InputGroup.Text>
                  <Form.Control
                    size="sm"
                    placeholder="Search by Title"
                    onChange={(e) => handleSearch(e)}
                  />
                </InputGroup>
              </Col>
              <Col md={8} className="text-end">
                Total {dataView.length} Templates in list
              </Col>
            </Row>
            <Spin spinning={loader}>
              <div className="tableFixHead ps-table">
                <table>
                  <thead>
                    <tr>
                      <th width="60">S.No</th>
                      <th>Title</th>
                      <th>Page Layout</th>
                      <th width="160">Last Edit On</th>
                      <th width="80">Manage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataView.map((item, i) => {
                      return (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{item.certificate_title}</td>
                          <td>
                            {upperCase(item.page_size)}-
                            {upperCase(item.page_layout)}
                          </td>
                          <td>{momentDate(item.edit_on, "DD/MM/YYYY")}</td>
                          <td align="center">
                            <ModuleAccess
                              module="stu_certificates"
                              action="action_update"
                            >
                              <Link
                                to={`/app/uti/student-certificates/edit/${item.id}/${item.certificate_name}`}
                                className="btn btn-sm btn-transparent"
                              >
                                <i className="fa-sharp fa-solid fa-pen-to-square fs-6"></i>
                              </Link>
                            </ModuleAccess>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Spin>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};
export default withRouter(StudentCertificates);
