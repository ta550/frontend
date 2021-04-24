import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Box from "@material-ui/core/Box";
import "react-datepicker/dist/react-datepicker.css";
import Container from "@material-ui/core/Container";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Zoom from "@material-ui/core/Zoom";
import DatePicker from "react-datepicker";
import "../css/AdminSearchComponent.css";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import magnifier from "../images/magnifier.svg";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  firstLine: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
  },
  firstLineChild: {
    flex: "10%",
  },
  secondLine: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  secondLineChild: {
    flex: "40%",
  },
  btnSearch: {
    marginLeft: "0.2rem",
    backgroundColor: "Transparent",
    backgroundRepeat: "no-repeat",
    borderRadius: "50%",
    overflow: "hidden",
    border: "none",
    cursor: "pointer",
    outline: "none",
  },
}));

function ScrollTop(props) {
  const { children, window } = props;
  const classes = useStyles();

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });
  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    );

    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.root}>
        {children}
      </div>
    </Zoom>
  );
}

const AdminSearchComponent = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [startDate, setStartDate] = useState(new Date());
  const [rangeStartDate, setRangeStartDate] = useState(new Date());
  const [rangeEndDate, setRangeEndDate] = useState(new Date());
  const [systems, setSystems] = useState([
    { system: "GCSE" },
    { system: "IGCSE" },
    { system: "AS" },
    { system: "A Level" },
    { system: "O Level" },
    { system: "Pre U" },
    { system: "IB" },
  ]);
  const [paper, setPaper] = useState({
    system: "",
    board: "",
    subject: "",
    year: "",
    month: "",
  });
  const [isDateRange, setIsDateRange] = useState(false);
  const [boards, setBoards] = useState([]);
  const [subjects, setSubjects] = useState([
    { subject: "Math" },
    { subject: "Physics" },
    { subject: "Biology" },
  ]);

  const change_input = (e) => {
    if (e.target.name === "system") {
      if (e.target.value === "GCSE") {
        setBoards([
          { board: "Edexcel CGSE" },
          { board: "AQA GCSE" },
          { board: "OCR GCSE" },
          { board: "CCEA GCSE" },
        ]);
      } else if (e.target.value === "IGCSE") {
        setBoards([{ board: "Edexcel IGCSE" }, { board: "CIE IGCSE" }]);
      } else if (e.target.value === "AS") {
        setBoards([
          { board: "Edexcel AS" },
          { board: "AQA AS" },
          { board: "OCR AS" },
          { board: "CIE AS" },
          { board: "Edexcel IAL" },
        ]);
      } else if (e.target.value === "A Level") {
        setBoards([
          { board: "Edexcel A Level" },
          { board: "AQA A Level" },
          { board: "OCR A Level" },
          { board: "CIE A Level" },
          { board: "Edexcel IAL" },
        ]);
      } else if (e.target.value === "O Level") {
        setBoards([
          { board: "Edexcel A Level" },
          { board: "AQA A Level" },
          { board: "OCR A Level" },
          { board: "CIE A Level" },
          { board: "Edexcel IAL" },
        ]);
      } else if (e.target.value === "O Level") {
        setBoards([{ board: "CIE O Level" }]);
      } else if (e.target.value === "Pre U") {
        setBoards([{ board: "CIE Pre U" }]);
      } else if (e.target.value === "IB") {
        setBoards([{ board: "No Board", status: "disable" }]);
      }
    }
    setPaper({ ...paper, [e.target.name]: e.target.value });
  };
  const handleClose = () => {
    history.push("/admin/panel/papers");
  };
  const submit_data = (e) => {
    e.preventDefault();
  };
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
    <React.Fragment>
      <CssBaseline />
      <AppBar>
        <Toolbar>
          <form onSubmit={submit_data} style={{ width: "100%" }} id="myForm">
            <div className={classes.firstLine}>
              <FormControl
                color="secondary"
                className={(classes.formControl, classes.firstLineChild)}
                style={{ marginRight: "1rem" }}
              >
                <InputLabel style={{ color: "#fff" }} id="system-label">
                  System
                </InputLabel>
                <Select
                  labelId="system-label"
                  id="system"
                  name="system"
                  value={paper.system}
                  onChange={change_input}
                >
                  {systems.map((item, i) => {
                    return (
                      <MenuItem value={item.system}>{item.system}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl
                color="secondary"
                style={{ marginRight: "1rem" }}
                className={(classes.formControl, classes.firstLineChild)}
              >
                <InputLabel style={{ color: "#fff" }} id="board-label">
                  Board
                </InputLabel>
                <Select
                  labelId="board-label"
                  id="board"
                  name="board"
                  value={paper.board}
                  onChange={change_input}
                >
                  {boards.map((item, i) => {
                    return <MenuItem value={item.board}>{item.board}</MenuItem>;
                  })}
                </Select>
              </FormControl>
              <FormControl
                color="secondary"
                style={{ marginRight: "1rem" }}
                className={(classes.formControl, classes.firstLineChild)}
              >
                <InputLabel style={{ color: "#fff" }} id="subject-label">
                  Subject
                </InputLabel>
                <Select
                  labelId="subject-label"
                  id="subject"
                  name="subject"
                  value={paper.subject}
                  onChange={change_input}
                >
                  {subjects.map((item, i) => {
                    return (
                      <MenuItem value={item.subject}>{item.subject}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl
                size="small"
                component="fieldset"
                style={{
                  flex: "20%",
                }}
                className={classes.firstLineChild}
              >
                <FormLabel
                  style={{ fontWeight: "300", color: "#fff" }}
                  component="legend"
                >
                  Choose:
                </FormLabel>
                <RadioGroup
                  row
                  aria-label="position"
                  name="position"
                  defaultValue="date"
                >
                  <div style={{ display: "flex" }}>
                    <FormControlLabel
                      value="date"
                      control={
                        <Radio
                          color="secondary"
                          required
                          onChange={(e) =>
                            e.target.checked ? setIsDateRange(false) : ""
                          }
                        />
                      }
                      label="Date"
                    />
                    <FormControlLabel
                      value="dateRange"
                      control={
                        <Radio
                          color="secondary"
                          required
                          onChange={(e) =>
                            e.target.checked ? setIsDateRange(true) : ""
                          }
                        />
                      }
                      label="Date Range"
                    />
                  </div>
                </RadioGroup>
              </FormControl>
              {!isDateRange && (
                <div
                  style={{
                    flex: "20%",
                    display: "flex",
                    justifyContent: "space-evenly",
                  }}
                  className={(classes.firstLineChild, "form-group")}
                >
                  <label
                    htmlFor=""
                    style={{
                      color: "#fff",
                      margin: "0.3rem 0.3rem 0rem 0rem",
                    }}
                  >
                    Year And Month{" "}
                  </label>

                  <DatePicker
                    className="w-100"
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
              )}
              {isDateRange && (
                // <div>
                //   <DateRangePicker
                //     initialSettings={{
                //       startDate: "1/1/2014",
                //       endDate: "3/1/2020",
                //     }}
                //   >
                //     <button>Click Me To Open Picker!</button>
                //   </DateRangePicker>
                // </div>
                <div
                  style={{
                    flex: "20%",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                  }}
                  className={(classes.firstLineChild, "form-group")}
                >
                  <label
                    htmlFor=""
                    style={{
                      color: "#fff",
                      margin: "0.3rem 0.3rem 0rem 0rem",
                    }}
                  >
                    Start Date{" "}
                  </label>

                  <DatePicker
                    className="w-100"
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
                  <label
                    htmlFor=""
                    style={{
                      color: "#fff",
                      margin: "0.3rem 0.3rem 0rem 0rem",
                    }}
                  >
                    End Date{" "}
                  </label>

                  <DatePicker
                    className="w-100"
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
              )}
              <div
                style={{ marginRight: "auto" }}
                className={
                  (classes.firstLineChild,
                  "form-group justify-content-center d-flex")
                }
              >
                <button
                  className={classes.btnSearch}
                  type="submit"
                  /*className="btn  px-5 py-2 bg-info mybutton"*/
                >
                  <img src={magnifier} alt="iiimage" />
                </button>
              </div>
            </div>
          </form>
          {/* <Typography className={classes.title} variant="h6">
            Search Questions
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton> */}
        </Toolbar>
      </AppBar>
      <Toolbar id="back-to-top-anchor" />
      <Container style={{ margin: "0rem" }}>
        <Box style={{ marginTop: "0rem" }} my={2}></Box>
      </Container>
      <ScrollTop {...props}>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </React.Fragment>
  );
};

export default AdminSearchComponent;
