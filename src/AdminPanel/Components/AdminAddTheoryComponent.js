import React, { useEffect, useState } from 'react'
import '../css/AdminAddmcqs.css'
import { FcPlus } from 'react-icons/fc'
import $ from 'jquery'
import { MathpixLoader, MathpixMarkdown } from "mathpix-markdown-it";
import { add_theory, remove_theory, update_theory } from '../../action/index'
import { connect, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
// Dialog Box
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import ModelNotification from './ModelNotification'
import LinearProgressWithLabel from './LinearProgressBarWithLabel'
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';
import { ProgressBar } from 'react-bootstrap';


const useStyles = makeStyles((theme) => ({
   backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
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
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    const [topic, setTopic] = useState("");
    const [topics, setTopics] = useState([])
    const [openAlert, setOpenAlert] = useState(false);
    const [AlertValue, setAlertValue] = useState(false);
    const [ConfirmDialog, setConfirmDialog] = useState(false);
    const [ProgressBarStatus , setProgressBarStatus] = useState(false)
    const [markdownFontSize, setMarkdownFontSize] = React.useState("14px");
    // Dialog Hooks
    const [DialogStatus, setDialogStatus] = useState(false);
    const [DialogDesc, setDialogDesc] = useState("Are you Sure?");
    const [DialogTitle, setDialogTitle] = useState("Notification");
    const [DialogOk, setDialogOk] = useState("Ok");
    const [progress, setProgress] = useState(10);
    // React Redux
    const theoryReducer = useSelector(state => state.theoryReducer)
    const boardReducer = useSelector(state => state.boardReducer)
    const history = useHistory();

    useEffect(() => {
        if (boardReducer.length === 0) {
            history.push("/admin/panel/add/papers/")
        }
        $('.answer_output').slideUp();
        $('.question_output').slideUp();
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 90 ? 10 : prevProgress + 7));
        }, 800);
        return () => {
            clearInterval(timer);
        };
    }, [])
    // Math compiler
    // question input changehandler
    const questionChange = (e) => {
        setQuestion(e.target.value);
    }
    // SetTime Out Functions
    const mcqButtonChangeBorder = (e) => {
        setTimeout(() => {
            for (var i = 0; i < theoryReducer.length; i++) {
                if (i === e) {
                    $(`.question${e}`).css({ border: '3px solid black' })
                } else {
                    $(`.question${i}`).css({ border: '3px solid white' })
                }
            }
        }, 100)
    }
    // on mcq added
    const add_theory_question = () => {
        const mark = $('.marks').val();
        if (question === "" || mark === "" || answer === "") {
            setDialogDesc("All Fields Are Required?")
            setDialogStatus(true)
        } else {
            const data = {
                question: question,
                answer: answer,
                marks: mark,
                topics: topics
            }
            props.changeState(data)
            setQuestion("")
            setAnswer("")
            setTopics([])
        }
    }
    // Get Old Mcq for Update
    const getOldTheroyQuestion = (e) => {
        window.value = e;
        mcqButtonChangeBorder(e)
        setTopics([])
        setQuestion(theoryReducer[e].question)
        setAnswer(theoryReducer[e].answer)
        $('.marks').val(theoryReducer[e].marks);
        setTopics(theoryReducer[e].topics)
        // // Hide and show buttons
        $('.next_theory_button').css("display", "none")
        $('.update_theory_button').css("display", "inline");
        $('.delete_theory_button').css("display", "inline");
    }
    // // Update Mcq By its Id
    const update_theory_question_by_id = () => {
        if (window.value != null) {
            const mark = $('.marks').val();
            if (question === "" || mark === "" || answer === "") {
                setDialogDesc("All Fields Are Required?")
                setDialogStatus(true)
            } else {
                const mark = $('.marks').val();
                const data = {
                    question: question,
                    answer: answer,
                    marks: mark,
                    topics: topics,
                    index: window.value
                }
                props.updateState(data)
                setQuestion("")
                setAnswer("")
                setTopics([])
                mcqButtonChangeBorder(-1)
                $('.next_theory_button').css("display", "inline")
                $('.update_theory_button').css("display", "none");
                $('.delete_theory_button').css("display", "none");
                setAlertValue("Updated Successfull")
                setOpenAlert(true)
            }
        } else {
            setDialogDesc("Select MCQ For Delete?")
            setDialogStatus(true)
        }
    }
    // // Delete Mcq By its Id
    const delete_theory_question = () => {
        setConfirmDialog(false)
        if (window.value != null) {
            const index = window.value;
            props.deleteState(index)
            setQuestion("")
            setAnswer("")
            setTopics([])
            mcqButtonChangeBorder(-1)
            setAlertValue("Deleted Successfull")
            setOpenAlert(true)
            $('.next_mcq_button').css("display", "inline")
            $('.update_mcq_button').css("display", "none");
            $('.delete_mcq_button').css("display", "none");
        } else {
            setDialogDesc("Please Select MCQ for Delete")
            setDialogStatus(true)
        }
    }
    // Add Topics
    const submitTopic = (e) => {
        e.preventDefault()
        setTopics([...topics, { topic: topic }])
        setTopic("")
    }
    // Delete Topics
    const deleteTopic = (e) => {
        const deleteTopic = topics.filter((item, index) => e !== index);
        setTopics(deleteTopic)
    }
    // Questinon Output Toggle
    const question_output_hide_show = () => {
        $('.question_output').slideToggle();
    }
    const answer_output_hide_show = () => {
        $('.answer_output').slideToggle();
    }
    // // Create JSON
    // const send_json = () => {
    //     const array = new Array(boardReducer[0]);
    //     mcqReducer.map((item, i) => {
    //         array.push(item)
    //     })
    //     const jsonData = JSON.stringify(array);
    //     document.write(jsonData)
    // }
    // // Close Alert
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false)
        setDialogStatus(false);
        setConfirmDialog(false)
    };
    return (
        <section className="add_mcq_main pt-3">
            {/* Add MCQs Child  */}
            <div className="add_mcq_child container-fluid">
                <div className="row">
                    <div className="col-lg-2 mb-5 mcqs_list_main ">
                        <div className="bg-white py-3 container-fluid" style={{ borderRadius: '20px', boxShadow: '0px 0px 2px black' }}>
                            {theoryReducer.map((item, i) => (
                                <button key={i} style={{ width: '40px' }} className={`col-3 text-center bg-success text-white question${i}`} onClick={() => getOldTheroyQuestion(i)}>{i + 1}</button>
                            ))}
                        </div>
                    </div>
                    {/* Mcqs Left Side */}
                    <div className="col-lg-7 bg-white pb-3" style={{ borderRadius: '20px', boxShadow: '0px 0px 2px black' }}>
                        {/* Responsive Meta Data */}
                        <div className="table-responsive mx-auto">
                            <table className="table p-0 m-0">
                                <tbody>
                                    {boardReducer.map((item, i) => (
                                        <tr className="text-center">
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.system}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.board}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.subject}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.year}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.month}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.series}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.paper}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="container-fluid" style={{ minHeight: '60vh' }}>
                            <div className="form-group">
                                <textarea className="form-control" placeholder="Enter Question" rows="5" value={question} onChange={questionChange} required></textarea>
                            </div>
                            <div className="row">
                                <select value={markdownFontSize} onChange={(e) => setMarkdownFontSize(e.target.value) } className="small ml-3" style={{height: '25px'}}>
                                    <option value="12px">12px</option>
                                    <option value="13px">13px</option>
                                    <option value="14px">14px</option>
                                    <option value="15px">15px</option>
                                    <option value="16px">16px</option>
                                </select>
                                <button type="button" onClick={question_output_hide_show} className="btn mr-3 btn-sm btn-info mybutton mb-2 d-flex ml-auto">Hide / Show</button>
                            </div>
                            <div className="p-2 form-group question_output col-12" style={{ fontSize: markdownFontSize, borderRadius: "5px"}}>
                                <MathpixLoader>
                                    <MathpixMarkdown text={question} />
                                </MathpixLoader>
                            </div>
                            <textarea className="form-control" placeholder="Enter Answer" rows="5" value={answer} onChange={(e) => setAnswer(e.target.value)} required></textarea>
                            <div className="row mt-3">
                                <select value={markdownFontSize} onChange={(e) => setMarkdownFontSize(e.target.value) } className="small ml-3" style={{height: '25px'}}>
                                    <option value="12px">12px</option>
                                    <option value="13px">13px</option>
                                    <option value="14px">14px</option>
                                    <option value="15px">15px</option>
                                    <option value="16px">16px</option>
                                </select>
                                <button type="button" onClick={answer_output_hide_show} className="btn mr-3 btn-sm btn-info mybutton mb-2 d-flex ml-auto">Hide / Show</button>
                            </div>
                            <div className="p-2 form-group answer_output col-12" style={{ fontSize: markdownFontSize, borderRadius: "5px"}}>
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
                                            <button type="button" onClick={() => history.push("/admin/panel/add/images")} className="bg-success mx-2 mt-2 btn mybutton">Next Step</button>
                                            <button type="button" className="bg-success mx-2 mt-2 btn mybutton">Finish</button>
                                        </div>
                                        <div>
                                            <button type="button" style={{ display: "none" }} onClick={() => setConfirmDialog(true)} className="mr-2 bg-info border mt-2 mybutton delete_theory_button btn">delete</button>
                                            <button type="button" style={{ display: "none" }} onClick={update_theory_question_by_id} className="border bg-info mt-2 mybutton update_theory_button btn mybutton">update</button>
                                            <Button variant="contained" onClick={add_theory_question} className="mybutton bg-info next_theory_button">Next</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Mcqs Right Side */}
                    <div className="col-lg-3">
                        <form onSubmit={submitTopic} className="bg-white py-4 px-3" style={{ borderRadius: '20px', boxShadow: '0px 0px 2px black' }}>
                            <div className="form-group mb-4">
                                <input type="number" className="form-control marks w-50 float-left" placeholder="Enter Marks" max="100" min="1" /><br />
                            </div>
                            <div className="topics_main mt-3 container-fluid">
                                <div className="row">
                                    <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="form-control col-10" placeholder="Enter Topic" required />
                                    <button type="submit" className="col-md-2" style={{ width: '5%', background: "none", border: "none", outline: "none" }}><FcPlus className="another_option h2" /></button>
                                </div>
                                <div className="row">
                                    {topics.map((item, i) => {
                                        return <div key={i} className={`topicDisplay pb-1 h5 `}><p className="option_text my-1">{item.topic}</p><span className="delete_topic" onClick={() => deleteTopic(i)}>&times;</span></div>
                                    })}
                                </div>
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
            <ModelNotification DialogStatus={DialogStatus} DialogTitle={DialogTitle} DialogDesc={DialogDesc} handleClose={handleClose} DialogOk={DialogOk} />
            {/* Confirm Dialog Box */}
            <Dialog
                open={ConfirmDialog}
                TransitionComponent={Transition}
                keepMounted
                maxWidth="xs"
                fullWidth="true"
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title" className="py-3 text-center h3">Notification</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Are You sure you want to delete this field?
                        </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        cancel
                        </Button>
                    <Button color="primary" onClick={delete_theory_question}>
                        Yes
                        </Button>
                </DialogActions>
            </Dialog>
            {/* Progress Bar */}
            <Backdrop className={classes.backdrop} open={ProgressBarStatus}>
                <LinearProgressWithLabel value={progress} />;
            </Backdrop>
        </section>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeState: (data) => {
            dispatch(add_theory(data))
        },
        updateState: (data) => {
            dispatch(update_theory(data))
        },
        deleteState: (index) => {
            dispatch({ type: "remove_theory", index: index })
        }
    }
}


export default connect(null, mapDispatchToProps)(AdminAddTheoryComponent);
