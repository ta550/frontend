import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { useSelector } from 'react-redux'
import { MathpixLoader, MathpixMarkdown } from "mathpix-markdown-it";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SeeQuestion(props) {
  const { handleClose, open } = props;
  const [data, setData] = React.useState([]);
  const loginReducer = useSelector(state => state.loginReducer);
  const [question, setQuestion] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const [topics, setTopics] = React.useState([])

  React.useEffect(() => {
    if (window.SeeQuestionId !== undefined) {
      fetch(`/dashboard/de/question/${window.SeeQuestionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginReducer}`
        }
      })
        .then(res => res.json())
        .then(res => {
          setQuestion(res.questions)
          setOptions(res.options)
          console.log(res.topics)
          if (res.topics) {
            setTopics(res.topics)
          } else {
            setTopics([])
          }
          console.log(res)
          window.SeeQuestionId = undefined
        })
        .catch(err => console.log(err))
    } else {
      handleClose();
    }
    console.log('windowid is :' + window.SeeQuestionId)
  }, [window.SeeQuestionId])

  return (
    <div>
      <Dialog
        open={open}
        fullWidth={true}
        maxWidth="md"
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >

        <DialogContent>
          <DialogTitle id="alert-dialog-slide-title">
            <MathpixLoader>
              <MathpixMarkdown text={question} />
            </MathpixLoader>
          </DialogTitle>
          <hr />
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6">
                <h3 className="py-3">Options</h3>
                <div>
                  {options.map((item, i) => (
                    <div className="pt-3 d-flex" style={{ borderBottom: "1px solid rgba(0,0,0,0.3)" }}>
                      {(item.correct === true) ? <CheckCircleIcon /> : <CancelIcon />}
                      <p> &nbsp;{item.option}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                {(topics !== "")}
                <h3 className="py-3">Topics</h3>
                <div>
                  {topics.map((item, i) => (
                    <>
                      <p>{item.topic}</p>
                      <hr />
                    </>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
