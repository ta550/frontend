import React, { useEffect, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import { FcPlus } from "react-icons/fc";
import $ from "jquery";
import { MathpixLoader, MathpixMarkdown } from "mathpix-markdown-it";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
// Dialog Box
import Slide from "@material-ui/core/Slide";
import ModelNotification from "../../../Modals/ModelNotification";
import LinearProgressWithLabel from "../LinearProgressBarWithLabel";
import Backdrop from "@material-ui/core/Backdrop";
import { makeStyles } from "@material-ui/core/styles";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Fab } from "@material-ui/core";
import S3 from "react-aws-s3";
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

const useStyles2 = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const Transition2 = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

function EditQuestion(props) {
  const classes2 = useStyles2();
  const { open, metadata, onClose } = props;

  const handleCloseDialogBox = () => {
    onClose(false);
  };

  // Edit Questions Code
  // React State hooks
  const [question, setQuestion] = useState("");
  const [topic, setTopic] = useState("");
  const [options, setOptions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [openAlertDelete, setOpenAlertDelete] = React.useState(false);
  const [openAlertUpdate, setOpenAlertUpdate] = React.useState(false);
  const [ConfirmDialogStatus, setConfirmDialog] = React.useState(false);
  const [markdownFontSize, setMarkdownFontSize] = React.useState("14px");
  const [images, setImages] = React.useState([]);
  const [deleteImagesNames, setDeleteImagesNames] = React.useState([]);
  const [config, setConfig] = React.useState([]);
  // Dialog Hooks
  const [DialogStatus, setDialogStatus] = React.useState(false);
  const [DialogDesc, setDialogDesc] = React.useState("Are you Sure?");
  const [DialogTitle, setDialogTitle] = React.useState("Notification");
  const [DialogOk, setDialogOk] = React.useState("Ok");
  const [ProgressBarStatus, setProgressBarStatus] = useState(false);
  const classes = useStyles();
  const [progress, setProgress] = useState(10);
  // React Redux
  const loginReducer = useSelector((state) => state.loginReducer);
  const [getData, setGetData] = useState(true);

  const RefreshData = () => {
    if (getData === true) {
      setGetData(false);
    } else {
      setGetData(true);
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // question input changehandler
  const questionChange = (e) => {
    setQuestion(e.target.value);
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Change the background of selected options
  const SelectedOptionsBackgroundChange = (optionsbyindex) => {
    setTimeout(() => {
      for (var i = 0; i < optionsbyindex.length; i++) {
        if (optionsbyindex[i].correct === true) {
          $(`.mcq${i}`).addClass("mcq_selected");
        } else {
          $(`.mcq${i}`).removeClass("mcq_selected");
        }
      }
    }, 100);
  };

  React.useEffect(() => {
    // GET S3 CREDANTIONS
    fetch("/dashboard/de/question/s3credentials", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginReducer}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.message) {
          if (!metadata.subject) {
            onClose(false);
            props.getAllQuestions();
          } else {
            setConfig({
              bucketName: "exam105",
              region: res.region,
              dirName: metadata.subject,
              accessKeyId: res.accesskey,
              secretAccessKey: res.secretkey,
            });
            console.log(config);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });

    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 90 ? 10 : prevProgress + 7
      );
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Get Mcqs From API
  React.useEffect(() => {
    if (window.EditQuestionId !== undefined) {
      if (
        !config.bucketName ||
        !config.dirName ||
        !config.accessKeyId ||
        !config.secretAccessKey ||
        config === null
      ) {
        // GET S3 CREDANTIONS
        fetch("/dashboard/de/question/s3credentials", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loginReducer}`,
          },
        })
          .then((res) => res.json())
          .then((res) => {
            if (!res.message) {
              if (!metadata.subject) {
                onClose(false);
                props.getAllQuestions();
              } else {
                setConfig({
                  bucketName: "exam105",
                  region: res.region,
                  dirName: metadata.subject,
                  accessKeyId: res.accesskey,
                  secretAccessKey: res.secretkey,
                });
                console.log(config);
              }
            }
          })
          .catch((err) => {
            RefreshData();
            console.log(err);
          });
      }

      setProgressBarStatus(true);
      fetch(`/dashboard/de/question/${window.EditQuestionId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginReducer}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.message) {
            if (!metadata.subject) {
              onClose(false);
              props.getAllQuestions();
            }
            setQuestion(res.questions);
            setOptions(res.options);
            SelectedOptionsBackgroundChange(res.options);
            setDeleteImagesNames([]);
            setProgressBarStatus(false);
            $(".marks").val(res.marks);
            if (res.images === undefined) {
              setImages([]);
            } else {
              setImages(res.images);
            }
            if (res.topics === undefined) {
              setTopics([]);
            } else {
              setTopics(res.topics);
            }
          }
        })
        .catch((err) => {
          RefreshData();
          console.log(err);
        });
    }
  }, [window.EditQuestionId, getData]);
  // on option created
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const submit = (e) => {
    e.preventDefault();
    let opt = $(".static_option").val();
    const option = opt.trim();
    if (option.length > 0) {
      setOptions([...options, { correct: false, option: option }]);
      $(".static_option").val("");
    }
    SelectedOptionsBackgroundChange(options);
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // on option delete
  const deleteOption = (e) => {
    const newOptions = options.filter((_, index) => index !== e);
    setOptions(newOptions);
    var optionsbyindex = newOptions;
    SelectedOptionsBackgroundChange(optionsbyindex);
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // on option selected
  const onselect = (e) => {
    let items = [...options];
    let item = { ...items[e] };
    for (var i = 0; i < items.length; i++) {
      if (items[i].correct === true) {
        $(`.mcq${i}`).removeClass("mcq_selected");
        item.correct = true;
        let item2 = { ...items[i] };
        item2.correct = false;
        items[i] = item2;
      } else {
        $(`.mcq${e}`).addClass("mcq_selected");
        item.correct = true;
      }
    }
    if (item.correct === true) {
      $(`.mcq${e}`).addClass("mcq_selected");
      item.correct = true;
    }
    items[e] = item;
    setOptions(items);
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Add Topics
  const submitTopic = (e) => {
    e.preventDefault();
    setTopics([...topics, { topic: topic }]);
    setTopic("");
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Delete Topics
  const deleteTopic = (e) => {
    const deleteTopic = topics.filter((item, index) => e !== index);
    setTopics(deleteTopic);
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Questinon Output Toggle
  const question_output_hide_show = () => {
    $(".question_output").slideToggle();
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Close Alert
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlertDelete(false);
    setOpenAlertUpdate(false);
    setDialogStatus(false);
    setConfirmDialog(false);
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Update Question
  const update_questions_after_image_upload = (imageLocations, mark) => {
    if (window.EditQuestionId !== undefined) {
      const data = {
        id: window.EditQuestionId,
        questions: question,
        marks: mark,
        options: options,
        topics: topics,
        images: imageLocations,
      };

      if (!DialogStatus) {
        fetch(`/dashboard/de/question/${window.EditQuestionId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loginReducer}`,
          },
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .then((res) => {
            props.getAllQuestions();
            window.EditQuestionId = undefined;
            onClose(false);
            setProgressBarStatus(false);
          })
          .catch((err) => console.log(err));
      } else {
        onClose(false);
      }
    } else {
      onClose(false);
    }
  };

  const update_question = async () => {
    if (window.EditQuestionId !== undefined) {
      // Validation
      const mark = $(".marks").val();
      if (question === "" || mark === "" || options.length === 0) {
        if (question === "") {
          setDialogDesc("Question Field Are Required!");
        } else if (mark === "") {
          setDialogDesc("Marks Field Are Required!");
        } else {
          setDialogDesc("Options are Missing!");
        }

        setDialogStatus(true);
      } else {
        const items = [...options];
        let status = 0;
        for (var i = 0; i < items.length; i++) {
          if (items[i].correct === true) {
            status = 1;
          }
        }
        if (status === 1) {
          setProgressBarStatus(true);
          const ReactS3Client = new S3(config);
          console.log(config);
          for (var i = 0; i < deleteImagesNames.length; i++) {
            ReactS3Client.deleteFile(deleteImagesNames[i]);
          }

          var imageLocations = [];
          if (images.length !== 0) {
            images.map((image, i) => {
              if (!image.imageurl) {
                ReactS3Client.uploadFile(image, image.name)
                  .then((res) => {
                    const imageURL = { imageurl: res.location };
                    imageLocations.push(imageURL);
                    if (imageLocations.length === images.length) {
                      if (imageLocations.length === images.length) {
                        update_questions_after_image_upload(
                          imageLocations,
                          mark
                        );
                      }
                    }
                  })
                  .catch((err) => {
                    setDialogDesc(
                      `This "${image.name}" is not uploaded. Please Try Again`
                    );
                    setDialogStatus(false);
                    setProgressBarStatus(true);
                    console.log(err);
                  });
              } else {
                imageLocations.push(image);
                if (imageLocations.length === images.length) {
                  update_questions_after_image_upload(imageLocations, mark);
                }
              }
            });
          } else {
            update_questions_after_image_upload(imageLocations, mark);
          }
        } else {
          setDialogDesc("Chose The correct Option");
          setDialogStatus(true);
        }
      }
    }
  };

  const deleteImage = (data) => {
    for (var i = 0; i < images.length; i++) {
      if (images[i].imageurl) {
        if (images[i].imageurl === images[data].imageurl) {
          const parts = images[data].imageurl.split("/");
          const lastSegment = parts.pop() || parts.pop();
          setDeleteImagesNames([...deleteImagesNames, lastSegment]);
          setImages(images.filter((item, index) => index !== data));
        }
      } else {
        setImages(images.filter((item, index) => index !== data));
      }
    }
  };

  // On custom add images
  const handleAddImage = (e) => {
    e.preventDefault();
    let files = e.target.files;
    var newFiles = [];

    var oldImageNames = [];
    for (var i = 0; i < images.length; i++) {
      var lastSegment = "";
      if (images[i].imageurl) {
        var parts = images[i].imageurl.split("/");
        lastSegment = parts.pop() || parts.pop();
        oldImageNames.push(lastSegment);
      } else {
        oldImageNames.push(images[i].name);
      }
    }

    for (var i = 0; i < files.length; i++) {
      if (!oldImageNames.includes(files[i].name)) {
        newFiles.push(files[i]);
      }
    }

    setImages([...images, ...newFiles]);

    var filesInput = $(".upload_images_input_for_mcqs");
    filesInput.replaceWith(filesInput.val(""));
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleCloseDialogBox}
        TransitionComponent={Transition2}
      >
        <AppBar className={classes2.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes2.title}>
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
        <section
          className="pt-3"
          style={{
            background: "#F5F3F9",
            height: "auto",
            paddingBottom: "70px",
          }}
        >
          {/* Add MCQs Child  */}
          <div className="add_mcq_child container">
            <div className="row">
              {/* Mcqs Left Side */}
              <div
                className="col-lg-8 bg-white pb-3"
                style={{ borderRadius: "20px", boxShadow: "0px 0px 2px black" }}
              >
                <br />
                <form
                  onSubmit={submit}
                  className="container-fluid"
                  autoComplete="off"
                  style={{ minHeight: "60vh" }}
                >
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
                    style={{ fontSize: markdownFontSize }}
                  >
                    <MathpixLoader>
                      <MathpixMarkdown text={question} />
                    </MathpixLoader>
                  </div>
                  <div className="form-group m-0">
                    <input
                      type="text"
                      name="option_input"
                      placeholder="Enter Option"
                      style={{ width: "90%" }}
                      className="d-inline static_option form-control"
                      required
                    />{" "}
                    <button
                      type="submit"
                      className="p-1 mt-1"
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
                  {options.map((item, i) => {
                    return (
                      <div key={i} className={`mcqDisplay mcq${i}`}>
                        <p
                          style={{
                            width: "80%",
                            fontSize: "15px",
                            wordWrap: "break-word",
                          }}
                          className="option_text py-auto mb-2"
                        >
                          {item.option}
                        </p>
                        <div className="mcqDisplay__button">
                          <svg
                            onClick={() => onselect(i)}
                            className="MuiSvgIcon-root mcqDisplay__correct"
                            style={{ cursor: "pointer" }}
                            focusable="false"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
                          </svg>
                          <svg
                            onClick={() => deleteOption(i)}
                            style={{ cursor: "pointer" }}
                            className="MuiSvgIcon-root mcqDisplay__delete"
                            focusable="false"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
                          </svg>
                        </div>
                      </div>
                    );
                  })}
                </form>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-12 mx-auto mt-4">
                      <div className="all_mcq_operations_button d-flex mx-auto justify-content-center w-100 ">
                        <div>
                          <button
                            type="button"
                            onClick={update_question}
                            className="border mt-2 update_mcq_button btn mybutton btn-info"
                          >
                            update
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Mcqs Right Side */}
              <div className="col-lg-4">
                <form
                  onSubmit={submitTopic}
                  className="bg-white py-4 px-3"
                  style={{
                    borderRadius: "20px",
                    boxShadow: "0px 0px 2px black",
                  }}
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
                          <div
                            key={i}
                            className={`topicDisplay`}
                            style={{ fontSize: "12px", fontWeight: "500" }}
                          >
                            <p className="option_text my-1">{item.topic}</p>
                            <span
                              className="delete_topic"
                              style={{ fontSize: "16px" }}
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
                <div
                  className="mt-4 bg-white py-4 px-3"
                  style={{
                    borderRadius: "20px",
                    boxShadow: "0px 0px 2px black",
                  }}
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
                          <div
                            key={i}
                            className="position-relative d-flex align-items-center w-50"
                          >
                            <img
                              alt="Image Error"
                              style={{ height: "80px", width: "100%" }}
                              className="img-fluid p-2"
                              src={item.imageurl}
                            />
                            <DeleteIcon
                              onClick={() => deleteImage(i)}
                              className="bg-dark text-white rounded cursor-pointer"
                              style={{
                                position: "absolute",
                                top: "0",
                                right: "0",
                              }}
                            />
                          </div>
                        );
                      }
                      var url = URL.createObjectURL(item);
                      return (
                        <div
                          key={i}
                          className="position-relative d-flex align-items-center w-50"
                        >
                          <img
                            alt="Image Error"
                            style={{ height: "80px", width: "100%" }}
                            className="img-fluid p-2"
                            src={url}
                          />
                          <DeleteIcon
                            onClick={() => deleteImage(i)}
                            className="bg-dark text-white rounded cursor-pointer"
                            style={{
                              position: "absolute",
                              top: "0",
                              right: "0",
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <Fab
              color="primary"
              style={{ position: "fixed", bottom: "30px", right: "50px" }}
              aria-label="add"
              onClick={RefreshData}
            >
              <RefreshIcon />
            </Fab>
          </div>
          <br />
          {/* Alerts */}
          <Snackbar
            open={openAlertDelete}
            autoHideDuration={5000}
            onClose={handleClose}
          >
            <Alert onClose={handleClose} severity="success">
              Deleted Successfull
            </Alert>
          </Snackbar>
          <Snackbar
            open={openAlertUpdate}
            autoHideDuration={5000}
            onClose={handleClose}
          >
            <Alert onClose={handleClose} severity="success">
              Updated Successfull
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
          {/* Progress Bar */}
          <Backdrop className={classes2.backdrop} open={ProgressBarStatus}>
            <LinearProgressWithLabel value={progress} />
          </Backdrop>
        </section>
      </Dialog>
    </div>
  );
}

export default EditQuestion;
