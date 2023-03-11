import React, { useContext, useState } from "react";
import { CardFixedTop } from "../../../utils";
import PsContext from "../../../context";
import { Alert, Button, Card } from "react-bootstrap";
import CSVReader from "react-csv-reader";

import SampleCsv from "../../../assets/samples/students_import_format.csv";
import { toast } from "react-hot-toast";

const ImportBox = (props) => {
  const context = useContext(PsContext);
  const [loader, setLoader] = useState(false);

  const [dataList, setDataList] = useState([]);

  const resetAll = () => {};

  const handleFileLoad = (data, fileInfo, originalFile) => {
    if (data.length > 150) {
      toast.error("You are allowed to upload 150 students records at once");
      return;
    }
    if (props.onDataSuccess) props.onDataSuccess(data);
  };

  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.toLowerCase().replace(/\W/g, "_"),
  };

  return (
    <div>
      <Card>
        <Card.Header className="fw-bold">Import Csv File</Card.Header>
        <Card.Body>
          <CSVReader
            cssClass="csv-reader-input"
            //label="Select Students CSV File"
            onFileLoaded={handleFileLoad}
            //onError={this.handleDarkSideForce}
            //parserOptions={papaparseOptions}
            parserOptions={papaparseOptions}
            inputId="student_csv_import"
            inputName="student_csv_import"
            inputStyle={{ color: "red" }}
          />
          <div className="my-3">
            Don't remove the column header in .csv file
            <br />
            The following fields are required in .csv file
            <ul>
              <li>admissionno</li>
              <li>admissiondate</li>
              <li>rollno</li>
              <li>section</li>
              <li>semester</li>
              <li>name</li>
              <li>mobile</li>
              <li>email</li>
              <li>gender</li>
              <li>dob (YYYY-MM-DD)</li>
              <li>fathername</li>
            </ul>
          </div>
          <Alert>
            Allowed csv file only. <a href={SampleCsv}>Click here</a> to
            download sample csv file
          </Alert>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ImportBox;
