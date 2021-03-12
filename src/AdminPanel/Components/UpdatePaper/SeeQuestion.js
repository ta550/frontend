import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { useSelector } from "react-redux";
import { MathpixLoader, MathpixMarkdown } from "mathpix-markdown-it";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import S3 from "react-aws-s3";
import DeleteIcon from "@material-ui/icons/Delete";
import ImagesCarouselModal from "../../../Modals/ImagesCarouselModal";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SeeQuestion(props) {
  const { handleClose, open } = props;
  const [data, setData] = React.useState([]);
  const loginReducer = useSelector((state) => state.loginReducer);
  const [question, setQuestion] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const [topics, setTopics] = React.useState([]);
  const [images, setImages] = React.useState([]);
  const [marks, setMarks] = React.useState("");
  const [imageViewStatus, setImageViewStatus] = React.useState(false);

  const ImageViewClose = () => {
    setImageViewStatus(false);
  };

  React.useEffect(() => {
    if (window.SeeQuestionId !== undefined) {
      setOptions([]);
      setTopics([]);
      setQuestion("");
      setImages([]);
      fetch(`/dashboard/de/question/${window.SeeQuestionId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginReducer}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setQuestion(res.questions);
          setOptions(res.options);
          setMarks(res.marks);
          if (res.images) {
            setImages(res.images);
          } else {
            setImages([]);
          }
          if (res.topics) {
            setTopics(res.topics);
          } else {
            setTopics([]);
          }
          console.log(res);
          window.SeeQuestionId = undefined;
        })
        .catch((err) => console.log(err));
    } else {
      handleClose();
    }
  }, [window.SeeQuestionId]);

  return (
    <div>
      <Dialog
        open={open}
        fullWidth={true}
        maxWidth="md"
        TransitionComponent={Transition}
        keepMounted
        onClose={() => {
          setOptions([]);
          setTopics([]);
          setQuestion("");
          setImages([]);
          handleClose();
        }}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        {question === "" ? (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: "50vh" }}
          >
            <div class="spinner-border" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <DialogContent>
            <h5 className="py-3 simple-header-font font-italic font-weight-bold shadow text-center">
              Marks = {marks}
            </h5>
            <div style={{ fontSize: "15px" }}>
              <MathpixLoader>
                <MathpixMarkdown text={question} />
              </MathpixLoader>
            </div>
            <hr />
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-6">
                  <h5 className="py-3 simple-header-font font-italic font-weight-bold shadow text-center">
                    Options
                  </h5>
                  <div>
                    {options.map((item, i) => (
                      <div
                        className="pt-3 d-flex"
                        style={{ borderBottom: "1px solid rgba(0,0,0,0.3)" }}
                      >
                        {item.correct === true ? (
                          <CheckCircleIcon className="text-success" />
                        ) : (
                          <CancelIcon className="text-danger" />
                        )}
                        <p> &nbsp;{item.option}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-md-6">
                  <h5 className="py-3 simple-header-font font-italic font-weight-bold shadow text-center">
                    Topics
                  </h5>
                  <div>
                    {topics.length === 0 ? (
                      <h5 className="text-center">
                        This question does not have any topic
                      </h5>
                    ) : (
                      topics.map((item, i) => (
                        <div
                          className="pt-3 d-flex"
                          style={{ borderBottom: "1px solid rgba(0,0,0,0.3)" }}
                        >
                          <p> &nbsp;{item.topic}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <br />
              <div className="row">
                <h5 className="col-12 simple-header-font font-italic font-weight-bold shadow text-center py-3">
                  Related Images ({images.length})
                </h5>
                {images.length === 0 ? (
                  <div className="col-12">
                    <h5 className="text-center">
                      This question does not have any image
                    </h5>
                  </div>
                ) : (
                  images.map((item, i) => {
                    if (item.imageurl) {
                      return (
                        <div
                          className="position-relative p-2 d-flex align-items-center col-2"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            window.activeImageinImageCarousel = i;
                            setImageViewStatus(true);
                          }}
                        >
                          <img
                            alt="Image Error"
                            style={{ height: "120px", width: "100%" }}
                            className="img-fluid px-1"
                            src={item.imageurl}
                          />
                        </div>
                      );
                    }
                  })
                )}
                {/* Images View Carousel Dialog */}
                {images.lenght === 0 ? (
                  <div></div>
                ) : (
                  <ImagesCarouselModal
                    open={imageViewStatus}
                    handleClose={ImageViewClose}
                    data={images}
                  />
                )}
              </div>
            </div>
          </DialogContent>
        )}

        <DialogActions>
          <Button
            onClick={() => {
              setOptions([]);
              setTopics([]);
              setQuestion("");
              setImages([]);
              handleClose();
            }}
            color="primary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
