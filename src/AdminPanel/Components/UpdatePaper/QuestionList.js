import React, { useEffect, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
// Dialog Box
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useSelector } from "react-redux";
import DeleteIcon from "@material-ui/icons/Delete";
import { MdModeEdit } from "react-icons/md";
import { BsFillEyeFill } from "react-icons/bs";
import ConfirmDialog from "../../../Modals/ConfirmDialog";
import EditQuestions from "./EditQuestions";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import AddQuestion from "../UpdatePaper/AddQuestion";
import RefreshIcon from "@material-ui/icons/Refresh";
import SeeQuestion from "./SeeQuestion";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition2 = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

function QuestionList(props) {
  const classes = useStyles();
  const { open, metadata, onClose, id } = props;
  const [rows, setRows] = React.useState([]);
  const loginReducer = useSelector((state) => state.loginReducer);
  const [openSeeDialog, setOpenSeeDialog] = React.useState(false);
  const [confirmDialogStatus, setConfirmDialogStatus] = React.useState(false);
  const [getQuestions, setGetQuestions] = React.useState(false);
  const [editQuestionsStatus, setEditQuestionsStatus] = React.useState(false);
  const [progressBarStatus, setProgressBarStatus] = React.useState("");
  const [openAddQuestion, setOpenAddQuestion] = React.useState(false);

  const getAllQuestions = () => {
    if (getQuestions === false) {
      setGetQuestions(true);
    } else {
      setGetQuestions(false);
    }
  };

  const handleCloseDialogBox = () => {
    onClose(false);
  };

  React.useEffect(() => {
    setRows([]);
    setProgressBarStatus("");
    if (id.length === 1) {
      fetch(`/dashboard/de/questions/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginReducer}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (!metadata.subject) {
            onClose(false);
          }
          setRows(res);
          setProgressBarStatus("d-none");
        })
        .catch((err) => console.log(err));
    } else {
      onClose(false);
    }
  }, [id, getQuestions]);

  const deleteQuestion = () => {
    if (window.DeleteQuestionsId !== "") {
      if (id.length !== 0) {
        fetch(`/dashboard/de/question/${window.DeleteQuestionsId}/meta/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loginReducer}`,
          },
        })
          .then((res) => res.json())
          .then((res) => {
            setConfirmDialogStatus(false);
            getAllQuestions();
            window.DeleteQuestionsId = "";
          })
          .catch((err) => console.log(err));
      }
    } else {
      alert("Some Went Wrong. Please Try Again...");
      setConfirmDialogStatus(false);
    }
  };

  const openConfirmDialog = (Qid) => {
    window.DeleteQuestionsId = Qid;
    setConfirmDialogStatus(true);
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleCloseDialogBox}
        TransitionComponent={Transition2}
        style={{ zIndex: "1" }}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Update Questions
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseDialogBox}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <br />
        <div className="d-flex justify-content-center">
          <div
            className={`${progressBarStatus} spinner-border`}
            role="status"
          ></div>
        </div>
        <TableContainer component={Paper}>
          <Table className={`${classes.table}`} aria-label="simple table">
            {rows.map((row, index) => {
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
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-10 p-0 d-flex align-items-center">
                        {/* <TableCell className="onHoverBoldText" onClick={() => { window.SeeQuestionId = row.id; setOpenSeeDialog(true) }} style={{ cursor: 'pointer' }}>{(row.questions.length >= 130) ? row.questions.slice(0, 130)+'...' : row.questions }</TableCell> */}
                        <p
                          className="seeSomeText onHoverBoldText px-3"
                          onClick={() => {
                            window.SeeQuestionId = row.id;
                            window.SeeQuestionIndex = index;
                            setOpenSeeDialog(true);
                          }}
                        >
                          {row.questions}
                        </p>
                      </div>
                      <div className="col-2">
                        <div className="d-flex">
                          <IconButton
                            aria-label="Delete Question"
                            onClick={() => openConfirmDialog(row.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <IconButton
                            aria-label="Edit Question"
                            onClick={() => {
                              window.EditQuestionId = row.id;
                              setEditQuestionsStatus(true);
                            }}
                          >
                            <MdModeEdit />
                          </IconButton>
                          <IconButton
                            aria-label="See Question"
                            onClick={() => {
                              window.SeeQuestionId = row.id;
                              window.SeeQuestionIndex = index;
                              setOpenSeeDialog(true);
                            }}
                          >
                            <BsFillEyeFill />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </TableBody>
              );
            })}
            <Fab
              color="primary"
              style={{ position: "fixed", bottom: "100px", right: "50px" }}
              aria-label="refresh"
              onClick={getAllQuestions}
            >
              <RefreshIcon />
            </Fab>
            <Fab
              color="primary"
              style={{ position: "fixed", bottom: "30px", right: "50px" }}
              aria-label="add"
              onClick={() => {
                window.AddQuestionId = setOpenAddQuestion(true);
              }}
            >
              <AddIcon />
            </Fab>
            {/* Add Question Dialog */}
            <AddQuestion
              getAllQuestions={getAllQuestions}
              id={id}
              open={openAddQuestion}
              handleClose={() => setOpenAddQuestion(false)}
            />
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
      </Dialog>

      {/* Confirm Modal Dialog */}
      <ConfirmDialog
        delete_mcq_by_id={deleteQuestion}
        ConfirmDialog={confirmDialogStatus}
        ConfirmDesc="Are you sure you want to delete this Question?"
        handleClose={() => setConfirmDialogStatus(false)}
      />

      {/* Edit Questions Modal Dialog */}
      <EditQuestions
        metadata={metadata}
        open={editQuestionsStatus}
        getAllQuestions={getAllQuestions}
        onClose={() => {
          window.EditQuestionId = undefined;
          setEditQuestionsStatus(false);
        }}
      />
      {/* See Quesion Modal Dialog */}
      <SeeQuestion
        open={openSeeDialog}
        data={rows}
        handleClose={() => setOpenSeeDialog(false)}
      />
    </div>
  );
}

export default QuestionList;
