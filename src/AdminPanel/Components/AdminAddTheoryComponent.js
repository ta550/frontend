import React, { useEffect, useState } from "react";
import "../css/AdminAddmcqs.css";
import { FcPlus } from "react-icons/fc";
import $ from "jquery";
import { MathpixLoader, MathpixMarkdown } from "mathpix-markdown-it";
import {
  add_theory,
  remove_theory,
  reset_board,
  reset_theory,
  update_theory,
  add_board,
} from "../../action/index";
import { connect, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import S3 from "react-aws-s3";
import axios from "axios";
// Dialog Box
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import ConfirmDialog from "../../Modals/ConfirmDialog";
import ModelNotification from "../../Modals/ModelNotification";
import LinearProgressWithLabel from "./LinearProgressBarWithLabel";
import Backdrop from "@material-ui/core/Backdrop";
import { makeStyles } from "@material-ui/core/styles";
import { ProgressBar } from "react-bootstrap";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function AdminAddTheoryComponent(props) {
  const classes = useStyles();
  // React State hooks
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [topic, setTopic] = useState("");
  const [topics, setTopics] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [AlertValue, setAlertValue] = useState(false);
  const [ConfirmFinishPaper, setConfirmFinishPaper] = React.useState(false);
  const [ConfirmDialogStatus, setConfirmDialogStatus] = React.useState(false);
  const [markdownFontSize, setMarkdownFontSize] = React.useState("14px");
  const [deleteImagesNames, setDeleteImagesNames] = React.useState([]);
  const [images, setImages] = React.useState([]);
  const [config, setConfig] = React.useState();
  // Dialog Hooks
  const [DialogStatus, setDialogStatus] = useState(false);
  const [DialogDesc, setDialogDesc] = useState("Are you Sure?");
  const [DialogTitle, setDialogTitle] = useState("Notification");
  const [DialogOk, setDialogOk] = useState("Ok");
  const [progress, setProgress] = useState(10);
  const [ProgressBarStatus, setProgressBarStatus] = useState(false);
  // React Redux
  const theoryReducer = useSelector((state) => state.theoryReducer);
  const boardReducer = useSelector((state) => state.boardReducer);
  const history = useHistory();

  useEffect(() => {
    // GET S3 CREDENTIALS
    axios({
      method: "GET",
      url: "/dashboard/de/question/s3credentials",
    })
      .then((res) => {
        if (!res.data.message) {
          setConfig({
            bucketName: "exam105",
            dirName: boardReducer[0].subject,
            region: res.data.region,
            accessKeyId: res.data.accesskey,
            secretAccessKey: res.data.secretkey,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });

    if (boardReducer.length === 0) {
      history.push("/admin/panel/add/papers/");
    }
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 90 ? 10 : prevProgress + 7
      );
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);
  // Math compiler
  // question input changehandler
  const questionChange = (e) => {
    setQuestion(e.target.value);
  };
  // SetTime Out Functions
  const mcqButtonChangeBorder = (e) => {
    setTimeout(() => {
      for (var i = 0; i < theoryReducer.length; i++) {
        if (i === e) {
          $(`.question${e}`).css({ border: "3px solid black" });
        } else {
          $(`.question${i}`).css({ border: "3px solid white" });
        }
      }
    }, 100);
  };
  // on theory question added
  const add_theory_question = () => {
    const mark = $(".marks").val();
    if (question === "" || mark === "" || answer === "") {
      if (question === "") {
        setDialogDesc("Question field is required!");
      } else if (mark === "") {
        setDialogDesc("Marks field is required!");
      } else {
        setDialogDesc("Answer field is required!");
      }
      setDialogStatus(true);
    } else {
      setProgressBarStatus(true);
      const ReactS3Client = new S3(config);
      let imageLocations = [];
      if (images.length !== 0) {
        images.map((image, i) => {
          ReactS3Client.uploadFile(image, image.name)
            .then((res) => {
              const imageURL = { imageurl: res.location };
              imageLocations.push(imageURL);
              if (imageLocations.length === images.length) {
                add_theory_question_after_image_upload(imageLocations, mark);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        });
      } else {
        add_theory_question_after_image_upload(imageLocations, mark);
      }
    }
  };
  const add_theory_question_after_image_upload = (imageLocations, mark) => {
    const data = {
      question: question,
      answer: answer,
      marks: mark,
      topics: topics,
      images: imageLocations,
    };
    props.changeState(data);
    setQuestion("");
    setAnswer("");
    setTopics([]);
    setImages([]);
    setProgressBarStatus(false);
    var filesInput = $(".upload_images_input_for_mcqs");
    filesInput.replaceWith(filesInput.val(""));
  };
  // Get Old theory question for Update
  const getOldTheoryQuestion = (e) => {
    if (question !== "" && window.value === undefined) {
      setDialogDesc(
        "If you navigate to old question then this question will be lost. Please first save or reset this question."
      );
      setDialogStatus(true);
    } else {
      window.value = e;
      setDeleteImagesNames([]);
      mcqButtonChangeBorder(e);
      setTopics([]);
      setQuestion(theoryReducer[e].question);
      setAnswer(theoryReducer[e].answer);
      $(".marks").val(theoryReducer[e].marks);
      setTopics(theoryReducer[e].topics);
      const imageurls = theoryReducer[e].images;
      setImages(imageurls);
      // // Hide and show buttons
      $(".next_theory_button").css("display", "none");
      $(".update_theory_button").css("display", "inline");
      $(".delete_theory_button").css("display", "inline");
    }
  };
  // Update theory question By its Id
  const update_theory_question_by_id = () => {
    if (window.value != null) {
      const mark = $(".marks").val();
      if (question === "" || mark === "" || answer === "") {
        if (question === "") {
          setDialogDesc("Question field is required!");
        } else if (mark === "") {
          setDialogDesc("Marks field is required!");
        } else {
          setDialogDesc("Answer field is required!");
        }
        setDialogStatus(true);
      } else {
        setProgressBarStatus(true);
        const ReactS3Client = new S3(config);
        for (let i = 0; i < deleteImagesNames.length; i++) {
          ReactS3Client.deleteFile(deleteImagesNames[i]);
        }
        console.log(config);
        let imageLocations = [];
        if (images.length !== 0) {
          images.map((image, i) => {
            if (!image.imageurl) {
              ReactS3Client.uploadFile(image, image.name)
                .then((res) => {
                  const imageURL = { imageurl: res.location };
                  imageLocations.push(imageURL);
                  if (imageLocations.length === images.length) {
                    if (imageLocations.length === images.length) {
                      update_theory_question_after_image_upload(
                        imageLocations,
                        mark
                      );
                    }
                  }
                })
                .catch((err) => {
                  setDialogDesc(
                    `This "${image.name}" is not uploaded. Please try again.`
                  );
                  setDialogStatus(false);
                  setProgressBarStatus(true);
                  console.log(err);
                });
            } else {
              imageLocations.push(image);
              if (imageLocations.length === images.length) {
                update_theory_question_after_image_upload(imageLocations, mark);
              }
            }
          });
        } else {
          update_theory_question_after_image_upload(imageLocations, mark);
        }
      }
    } else {
      setDialogDesc("Select the question for delete!");
      setDialogStatus(true);
    }
  };
  const update_theory_question_after_image_upload = (imageLocations, mark) => {
    const data = {
      question: question,
      answer: answer,
      marks: mark,
      topics: topics,
      index: window.value,
      images: imageLocations,
    };
    props.updateState(data);
    setQuestion("");
    setAnswer("");
    setTopics([]);
    mcqButtonChangeBorder(-1);
    setImages([]);
    window.value = undefined;
    $(".next_theory_button").css("display", "inline");
    $(".update_theory_button").css("display", "none");
    $(".delete_theory_button").css("display", "none");
    setProgressBarStatus(false);
    setAlertValue("Updated Successfully");
    setOpenAlert(true);
  };
  // // Delete Theory Question By its Id
  const delete_theory_question = () => {
    setConfirmDialogStatus(false);
    if (window.value != null) {
      const index = window.value;
      props.deleteState(index);
      setQuestion("");
      setAnswer("");
      setTopics([]);
      mcqButtonChangeBorder(-1);
      setImages([]);
      setAlertValue("Deleted Successfully");
      setOpenAlert(true);
      $(".next_mcq_button").css("display", "inline");
      $(".update_mcq_button").css("display", "none");
      $(".delete_mcq_button").css("display", "none");
    } else {
      setDialogDesc("Please select question that you want to delete.");
      setDialogStatus(true);
    }
  };
  // Add Topics
  const submitTopic = (e) => {
    e.preventDefault();
    setTopics([...topics, { topic: topic }]);
    setTopic("");
  };
  // Delete Topics
  const deleteTopic = (e) => {
    const deleteTopic = topics.filter((item, index) => e !== index);
    setTopics(deleteTopic);
  };
  // Question Output Toggle
  const question_output_hide_show = () => {
    $(".question_output").slideToggle();
  };
  const answer_output_hide_show = () => {
    $(".answer_output").slideToggle();
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
    setDialogStatus(false);
    setConfirmDialogStatus(false);
  };
  // Finish Exam
  const finish_paper = () => {
    setConfirmFinishPaper(false);
    const data1 = new Array(boardReducer[0]);
    const theory = {
      is_theory: true,
    };
    data1.map((item, i) => {
      if (item.is_theory === false) {
        item.is_theory = true;
      }
    });
    props.add_board(data1, theory);
    const data = new Array(boardReducer[0]);
    theoryReducer.map((item, i) => {
      data.push(item);
    });
    if (data[1]) {
      setProgressBarStatus(true);
      axios({
        method: "POST",
        url: "/dashboard/de/questions/theory",
        data: data,
      })
        .then((res) => {
          props.resetState();
          props.resetBoard();
          console.log("add thoery component got fired.");
          setProgressBarStatus(false);
          history.push("/admin/panel/papers");
        })
        .catch((err) => {
          console.log(err);
          setProgressBarStatus(false);
          setDialogDesc("Something went wrong. Please try Again.");
          setDialogStatus(true);
        });
    } else {
      setDialogDesc("Please add at lease one question to save this paper.");
      setDialogStatus(true);
    }
  };
  // On custom add images
  const handleAddImage = (e) => {
    e.preventDefault();
    let files = e.target.files;
    var newFiles = [];

    var oldImageNames = [];
    for (let i = 0; i < images.length; i++) {
      var lastSegment = "";
      if (images[i].imageurl) {
        var parts = images[i].imageurl.split("/");
        lastSegment = parts.pop() || parts.pop();
        oldImageNames.push(lastSegment);
      } else {
        oldImageNames.push(images[i].name);
      }
    }

    for (let i = 0; i < files.length; i++) {
      if (!oldImageNames.includes(files[i].name)) {
        newFiles.push(files[i]);
      }
    }

    setImages([...images, ...newFiles]);

    var filesInput = $(".upload_images_input_for_mcqs");
    filesInput.replaceWith(filesInput.val(""));
  };

  const deleteImage = (data) => {
    for (let i = 0; i < images.length; i++) {
      if (images[i].imageurl) {
        if (images[i].imageurl === images[data].imageurl) {
          const parts = images[data].imageurl.split("/");
          const lastSegment = parts.pop() || parts.pop();
          setDeleteImagesNames([...deleteImagesNames, lastSegment]);
          setImages(images.filter((item, index) => index !== data));
          console.log(deleteImagesNames);
        }
      } else {
        setImages(images.filter((item, index) => index !== data));
      }
    }
  };
  return (
    <section className="add_mcq_main pt-3">
      {/* Add Theory question child  */}
      <div className="add_mcq_child container-fluid">
        <div className="row">
          <div className="col-lg-2 mb-5 mcqs_list_main ">
            <div
              className="bg-white py-3 container-fluid"
              style={{ borderRadius: "20px", boxShadow: "0px 0px 2px black" }}
            >
              {theoryReducer.map((item, i) => (
                <button
                  key={i}
                  style={{ width: "40px" }}
                  className={`col-3 text-center bg-success text-white question${i}`}
                  onClick={() => getOldTheoryQuestion(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
          {/* Theory question Left Side */}
          <div
            className="col-lg-7 bg-white pb-3"
            style={{ borderRadius: "20px", boxShadow: "0px 0px 2px black" }}
          >
            {/* Responsive Meta Data */}
            <div className="table-responsive mx-auto">
              <table className="table p-0 m-0">
                <tbody>
                  {boardReducer.map((item, i) => (
                    <tr className="text-center">
                      <td style={{ whiteSpace: "nowrap" }}>{item.system}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{item.board}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{item.subject}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{item.year}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{item.month}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{item.series}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{item.paper}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="container-fluid" style={{ minHeight: "60vh" }}>
              <div className="form-group">
                <textarea
                  className="form-control"
                  placeholder="Enter Question"
                  rows="5"
                  value={question}
                  onChange={questionChange}
                  required
                ></textarea>
              </div>
              <div className="row">
                <select
                  value={markdownFontSize}
                  onChange={(e) => setMarkdownFontSize(e.target.value)}
                  className="small ml-3"
                  style={{ height: "25px" }}
                >
                  <option value="12px">12px</option>
                  <option value="13px">13px</option>
                  <option value="14px">14px</option>
                  <option value="15px">15px</option>
                  <option value="16px">16px</option>
                </select>
                <button
                  type="button"
                  onClick={question_output_hide_show}
                  className="btn mr-3 btn-sm btn-info mybutton mb-2 d-flex ml-auto"
                >
                  Hide / Show
                </button>
              </div>
              <div
                className="p-2 form-group question_output col-12"
                style={{ fontSize: markdownFontSize, borderRadius: "5px" }}
              >
                <MathpixLoader>
                  <MathpixMarkdown text={question} />
                </MathpixLoader>
              </div>
              <textarea
                className="form-control"
                placeholder="Enter Answer"
                rows="5"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
              ></textarea>
              <div className="row mt-3">
                <select
                  value={markdownFontSize}
                  onChange={(e) => setMarkdownFontSize(e.target.value)}
                  className="small ml-3"
                  style={{ height: "25px" }}
                >
                  <option value="12px">12px</option>
                  <option value="13px">13px</option>
                  <option value="14px">14px</option>
                  <option value="15px">15px</option>
                  <option value="16px">16px</option>
                </select>
                <button
                  type="button"
                  onClick={answer_output_hide_show}
                  className="btn mr-3 btn-sm btn-info mybutton mb-2 d-flex ml-auto"
                >
                  Hide / Show
                </button>
              </div>
              <div
                className="p-2 form-group answer_output col-12"
                style={{ fontSize: markdownFontSize, borderRadius: "5px" }}
              >
                <MathpixLoader>
                  <MathpixMarkdown text={answer} />
                </MathpixLoader>
              </div>
            </div>
            <div className="container-fluid">
              <div className="row">
                <div className="col-12 mx-auto mt-4">
                  <div className="all_mcq_operations_button d-flex mx-auto justify-content-between w-100 ">
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmFinishPaper(true);
                        }}
                        className="bg-success mx-2 mt-2 btn mybutton"
                      >
                        Finish
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setQuestion("");
                          setAnswer("");
                          setTopics([]);
                          setImages([]);
                          setDeleteImagesNames([]);
                          $(".marks").val("");
                          window.value = undefined;
                          mcqButtonChangeBorder(-1);
                          $(".next_mcq_button").css("display", "inline");
                          $(".update_mcq_button").css("display", "none");
                          $(".delete_mcq_button").css("display", "none");
                        }}
                        className="bg-success mx-2 mt-2 btn mybutton"
                      >
                        Reset
                      </button>
                    </div>
                    <div>
                      <button
                        type="button"
                        style={{ display: "none" }}
                        onClick={() => setConfirmDialogStatus(true)}
                        className="mr-2 bg-info border mt-2 mybutton delete_theory_button btn"
                      >
                        delete
                      </button>
                      <button
                        type="button"
                        style={{ display: "none" }}
                        onClick={update_theory_question_by_id}
                        className="border bg-info mt-2 mybutton update_theory_button btn mybutton"
                      >
                        update
                      </button>
                      <Button
                        variant="contained"
                        onClick={add_theory_question}
                        className="mybutton bg-info next_theory_button"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Theory Question Right Side */}
          <div className="col-lg-3">
            <form
              onSubmit={submitTopic}
              className="bg-white py-4 px-3"
              style={{ borderRadius: "20px", boxShadow: "0px 0px 2px black" }}
            >
              <div className="form-group mb-4">
                <input
                  type="number"
                  className="form-control marks w-50 float-left"
                  placeholder="Enter Marks"
                  max="100"
                  min="1"
                />
                <br />
              </div>
              <div className="topics_main mt-3 container-fluid">
                <div className="row">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="form-control col-10"
                    placeholder="Enter Topic"
                    required
                  />
                  <button
                    type="submit"
                    className="col-md-2"
                    style={{
                      width: "5%",
                      background: "none",
                      border: "none",
                      outline: "none",
                    }}
                  >
                    <FcPlus className="another_option h2" />
                  </button>
                </div>
                <div className="row">
                  {topics.map((item, i) => {
                    return (
                      <div key={i} className={`topicDisplay pb-1 h5 `}>
                        <p className="option_text my-1">{item.topic}</p>
                        <span
                          className="delete_topic"
                          onClick={() => deleteTopic(i)}
                        >
                          &times;
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </form>
            <br />
            <form
              className="bg-white py-4 px-3"
              style={{ borderRadius: "20px", boxShadow: "0px 0px 2px black" }}
            >
              <input
                accept="image/*"
                className={`upload_images_input_for_mcqs small`}
                id="raised-button-file"
                onChange={handleAddImage}
                multiple
                type="file"
              />
              <div className="row">
                {images.map((item, i) => {
                  if (item.imageurl) {
                    return (
                      <div className="position-relative d-flex align-items-center w-50">
                        <img
                          alt="Image Error"
                          style={{ height: "80px", width: "100%" }}
                          className="img-fluid p-2"
                          src={item.imageurl}
                        />
                        <DeleteIcon
                          onClick={() => deleteImage(i)}
                          className="bg-dark text-white rounded cursor-pointer"
                          style={{ position: "absolute", top: "0", right: "0" }}
                        />
                      </div>
                    );
                  }
                  var url = URL.createObjectURL(item);
                  return (
                    <div className="position-relative d-flex align-items-center w-50">
                      <img
                        alt="Image Error"
                        style={{ height: "80px", width: "100%" }}
                        className="img-fluid p-2"
                        src={url}
                      />
                      <DeleteIcon
                        onClick={() => deleteImage(i)}
                        className="bg-dark text-white rounded cursor-pointer"
                        style={{ position: "absolute", top: "0", right: "0" }}
                      />
                    </div>
                  );
                })}
              </div>
            </form>
          </div>
        </div>
      </div>
      <br />
      {/* Alerts */}
      <Snackbar open={openAlert} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          {AlertValue}
        </Alert>
      </Snackbar>
      {/* Dialog Box */}
      <ModelNotification
        DialogStatus={DialogStatus}
        DialogTitle={DialogTitle}
        DialogDesc={DialogDesc}
        handleClose={handleClose}
        DialogOk={DialogOk}
      />
      {/*   Confirm Dialog Box   */}
      <ConfirmDialog
        delete_mcq_by_id={delete_theory_question}
        ConfirmDialog={ConfirmDialogStatus}
        ConfirmDesc="Are you sure you want to delete this field?"
        handleClose={handleClose}
      />
      {/*   Confirm Dialog Box   */}
      <ConfirmDialog
        delete_mcq_by_id={finish_paper}
        ConfirmDialog={ConfirmFinishPaper}
        ConfirmDesc="Are you sure you want to Finish Paper?"
        handleClose={() => {
          setConfirmFinishPaper(false);
        }}
      />

      {/* Progress Bar */}
      <Backdrop className={classes.backdrop} open={ProgressBarStatus}>
        <LinearProgressWithLabel value={progress} />;
      </Backdrop>
    </section>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeState: (data) => {
      dispatch(add_theory(data));
    },
    updateState: (data) => {
      dispatch(update_theory(data));
    },
    deleteState: (index) => {
      dispatch({ type: "remove_theory", index: index });
    },
    resetState: () => {
      dispatch(reset_theory());
    },
    resetBoard: () => {
      dispatch(reset_board());
    },
    add_board: (data1, theory) => {
      dispatch(add_board(data1, theory));
    },
  };
};

export default connect(null, mapDispatchToProps)(AdminAddTheoryComponent);
