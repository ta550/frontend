import React, { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import ModelNotification from "../../../Modals/ModelNotification";
import { MenuItem, Select } from "@material-ui/core";
import axios from "axios";
import $ from "jquery";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function DialogModalMetaData(props) {
  const [open, setOpen] = React.useState(props.DialogStatus);
  const loginReducer = useSelector((state) => state.loginReducer);
  const { callUseEffect } = props;

  const [startDate, setStartDate] = useState(new Date());
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [systems, setSystems] = useState([
    { system: "GCSE" },
    { system: "IGCSE" },
    { system: "AS" },
    { system: "A Level" },
    { system: "O Level" },
    { system: "Pre U" },
    { system: "IB" },
  ]);
  const [boards, setBoards] = useState([]);

  const [subjects, setSubjects] = useState([
    { subject: "Math" },
    { subject: "Physics" },
    { subject: "Biology" },
  ]);

  const [series, setSeries] = useState([
    { series: "1" },
    { series: "2" },
    { series: "3" },
    { series: "4" },
    { series: "5" },
    { series: "6" },
  ]);

  const [papers, setPapers] = useState([
    { paper: "Paper 1" },
    { paper: "Paper 2" },
    { paper: "Paper 3" },
  ]);

  const [paper, setPaper] = useState({
    system: "",
    board: "",
    subject: "",
    year: "",
    month: "",
    series: "",
    paper: "",
  });

  const submit_data = (e) => {
    e.preventDefault();
    console.log("paper is this: ", paper);
    axios({
      method: "POST",
      url: `/dashboard/de/metadata/${props.id}`,
      data: paper,
    })
      .then((res) => {
        props.handleClose();
        callUseEffect();
      })
      .catch((err) => console.log(err));
  };

  const change_input = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "system") {
      if (value === "GCSE") {
        setBoards([
          { board: "Edexcel CGSE" },
          { board: "AQA GCSE" },
          { board: "OCR GCSE" },
          { board: "CCEA GCSE" },
        ]);
      } else if (value === "IGCSE") {
        setBoards([{ board: "Edexcel IGCSE" }, { board: "CIE IGCSE" }]);
      } else if (value === "AS") {
        setBoards([
          { board: "Edexcel AS" },
          { board: "AQA AS" },
          { board: "OCR AS" },
          { board: "CIE AS" },
          { board: "Edexcel IAL" },
        ]);
      } else if (value === "A Level") {
        setBoards([
          { board: "Edexcel A Level" },
          { board: "AQA A Level" },
          { board: "OCR A Level" },
          { board: "CIE A Level" },
          { board: "Edexcel IAL" },
        ]);
      } else if (value === "O Level") {
        setBoards([
          { board: "Edexcel A Level" },
          { board: "AQA A Level" },
          { board: "OCR A Level" },
          { board: "CIE A Level" },
          { board: "Edexcel IAL" },
        ]);
      } else if (value === "O Level") {
        setBoards([{ board: "CIE O Level" }]);
      } else if (value === "Pre U") {
        setBoards([{ board: "CIE Pre U" }]);
      } else if (value === "IB") {
        setBoards([{ board: "No Board", status: "disable" }]);
      } else {
        setBoards([]);
      }
    }
    setPaper({ ...paper, [e.target.name]: value });
  };

  React.useEffect(() => {
    const e = {
      target: { name: "system", value: props.data.system },
    };
    change_input(e);
    setPaper({
      system: props.data.system,
      board: props.data.board,
      subject: props.data.subject,
      year: props.data.year,
      month: props.data.month,
      series: props.data.series,
      paper: props.data.paper,
    });
    setOpen(props.DialogStatus);
    let year = props.data.year;
    let month = props.data.month;
    let monthNumber = "";
    switch (month) {
      case "January":
        monthNumber = 0;
        break;
      case "February":
        monthNumber = 1;
        break;
      case "March":
        monthNumber = 2;
        break;
      case "April":
        monthNumber = 3;
        break;
      case "May":
        monthNumber = 4;
        break;
      case "June":
        monthNumber = 5;
        break;
      case "July":
        monthNumber = 6;
        break;
      case "August":
        monthNumber = 7;
        break;
      case "September":
        monthNumber = 8;
        break;
      case "October":
        monthNumber = 9;
        break;
      case "November":
        monthNumber = 10;
        break;
      case "December":
        monthNumber = 11;
        break;
      default:
        monthNumber = 1;
        year = 2020;
    }
    const newDate = new Date(year, monthNumber);
    setStartDate(newDate);
  }, [props.DialogStatus]);
  const change_month_and_year = (date) => {
    setStartDate(date);
    const monthNumber = date.getMonth();
    const year = date.getFullYear();
    var month = "";
    switch (monthNumber.toString()) {
      case "0":
        month = "January";
        break;
      case "1":
        month = "February";
        break;
      case "2":
        month = "March";
        break;
      case "3":
        month = "April";
        break;
      case "4":
        month = "May";
        break;
      case "5":
        month = "June";
        break;
      case "6":
        month = "July";
        break;
      case "7":
        month = "August";
        break;
      case "8":
        month = "September";
        break;
      case "9":
        month = "October";
        break;
      case "10":
        month = "November";
        break;
      case "11":
        month = "December";
        break;
      default:
        alert("please try again");
    }
    setPaper({ ...paper, year: year.toString(), month: month });
  };
  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        fullWidth="true"
        maxWidth="sm"
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent className="px-5">
          <form
            className="board_form mx-auto"
            onSubmit={submit_data}
            id="myForm"
          >
            <div className="form-group">
              <label htmlFor="system">Select System : </label>
              <select
                value={paper.system}
                id="system"
                name="system"
                onChange={change_input}
                id="grouped-select"
                className="form-control form-select"
                required
              >
                <option>None</option>
                {systems.map((item, i) => {
                  return <option value={item.system}>{item.system}</option>;
                })}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="">Select Board : </label>
              <select
                value={paper.board}
                name="board"
                onChange={change_input}
                id="grouped-select"
                className="form-control form-select"
                required
              >
                <option value="">None</option>
                {boards.map((item, i) => {
                  return <option value={item.board}>{item.board}</option>;
                })}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="">Select Subject :</label>
              <select
                value={paper.subject}
                name="subject"
                onChange={change_input}
                id="grouped-select"
                className="form-control form-select"
                required
              >
                <option value="">None</option>
                {subjects.map((item, i) => {
                  return <option value={item.subject}>{item.subject}</option>;
                })}
              </select>
            </div>
            <div className="form-group datepicker_main">
              <label htmlFor="">Select Year And Month :</label>
              <br />
              <DatePicker
                className="form-control w-100"
                selected={startDate}
                showMonthYearPicker
                peekNextMonth
                onChangeRaw={(e) => e.preventDefault()}
                onFocus={(e) => e.preventDefault()}
                onKeyDown={(e) => e.preventDefault()}
                disabledKeyboardNavigation
                dateFormat="MMMM yyyy"
                onChange={change_month_and_year}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Select Series : </label>
              <select
                value={paper.series}
                name="series"
                onChange={change_input}
                id="grouped-select"
                className="form-control form-select"
                required
              >
                <option value="">None</option>
                {series.map((item, i) => {
                  return <option value={item.series}>{item.series}</option>;
                })}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="">Select Paper :</label>
              <select
                value={paper.paper}
                name="paper"
                onChange={change_input}
                id="grouped-select"
                className="form-control form-select"
                required
              >
                <option value="">None</option>
                {papers.map((item, i) => {
                  return <option value={item.paper}>{item.paper}</option>;
                })}
              </select>
            </div>
            <div className="form-group justify-content-center d-flex">
              <button type="submit" className="btn px-5 py-2 bg-info mybutton">
                Submit
              </button>
            </div>
          </form>
          <ModelNotification
            DialogStatus={notificationStatus}
            DialogTitle="Notification"
            DialogDesc="Please Select Year and month."
            handleClose={() => setNotificationStatus(false)}
            DialogOk="Ok"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DialogModalMetaData;
