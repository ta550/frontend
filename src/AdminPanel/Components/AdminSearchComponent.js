import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Box from "@material-ui/core/Box";
import "react-datepicker/dist/react-datepicker.css";
import Container from "@material-ui/core/Container";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Zoom from "@material-ui/core/Zoom";
import DatePicker from "react-datepicker";
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
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
//Styles
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import "../css/AdminSearchComponent.css";
import { TableCell, TableHead, TableRow } from "@material-ui/core";

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
  container: {
    display: "flex",
    width: "100%",
    height: "100%",
  },
  leftSide: {
    padding: "0 0.2rem",
    flex: "40%",
  },
  rightSide: {
    padding: "0 0.2rem",
    flex: "60%",
    borderLeft: "3px solid #3F51B5",
  },
  questionsContainer: {
    width: "100%",
    overflowX: "hidden",
    height: "100%",
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
  const [isDateRange, setIsDateRange] = useState(false);
  const [boards, setBoards] = useState([]);
  const [progressBarStatus, setProgressBarStatus] = React.useState("");
  const [done, setDone] = useState(false);
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
    date: "",
  });

  const [subjects, setSubjects] = useState([
    { subject: "Math" },
    { subject: "Physics" },
    { subject: "Biology" },
  ]);
  const [rows, setRows] = useState([
    {
      id: "6076bee5302617e23953daa9",
      question: "How large is this question?",
      system: "IGCSE",
      board: "A Levels",
      subject: "Physics",
    },
    {
      id: "60785100302617e23953daba",
      question: "How large is the arctic?",
      system: "IGCSE",
      board: "A Levels",
      subject: "Physics",
    },
    {
      id: "60785100302617e23953dabc",
      question: "How large is the arcticcc?",
      system: "IGCSE",
      board: "A Levels",
      subject: "Physics",
    },
    {
      id: "6078874a302617e23953dac0",
      question: "How are you getting along?",
      system: "IGCSE",
      board: "A Levels",
      subject: "Physics",
    },
    {
      id: "60841b8eb20129668119f5bb",
      question:
        "(a) Hydrogen burns in air at a temperature well above 100 qC to form water.\n (i) The boiling points of hydrogen and water are shown in Figure 3",
      system: "IGCSE",
      board: "A Levels",
      subject: "Physics",
    },
    {
      id: "60841ca6b20129668119f5bc",
      question:
        "(i) Calculate the difference in the number of red blood cells and the number of \nwhite blood cells in 1 cm3\n blood.\n Give your answer in standard form",
      system: "IGCSE",
      board: "A Levels",
      subject: "Physics",
    },
    {
      id: "60841cccb20129668119f5bd",
      question:
        "(i) Calculate the difference in the number of red blood cells and the number of\nwhite blood cells in 1 cm3\nblood.\nGive your answer in standard form",
      system: "IGCSE",
      board: "A Levels",
      subject: "Physics",
    },
    {
      id: "60841d0eb20129668119f5be",
      question:
        "When carbon dioxide dissolves in water, a weakly acidic solution forms.\n Suggest a pH value for this solution. ",
      system: "IGCSE",
      board: "A Levels",
      subject: "Physics",
    },
    {
      id: "60841dc8b20129668119f5bf",
      question:
        "Use the Periodic Table on page 2 to help you answer this question.\n (a) Which word correctly describes substances found in the Periodic Table?",
      system: "IGCSE",
      board: "A Levels",
      subject: "Physics",
    },
    {
      id: "60841e06b20129668119f5c0",
      question:
        "When water is added very slowly to solid CoCl2 , the colour of CoCl2 changes from \nblue to purple and then to pink",
      system: "IGCSE",
      board: "A Levels",
      subject: "Physics",
    },
    {
      id: "60841e45b20129668119f5c1",
      question:
        "A sample of solid X is dissolved in deionised water. \nThe solution is divided into three test tubes and the \nfollowing tests are done",
      system: "IGCSE",
      board: "A Levels",
      subject: "Physics",
    },
    {
      id: "60841e80b20129668119f5c2",
      question:
        "Use your graph to estimate the volume of gas that was given off at two minutes. \n Show clearly on your graph how you obtain your answer.",
      system: "IGCSE",
      board: "A Levels",
      subject: "Physics",
    },
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
                ></FormLabel>
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
                  onClick={() => setDone(true)}
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
      <Container
        style={{
          margin: "0rem",
          width: "100vw",
          height: "100vh",
          padding: "0",
        }}
      >
        <Box my={2} className={classes.container}>
          <div className={classes.leftSide}>
            {done && (
              <div className={classes.questionsContainer}>
                {/* <div className="d-flex justify-content-center">
                  <div
                    className={`${progressBarStatus} spinner-border`}
                    role="status"
                  ></div>
                </div> */}
                <TableContainer component={Paper}>
                  <Table
                    className={`${classes.table}`}
                    aria-label="simple table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell className="bold">Question</TableCell>
                        <TableCell className="bold" align="right">
                          System
                        </TableCell>
                        <TableCell className="bold" align="right">
                          Board
                        </TableCell>
                        <TableCell className="bold" align="right">
                          Subject
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    {rows?.map((row, index) => {
                      var bg;
                      if (index % 2 === 0) {
                        bg = "#F6F6F6";
                      } else {
                        bg = "white";
                      }
                      return (
                        <TableBody
                          key={index}
                          className="p-0 border"
                          style={{ background: bg }}
                        >
                          <TableRow
                            key={index}
                            className="onHoverHighlightTextAndCursor"
                          >
                            <TableCell
                              component="th"
                              scope="row"
                              style={{ width: "10rem" }}
                              align="left"
                            >
                              <div className="textContainer">
                                {row.question}
                              </div>
                            </TableCell>
                            <TableCell align="right">{row.system}</TableCell>
                            <TableCell align="right">{row.board}</TableCell>
                            <TableCell align="right">{row.subject}</TableCell>
                          </TableRow>
                        </TableBody>
                      );
                    })}
                  </Table>
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                </TableContainer>
              </div>
            )}
          </div>

          <div className={classes.rightSide}> This is the right side</div>
        </Box>
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
