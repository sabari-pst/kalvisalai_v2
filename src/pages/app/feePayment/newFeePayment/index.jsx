import React, { useState, useContext, useEffect } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import $ from "jquery";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";

import {
  capitalizeFirst,
  CardFixedTop,
  groupByMultiple,
  momentDate,
  upperCase,
} from "../../../../utils";
import KeyboardEventHandler from "react-keyboard-event-handler";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { Input, Spin } from "antd";

import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";
import SearchStudent from "./searchStudent";
import { listFeeCategoy, listFeeTemplates } from "../../../../models/fees";
import FeeCategorySearch from "../feeCategorySearch";
import FeePaymentPartEntry from "../feePaymentPartEntry";
import FeeReceiptPrintA5 from "../feeReceiptPrintA5";
import PaymentMethodSelection from "./paymentMethodSelection";
import ModuleAccess from "../../../../context/moduleAccess";
import CashbookLayout from "../../selectCashbook/cashbookLayout";

const NewFeePayment = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);

  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [viewData, setViewData] = useState([]);
  const [viewIndex, setViewIndex] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState([]);
  const [billId, setBillId] = useState("");
  const [billNo, setBillNo] = useState("");
  const [billTime, setBillTime] = useState("");

  const [student, setStudents] = useState([]);

  const [payments, setPayments] = useState([]);
  const [paid, setPaid] = useState([]);
  const [unPaid, setUnPaid] = useState([]);
  const [cancelled, setCancelled] = useState([]);

  const [feeTemplateSource, setFeeTemplateSource] = useState([]);
  const [feeTemplates, setFeeTemplates] = useState([]);
  const [categorySource, setCategorySource] = useState([]);
  const [feeCategories, setFeeCategories] = useState([]);
  const [categorySerach, setCategorySearch] = useState(false);
  const [discount, setDiscount] = useState(0);

  const [partEntry, setPartEntry] = useState(false);
  const [printModal, setPrintModal] = useState(false);

  const [redirect, setRedirect] = useState([]);
  const [studentBalance, setStudentBalance] = useState(0);

  const stateField = (fieldName) => {
    return props?.location?.state?.[fieldName];
  };

  useEffect(() => {
    if (context.cashbook.id) {
      listFeeCategoy(1).then((res) => {
        let cat = [];
        if (res) {
          setCategorySource(res);
          cat = res;
          setFeeCategories(cat);
        }
        /*listFeeTemplates().then(res => {
				if(res){
					
					let m = groupByMultiple(res, function(obj){
						return [obj.template_uuid];
					});
					
					m.map((items,i)=>{
						let item = items[0];
						cat.push({
							fee_template_uuid: item.template_uuid,
							category_name: item.template_name,
							fee_category_amount: getTemplatetotal(items),
						});
					});
					setFeeTemplateSource(res);
					setFeeTemplates(cat);
					setFeeCategories(cat);
				}
			});*/
      });
      if (stateField("bill_uuid")) {
        findStudent();
        loadBillNo();
      }
    }
  }, [JSON.stringify(context.cashbook)]);

  const findStudent = () => {
    setLoader(true);
    const form = new FormData();
    form.append("uuid", stateField("student_uuid"));
    axios.post(ServiceUrl.STUDENTS.SEARCH_BY_REGISTER_NO, form).then((res) => {
      if (res["data"].status == "1") {
        setStudents(res["data"].data[0]);
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  /*useEffect(()=>{
		let cat = [...categorySource];
		feeTemplates.map((items,i)=>{
			let item = items;			
			cat.push(item);
		});
		setFeeCategories(cat);
	},[categorySource]);*/

  const getTemplatetotal = (items) => {
    let total = 0;
    items.map(
      (item) =>
        item.fee_category_amount &&
        (total = parseFloat(total) + parseFloat(item.fee_category_amount))
    );
    return parseFloat(total).toFixed(2);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBillTime(momentDate(new Date(), "hh:mm A"));
    }, 3000);
    //return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (student && student.uuid) loadPayments();
  }, [student]);

  const loadBillNo = () => {
    setLoader(true);
    let url = props.bankChallan
      ? ServiceUrl.FEES.CHALLAN_BILL_NO
      : ServiceUrl.FEES.BILL_NO;
    axios.get(url).then((res) => {
      if (res["data"].status == "1") {
        setBillId(res["data"].data.id);
        setBillNo(res["data"].data.no);
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const loadPayments = () => {
    setLoader(true);
    const form = new FormData();
    form.append("student_uuid", student.uuid);
    form.append("type", "all");
    form.append("uuid", stateField("bill_uuid"));
    let url = stateField("bill_uuid")
      ? ServiceUrl.FEES.CHALLAN_LIST_PAYMENT
      : ServiceUrl.FEES.LIST_PAYMENT;
    axios.post(url, form).then((res) => {
      if (res["data"].status == "1") {
        let d = res["data"].data;

        setPayments(d);
        if (stateField("bill_uuid")) {
          setUnPaid(d);
        } else {
          setPaid(
            d.filter((item) => item.bill_id != null && item.is_cancelled == 0)
          );
          setUnPaid(
            d.filter((item) => item.bill_id == null && item.is_cancelled == 0)
          );
          setCancelled(d.filter((item) => item.is_cancelled == 1));
        }
        setStudentBalance(res["data"].balance);
      } else {
        //toast.error(res['data'].message || 'Error');
      }
      setLoader(false);
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (getTotalToPaid() < 1) {
      toast.error("Please check the Bill Amount");
      return;
    }

    if (!window.confirm("Do you want to save?")) {
      return;
    }

    setLoader(true);
    let url = props.bankChallan
      ? ServiceUrl.FEES.CHALLAN_SAVE_STUDENT_PAYMENT
      : ServiceUrl.FEES.SAVE_STUDENT_PAYMENT;
    axios
      .post(url, $("#frm_SaveStudentWiseFeePayment").serialize())
      .then((res) => {
        if (res["data"].status == "1") {
          toast.success(res["data"].message || "Success");
          if (props.bankChallan) {
            setRedirect(res["data"].data);
          } else {
            setSelectedCourse([]);
            setDataList([]);
            setLoader(false);
            if (window.confirm("Do you want to print ?")) {
              setViewData(res["data"].data);
              setPrintModal(true);
              props.location.state.bill_uuid = false;
            } else {
              resetAll();
            }
          }
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  const resetAll = () => {
    setStudents([]);
    setDataList([]);
    setBillId("");
    setBillNo("");
    setDiscount(0);
    setUnPaid([]);
    setCancelled([]);
    setPaid([]);
    setPayments([]);
    setViewData([]);
    setPrintModal(false);
    setViewData([]);
    setLoader(false);
    props.location.state.bill_uuid = false;
  };

  const onSearchSuccess = (d) => {
    let up = [...unPaid];
    let index = up.findIndex((item) => item.fee_category_id == d.id);
    /*if(index>-1)
		{
			if(!window.confirm('Category already exist. Do you want to add another one time?')){
				return;
			}			
		}*/
    if (d.fee_template_uuid) {
      let m = feeTemplateSource.filter(
        (item) => item.template_uuid == d.fee_template_uuid
      );
      m.map((obj, i) => {
        let m = {
          student_uuid: student.uuid,
          semester: student.current_semester || student.semester,
          fee_category_id: obj.id,
          fee_amount: obj.fee_category_amount || 0,
          category_name: obj.category_name,
          category_print_name: obj.category_print_name,
          category_account_no: obj.category_account_no,
        };
        up.push(m);
      });
      setUnPaid(up);
      setCategorySearch(false);
    } else {
      let m = {
        student_uuid: student.uuid,
        semester: student.current_semester || student.semester,
        fee_category_id: d.id,
        fee_amount: d.category_amount || 0,
        category_name: d.category_name,
        category_print_name: d.category_print_name,
        category_account_no: d.category_account_no,
      };
      up.push(m);
      setUnPaid(up);
      setCategorySearch(false);
    }
  };

  const removeCategory = (index, item) => {
    if (!window.confirm("Do you want to remove?")) {
      return;
    }
    let up = [...unPaid];
    up.splice(index, 1);
    setUnPaid(up);
  };

  const handleAmountChange = (index, item, e) => {
    let up = [...unPaid];
    up[index]["fee_amount"] = e.target.value;
    setUnPaid(up);
  };

  const getBilltotal = () => {
    let total = 0;
    unPaid.map(
      (item) => (total = parseFloat(total) + parseFloat(item.fee_amount))
    );
    return parseFloat(total).toFixed(2);
  };

  const getTotalToPaid = () => {
    let total = getBilltotal();
    let tot = parseFloat(total) - parseFloat(discount);
    return parseFloat(tot).toFixed(2);
  };

  const openPartEntryWindow = (index, item) => {
    setViewIndex(index);
    setViewData(item);
    setPartEntry(true);
  };

  const handlePartSuccess = (d) => {
    let up = [...unPaid];
    let amt = parseFloat(up[viewIndex]["fee_amount"]);
    up[viewIndex]["part_type"] = d.part_type;
    if (d.part_type == "concession") {
      up[viewIndex]["part_amount"] = parseFloat(d.part_amount).toFixed(2);
      up[viewIndex]["fee_amount"] = (
        parseFloat(amt) - parseFloat(d.part_amount)
      ).toFixed(2);
    } else if (d.part_type == "part_payment") {
      up[viewIndex]["part_amount"] = (
        parseFloat(amt) - parseFloat(d.part_amount)
      ).toFixed(2);
      up[viewIndex]["fee_amount"] = parseFloat(d.part_amount).toFixed(2);
      up[viewIndex]["part_bill_uuid"] = "";
    }
    setPartEntry(false);
    setUnPaid(up);
    setViewData([]);
    setViewIndex(false);
  };

  const handleKeyDownEvent_New = (key, e) => {
    //console.log(key);
    //console.log(e);
    e.preventDefault();
    // Save Form
    if (e.ctrlKey && upperCase(e.key) == "S") {
      document.getElementById("save_fee_payment").click();
    } else if (e.ctrlKey && upperCase(e.key) == "F") {
      setCategorySearch(true);
    }
  };

  const handleSearchPress = (e) => {
    if (e.target.value == " ") {
      setCategorySearch(true);
    }
  };

  const getSemesters = (sem) => {
    let rv = [];
    for (let i = 1; i <= student.semester; i++)
      rv.push(
        <option value={i} selected={sem == i ? "selected" : ""}>
          {i}
        </option>
      );
    return rv;
  };

  const changeSemester = (item, e) => {
    let m = [...unPaid];
    let index = m.findIndex((obj) => obj == item);
    if (index > -1) m[index]["semester"] = e.target.value;
    setUnPaid(m);
  };

  const paymentThroughChallan = () => {
    return stateField("bill_uuid") ? true : false;
  };

  if (redirect && redirect.uuid) {
    return <Redirect to={`/app/fee/bank-challan-print/${redirect.uuid}`} />;
  }

  return (
    <>
      <CashbookLayout>
        <CardFixedTop
          title={
            props.bankChallan ? "Print Bank Challan" : "Student Fee Payment"
          }
        >
          <ul className="list-inline mb-0">
            {props.bankChallan && (
              <ModuleAccess module={"fee_bank_challan"} action={"action_list"}>
                <li className="list-inline-item">
                  <Link
                    to="/app/fee/bank-challans"
                    className="btn btn-transparent border-start ms-2"
                  >
                    <i className="fa-solid fa-arrow-left pe-1"></i> Back to list
                  </Link>
                </li>
              </ModuleAccess>
            )}
            <li className="list-inline-item">
              <Button
                variant="white"
                className="border-start ms-2"
                onClick={(e) => resetAll()}
                disabled={student && student.length < 1}
              >
                <i className="fa-solid fa-xmark fs-5 px-1"></i> Reset
              </Button>
            </li>
          </ul>
        </CardFixedTop>

        <KeyboardEventHandler
          handleKeys={["ctrl+s", "ctrl+f"]}
          onKeyEvent={handleKeyDownEvent_New}
        >
          <div className="container mt-3" tabIndex={0}>
            <Spin spinning={loader}>
              {student && student.length < 1 && (
                <Row>
                  <Col md={9}>
                    <SearchStudent
                      withAllSem={true}
                      onSuccess={(dt, e) => {
                        setStudents(dt);
                        loadBillNo();
                      }}
                    />
                  </Col>
                </Row>
              )}

              {student && (student.course_id || student.course) && (
                <Card>
                  <Card.Body className="">
                    <Form
                      noValidate
                      validated={validated}
                      action=""
                      method="post"
                      id="frm_SaveStudentWiseFeePayment"
                      onSubmit={handleFormSubmit}
                    >
                      <input
                        type="hidden"
                        name="bills"
                        value={JSON.stringify(unPaid)}
                      />
                      <input
                        type="hidden"
                        name="course_id"
                        value={student.course}
                      />
                      <input
                        type="hidden"
                        name="student_uuid"
                        value={student.uuid}
                      />
                      <input
                        type="hidden"
                        name="bill_amount"
                        value={getTotalToPaid()}
                      />

                      <input
                        type="hidden"
                        name="challan_uuid"
                        value={stateField("bill_uuid")}
                      />

                      <Row>
                        <Col md={4}>
                          <Row>
                            <Col md={3}>
                              <label>Register No</label>
                            </Col>
                            <Col md={9}>
                              <Form.Control
                                type="text"
                                size="sm"
                                name="register_no"
                                className="fw-bold"
                                value={
                                  student.registerno || student.admissionno
                                }
                              />
                            </Col>
                          </Row>
                          <Row className="mt-1">
                            <Col md={3}>
                              <label>Name</label>
                            </Col>
                            <Col md={9}>
                              <Form.Control
                                type="text"
                                size="sm"
                                name="student_name"
                                className="fw-bold"
                                value={student.name}
                              />
                            </Col>
                          </Row>
                          <Row className="mt-1">
                            <Col md={3}>
                              <label>Program</label>
                            </Col>
                            <Col md={9}>
                              <Form.Control
                                type="text"
                                size="sm"
                                name="course_name"
                                className="fw-bold"
                                value={
                                  student.degree_name +
                                  " - " +
                                  student.course_name +
                                  " (" +
                                  (upperCase(student.course_type) == "SELF"
                                    ? "SF"
                                    : "R") +
                                  ")"
                                }
                              />
                            </Col>
                          </Row>
                          <Row className="mt-1">
                            <Col md={3}>
                              <label>Batch / Sem</label>
                            </Col>
                            <Col md={6}>
                              <Form.Control
                                type="text"
                                size="sm"
                                name="academic_year"
                                className="fw-bold"
                                value={student.batch}
                              />
                            </Col>
                            <Col md={3}>
                              <Form.Control
                                type="text"
                                size="sm"
                                name="semester"
                                className="fw-bold"
                                value={student.semester}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col md={5}>
                          <PaymentMethodSelection
                            grandTotal={getTotalToPaid()}
                          />
                        </Col>
                        <Col md={3}>
                          <Row>
                            <Col md={3}>
                              <label>
                                {props.bankChallan ? "No " : "Bill No"}
                              </label>
                            </Col>
                            <Col md={9}>
                              <Form.Control
                                type="text"
                                size="sm"
                                name="register_no"
                                className="fw-bold"
                                value={billNo}
                              />
                            </Col>
                          </Row>
                          <Row className="mt-1">
                            <Col md={3}>
                              <label>
                                {props.bankChallan ? "Date" : "Bill Date"}
                              </label>
                            </Col>
                            <Col md={9}>
                              <Form.Control
                                type="date"
                                size="sm"
                                name="bill_date"
                                className="fw-bold"
                                max={momentDate(new Date(), "YYYY-MM-DD")}
                                defaultValue={momentDate(
                                  new Date(),
                                  "YYYY-MM-DD"
                                )}
                              />
                            </Col>
                          </Row>
                          <Row className="mt-1">
                            <Col md={3}>
                              <label>
                                {props.bankChallan ? "Time" : "Bill Time"}
                              </label>
                            </Col>
                            <Col md={9}>
                              <Form.Control
                                type="text"
                                size="sm"
                                name="bill_time"
                                className="fw-bold"
                                value={billTime}
                              />
                            </Col>
                          </Row>
                          <Row className="mt-1">
                            <Col md={3}>
                              <label>
                                {props.bankChallan ? "By" : "Bill By"}
                              </label>
                            </Col>
                            <Col md={9}>
                              <Form.Control
                                type="text"
                                size="sm"
                                name="bill_by"
                                className="fw-bold"
                                value={context.user.employee_name}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>

                      <Row className="mt-3">
                        <Col md={12}>
                          <div
                            className="tableFixHead"
                            style={{ height: "calc(100vh - 330px)" }}
                          >
                            <table>
                              <thead>
                                <tr>
                                  <th width="80">S.No</th>
                                  <th>Category Name</th>
                                  <th>Account No</th>
                                  <th width="80" className="text-center">
                                    Semester
                                  </th>
                                  <th width="200" className="text-end">
                                    Amount
                                  </th>
                                  <th width="60" className="text-center">
                                    #
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {unPaid.map((item, i) => {
                                  return (
                                    <tr key={i}>
                                      <td>{i + 1}</td>
                                      <td className="">
                                        {item.category_print_name ||
                                          item.category_name}
                                      </td>
                                      <td className="">
                                        {item.catgory_account_no}
                                      </td>
                                      <td align="center" className="">
                                        {context.allowedAccess(
                                          "fee_payment_change_semester",
                                          "action_update"
                                        ) && !item.id ? (
                                          <>
                                            <select
                                              style={{ width: "100%" }}
                                              onChange={(e) =>
                                                changeSemester(item, e)
                                              }
                                            >
                                              {getSemesters(item.semester)}
                                            </select>
                                          </>
                                        ) : (
                                          item.semester
                                        )}
                                      </td>
                                      <td className="">
                                        {item.id ? (
                                          <>
                                            <InputGroup
                                              size="sm"
                                              className="cursor-pointer"
                                            >
                                              <Form.Control
                                                type="number"
                                                size="sm"
                                                className="fw-bold text-end "
                                                value={item.fee_amount}
                                                onChange={(e) =>
                                                  handleAmountChange(i, item, e)
                                                }
                                                readOnly
                                              />
                                              {!paymentThroughChallan() &&
                                                (!item.part_bill_uuid ||
                                                  item.part_type ==
                                                    "part_payment") && (
                                                  <InputGroup.Text
                                                    onClick={(e) =>
                                                      openPartEntryWindow(
                                                        i,
                                                        item,
                                                        e
                                                      )
                                                    }
                                                    className="cursor-pointer"
                                                  >
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                  </InputGroup.Text>
                                                )}
                                            </InputGroup>
                                            {item.part_type &&
                                              item.part_type ==
                                                "concession" && (
                                                <>
                                                  Concession :{" "}
                                                  {item.part_amount}
                                                </>
                                              )}
                                            {item.part_type &&
                                              item.part_type ==
                                                "part_payment" && (
                                                <>
                                                  Part Payment{" "}
                                                  {item.part_bill_uuid
                                                    ? "(Paid)"
                                                    : "(Bal.)"}{" "}
                                                  : {item.part_amount}
                                                </>
                                              )}
                                          </>
                                        ) : (
                                          <Form.Control
                                            type="number"
                                            size="sm"
                                            className="fw-bold text-end"
                                            value={item.fee_amount}
                                            onChange={(e) =>
                                              handleAmountChange(i, item, e)
                                            }
                                          />
                                        )}
                                      </td>
                                      <td align="center">
                                        {!paymentThroughChallan() && (
                                          <Button
                                            type="button"
                                            size="sm"
                                            variant="transparent"
                                            onClick={(e) =>
                                              removeCategory(i, item)
                                            }
                                          >
                                            <i className="fa-regular fa-trash-can"></i>
                                          </Button>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                                <tr>
                                  <td colSpan={6}>
                                    {/* Enable search if payment entry not from bank challan list 
                                    paymentThroughChallan function return true if payment entry from bank challan
                                  */}
                                    {!paymentThroughChallan() && (
                                      <Form.Control
                                        as="textarea"
                                        rows="1"
                                        size="sm"
                                        placeholder="Press Space bar to Search fee category..."
                                        value=""
                                        onChange={(e) => handleSearchPress(e)}
                                        autoFocus={true}
                                      />
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </Col>
                      </Row>
                      <Row className="pt-3 border-top">
                        <Col md={2}>
                          <InputGroup size="sm">
                            <InputGroup.Text>Balance</InputGroup.Text>
                            <Form.Control
                              type="text"
                              size="sm"
                              className="fw-bold text-end text-danger "
                              name="student_balance"
                              value={studentBalance}
                            />
                          </InputGroup>
                        </Col>
                        <Col md={2}>
                          <InputGroup size="sm">
                            <InputGroup.Text>Total</InputGroup.Text>
                            <Form.Control
                              type="text"
                              size="sm"
                              className="fw-bold text-end"
                              name="bill_grand_total"
                              value={getBilltotal()}
                            />
                          </InputGroup>
                        </Col>
                        <Col md={2}>
                          <InputGroup size="sm">
                            <InputGroup.Text>Discount (Rs.)</InputGroup.Text>
                            <Form.Control
                              type="text"
                              size="sm"
                              className="fw-bold text-end"
                              name="bill_discount"
                              value={discount}
                              onChange={(e) => setDiscount(e.target.value)}
                            />
                          </InputGroup>
                        </Col>
                        <Col md={2}></Col>
                        <Col md={4}>
                          <div className="text-end">
                            <a
                              className="border-end pe-2 me-3 fs-10"
                              onClick={(e) => resetAll()}
                            >
                              <u>Cancel</u>
                            </a>
                            <LoaderSubmitButton
                              text={
                                props.bankChallan
                                  ? "Save & Print Challan"
                                  : "Save Fees"
                              }
                              id="save_fee_payment"
                              loading={loader}
                            />
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              )}
            </Spin>
          </div>
        </KeyboardEventHandler>
      </CashbookLayout>

      {categorySerach && (
        <FeeCategorySearch
          title="Search Fee Category"
          size="lg"
          show={categorySerach}
          onHide={(e) => setCategorySearch(false)}
          onCancel={(e) => setCategorySearch(false)}
          dataSource={feeCategories}
          onSuccess={onSearchSuccess}
        />
      )}

      {partEntry && (
        <FeePaymentPartEntry
          title="Part Payment / Remove Payment"
          size="md"
          show={partEntry}
          onHide={(e) => setPartEntry(false)}
          onCancel={(e) => setPartEntry(false)}
          dataSource={viewData}
          onSuccess={handlePartSuccess}
        />
      )}

      {printModal && (
        <FeeReceiptPrintA5
          onSuccess={(e) => resetAll()}
          dataSource={viewData}
        />
      )}
    </>
  );
};

export default NewFeePayment;
