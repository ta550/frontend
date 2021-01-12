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

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function AdminAddTheoryComponent(props) {
    // React State hooks
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    const [topic, setTopic] = useState("");
    const [topics, setTopics] = useState([])
    const [openAlert, setOpenAlert] = React.useState(false);
    const [AlertValue, setAlertValue] = React.useState(false);
    const [ConfirmDialog, setConfirmDialog] = React.useState(false);
    // Dialog Hooks
    const [DialogStatus, setDialogStatus] = React.useState(false);
    const [DialogDesc, setDialogDesc] = React.useState("Are you Sure?");
    const [DialogTitle, setDialogTitle] = React.useState("Notification");
    const [DialogOk, setDialogOk] = React.useState("Ok");

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
                            <button type="button" onClick={question_output_hide_show} className="btn btn-sm mybutton py-1 mb-2 px-2 d-flex ml-auto m-0">hide / show</button>
                            <div className="p-2 form-group question_output bg-info text-white col-12" style={{ height: "160px", borderRadius: "5px", overflowY: 'scroll' }}>
                                <MathpixLoader>
                                    <MathpixMarkdown text={question} />
                                </MathpixLoader>
                            </div>
                            <textarea className="form-control" placeholder="Enter Answer" rows="5" value={answer} onChange={(e) => setAnswer(e.target.value)} required></textarea>
                            <button type="button" onClick={answer_output_hide_show} className="btn btn-sm mybutton py-1 my-2 px-2 d-flex ml-auto m-0">hide / show</button>
                            <div className="p-2 form-group answer_output bg-info text-white col-12" style={{ height: "160px", borderRadius: "5px", overflowY: 'scroll' }}>
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
                                        </div>
                                        <div>
                                            <button type="button" style={{ display: "none" }} onClick={() => setConfirmDialog(true)} className="border mt-2 mybutton delete_theory_button btn">delete</button>
                                            <button type="button" style={{ display: "none" }} onClick={update_theory_question_by_id} className="border mt-2 mybutton update_theory_button btn mybutton">update</button>
                                            <Button variant="contained" onClick={add_theory_question} className="mybutton next_theory_button">Next</Button>
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
            {/*   Confirm Dialog Box   */}
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
