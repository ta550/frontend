import React, { useState, useEffect } from "react";
import axios from "axios";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import { Button } from "@material-ui/core";
import { MdModeEdit } from "react-icons/md";
import { useHistory } from "react-router-dom";
import QuestionList from "./UpdatePaper/QuestionList";
import { BsFillEyeFill } from "react-icons/bs";
import DialogModalMetaData from "./UpdatePaper/DialogModalMetaData";
import { useSelector } from "react-redux";
import ConfirmDialog from "../../Modals/ConfirmDialog";
import RefreshIcon from "@material-ui/icons/Refresh";

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const [editQuestion, setEditQuestion] = useState(false);
  const { selected, id, data, is_theory } = props;
  const [dialogMetaData, setDialogMetaData] = useState(false);
  const numSelected = selected.length;
  const history = useHistory();
  const [singleIdMetaData, setSingleIdMetaData] = useState([]);
  const loginReducer = useSelector((state) => state.loginReducer);
  const [confirmDialogStatus, setConfirmDialogStatus] = useState(false);
  const { callUseEffect } = props;

  const openDialogMetaData = () => {
    data.map((item, i) => {
      if (item.id === id[0]) {
        setSingleIdMetaData(item);
      }
    });
    setDialogMetaData(true);
  };

  const handleClickOpen = () => {
    setEditQuestion(true);
  };

  const deletePapers = async () => {
    if (id) {
      id.map((item, i) => {
        axios({
          method: "DELETE",
          url: `/dashboard/de/metadata/${item}`,
        })
          .then((res) => {
            setConfirmDialogStatus(false);
            callUseEffect();
          })
          .catch((err) => console.log(err));
      });
    }
  };

  const onHideQuestionList = () => {
    console.log(id);
    if (id.length >= 0) {
      data.map((item, i) => {
        if (item.id === id[0]) {
          setSingleIdMetaData(item);
        }
      });
      setEditQuestion(false);
    }
  };

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {/* Edit Papers */}
      <QuestionList
        open={editQuestion}
        metadata={singleIdMetaData}
        id={id}
        is_theory={is_theory}
        onClose={onHideQuestionList}
      />

      {/* Modal Dialog MetaData */}
      <DialogModalMetaData
        callUseEffect={callUseEffect}
        data={singleIdMetaData}
        DialogStatus={dialogMetaData}
        id={id}
        handleClose={() => setDialogMetaData(false)}
      />

      {/* Confirm Modal Dialog Status */}
      <ConfirmDialog
        delete_mcq_by_id={deletePapers}
        ConfirmDialog={confirmDialogStatus}
        ConfirmDesc="Are you sure you want to delete this Paper?"
        handleClose={() => setConfirmDialogStatus(false)}
      />

      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          <div
            className={`spinner-border mr-3 ${props.progressBarStatus}`}
            role="status"
          ></div>
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={`${classes.title} align-items-center d-flex`}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          <div
            className={`spinner-border mr-3 ${props.progressBarStatus}`}
            role="status"
          ></div>
          Papers List
        </Typography>
      )}

      {numSelected > 0 ? (
        numSelected !== 1 ? (
          <IconButton
            aria-label="Delete Paper"
            onClick={() => setConfirmDialogStatus(true)}
          >
            <DeleteIcon />
          </IconButton>
        ) : (
          <div className="d-flex">
            <IconButton
              aria-label="Delete Paper"
              onClick={() => setConfirmDialogStatus(true)}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton aria-label="Edit Paper" onClick={openDialogMetaData}>
              <MdModeEdit />
            </IconButton>
            <IconButton aria-label="See Questions" onClick={handleClickOpen}>
              <BsFillEyeFill />
            </IconButton>
          </div>
        )
      ) : (
        <div className="d-flex justify-content-end w-50">
          <Tooltip title="Add Paper">
            <Button
              className="py-0"
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => history.push("/admin/panel/add/papers")}
            >
              Add Paper
            </Button>
          </Tooltip>
          <Tooltip title="Refresh Data">
            <IconButton
              aria-label="See Questions"
              onClick={() => callUseEffect()}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </Toolbar>
  );
};

export default EnhancedTableToolbar;
