import React, { useEffect, useState } from 'react'
import '../css/AdminAddmcqs.css'
import { FcPlus } from 'react-icons/fc'
import $ from 'jquery'
import { MathpixLoader, MathpixMarkdown } from "mathpix-markdown-it";
import { add_mcq, remove_mcq, reset_mcq, reset_board, update_mcq } from '../../action/index'
import { connect, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios'
// Dialog Box
import Slide from '@material-ui/core/Slide';
import ModelNotification from '../../Modals/ModelNotification'
import ConfirmDialog from '../../Modals/ConfirmDialog'
import LinearProgressWithLabel from './LinearProgressBarWithLabel'
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';
import S3 from 'react-aws-s3';
import DeleteIcon from '@material-ui/icons/Delete';


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

function AdminAddmcqsComponent(props) {
    // React State hooks
    const [question, setQuestion] = useState("")
    const [topic, setTopic] = useState("");
    const [options, setOptions] = useState([]);
    const [topics, setTopics] = useState([])
    const [openAlertDelete, setOpenAlertDelete] = React.useState(false);
    const [openAlertUpdate, setOpenAlertUpdate] = React.useState(false);
    const [ConfirmDialogStatus, setConfirmDialog] = React.useState(false);
    const [markdownFontSize, setMarkdownFontSize] = React.useState("14px");
    const [deleteImagesNames, setDeleteImagesNames] = React.useState([])
    const [images, setImages] = React.useState([])
    const [config, setConfig] = React.useState()
    // Dialog Hooks
    const [DialogStatus, setDialogStatus] = React.useState(false);
    const [DialogDesc, setDialogDesc] = React.useState("Are you Sure?");
    const [DialogTitle, setDialogTitle] = React.useState("Notification");
    const [DialogOk, setDialogOk] = React.useState("Ok");
    const [ProgressBarStatus, setProgressBarStatus] = useState(false)
    const classes = useStyles();
    const [progress, setProgress] = useState(10);
    // React Redux
    const mcqReducer = useSelector(state => state.mcqReducer)
    const boardReducer = useSelector(state => state.boardReducer)
    const loginReducer = useSelector(state => state.loginReducer)
    // for navigation
    const history = useHistory();


    useEffect(() => {

        // GET S3 CREDANTIONS
        fetch("/dashboard/de/question/s3credentials", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginReducer}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (!res.message) {
                    setConfig({
                        bucketName: "exam105",
                        dirName: boardReducer[0].subject.toLowerCase(),
                        region: res.region,
                        accessKeyId: res.accesskey,
                        secretAccessKey: res.secretkey
                    })
                }
            })
            .catch((err) => {
                console.log(err)
            }
            )

        if (boardReducer.length === 0) {
            history.push("/admin/panel/add/papers/")
        }
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
            for (var i = 0; i < mcqReducer.length; i++) {
                if (i === e) {
                    $(`.question${e}`).css({ border: '3px solid black' })
                } else {
                    $(`.question${i}`).css({ border: '3px solid white' })
                }
            }
        }, 100)
    }
    const SelectedOptionsBackgroundChange = optionsbyindex => {
        setTimeout(() => {
            for (var i = 0; i < optionsbyindex.length; i++) {
                if (optionsbyindex[i].correct === true) {
                    $(`.mcq${i}`).addClass("mcq_selected")
                } else {
                    $(`.mcq${i}`).removeClass("mcq_selected")
                }
            }
        }, 100)
    }
    // on option created
    const submit = (e) => {
        e.preventDefault();
        let opt = $('.static_option').val();
        const option = opt.trim();
        if (option.length > 0) {
            setOptions([...options, { correct: false, option: option }]);
            $('.static_option').val("");
        }
        SelectedOptionsBackgroundChange(options)
    }
    // on option delete
    const deleteOption = (e) => {
        const newOptions = options.filter((_, index) => index !== e);
        setOptions(newOptions);
        var optionsbyindex = newOptions;
        SelectedOptionsBackgroundChange(optionsbyindex)
    }
    // on option selected
    const onselect = (e) => {
        let items = [...options];
        let item = { ...items[e] };
        for (var i = 0; i < items.length; i++) {
            if (items[i].correct === true) {
                $(`.mcq${i}`).removeClass("mcq_selected")
                item.correct = true;
                let item2 = { ...items[i] }
                item2.correct = false
                items[i] = item2
            } else {
                $(`.mcq${e}`).addClass("mcq_selected")
                item.correct = true;
            }
        }
        if (item.correct === true) {
            $(`.mcq${e}`).addClass("mcq_selected");
            item.correct = true
        }
        items[e] = item;
        setOptions(items)
    }
    // on mcq added
    const add_mcq = async () => {
        const mark = $('.marks').val();
        if (question === "" || mark === "" || options.length === 0) {
            if (question === "") { setDialogDesc("Question Field Are Required!") }
            else if (mark === "") { setDialogDesc("Marks Field Are Required!") }
            else { setDialogDesc("Options are Missing!") }
            setDialogStatus(true)
        } else {
            const items = [...options];
            let status = 0;
            for (var i = 0; i < items.length; i++) {
                if (items[i].correct === true) {
                    status = 1;
                }
            }
            if (status === 1) {
                const ReactS3Client = new S3(config);

                var imageLocations = new Array();
                var loopComplete = false;
                var files = images
                if (files.length > 0) {
                    for (var i = 0; i < files.length; i++) {
                        if (i + 1 === files.length) {
                            loopComplete = true;
                        }
                        ReactS3Client
                            .uploadFile(files[i], files[i].name)
                            .then(res => {
                                const imageURL = { "imageurl": res.location }
                                imageLocations.push(imageURL)
                            })
                            .catch(err => {
                                setDialogDesc("Some Went Wrong Please Try Again!")
                                setDialogStatus(true)
                                console.log(err)
                            })
                    }
                } else {
                    loopComplete = true;
                }

                if (loopComplete === true) {
                    const data = {
                        question: question,
                        marks: mark,
                        options: options,
                        topics: topics,
                        images: imageLocations
                    }
                    props.changeState(data)
                    setOptions([])
                    setQuestion("")
                    setTopics([])
                    setImages([])
                    var filesInput = $('.upload_images_input_for_mcqs');
                    filesInput.replaceWith(filesInput.val(''));
                }
            } else {
                setDialogDesc("Chose The correct Option")
                setDialogStatus(true)
            }
        }
    }
    // Get Old Mcq for Update
    const getOldMcq = (e) => {
        window.value = e;
        mcqButtonChangeBorder(e)
        setTopics([])
        setOptions(mcqReducer[e].options)
        setQuestion(mcqReducer[e].questions)
        $('.marks').val(mcqReducer[e].marks);
        setTopics(mcqReducer[e].topics)
        const imageurls = mcqReducer[e].images;
        setImages(imageurls)
        // Selected Options
        var optionsbyindex = mcqReducer[e].options;
        SelectedOptionsBackgroundChange(optionsbyindex)
        // Hide and show buttons
        $('.next_mcq_button').css("display", "none")
        $('.update_mcq_button').css("display", "inline");
        $('.delete_mcq_button').css("display", "inline");
    }
    // Update Mcq By its Id
    const update_mcq_by_id = () => {
        if (window.value != null) {
            const mark = $('.marks').val();
            if (question === "" || mark === "" || options.length === 0) {
                setDialogDesc("All Fields Are Required?")
                setDialogStatus(true)
            } else {
                const items = [...options];
                let status = 0;
                for (var i = 0; i < items.length; i++) {
                    if (items[i].correct === true) {
                        status = 1;
                    }
                }
                if (status === 1) {
                    const ReactS3Client = new S3(config);

                    for (var i = 0; i < deleteImagesNames.length; i++) {
                        ReactS3Client.deleteFile(deleteImagesNames[i])
                    }

                    var imageLocations = [];
                    var loopComplete = false;
                    var files = images;
                    if (files.length !== 0) {
                        for (var i = 0; i < files.length; i++) {
                            if (i + 1 === files.length) {
                                loopComplete = true;
                            }
                            if (!files[i].imageurl) {
                                ReactS3Client
                                    .uploadFile(files[i], files[i].name)
                                    .then(res => {
                                        const imageURL = { "imageurl": res.location }
                                        imageLocations.push(imageURL)
                                    })
                                    .catch(err => {
                                        loopComplete = false;
                                        console.log(err)
                                    })
                            } else {
                                imageLocations.push(files[i])
                            }
                        }
                    }else {
                        loopComplete = true;
                    }


                    if (loopComplete === true) {
                        const mark = $('.marks').val();

                        const data = {
                            question: question, marks: mark, options: options, topics: topics, index: window.value,
                            images: imageLocations
                        }
                        props.updateState(data)
                        setQuestion("")
                        setOptions([])
                        setTopics([])
                        setOpenAlertUpdate(true)
                        mcqButtonChangeBorder(-1)
                        setImages([])
                        $('.next_mcq_button').css("display", "inline")
                        $('.update_mcq_button').css("display", "none");
                        $('.delete_mcq_button').css("display", "none");
                    } else {
                        console.log(imageLocations)
                        setDialogDesc("Some Went Wrong Please Try Again")
                        setDialogStatus(true)
                    }
                } else {
                    setDialogDesc("Chose The Correct Option")
                    setDialogStatus(true)
                }
            }
        } else {
            setDialogDesc("Select MCQ For Delete?")
            setDialogStatus(true)
        }
    }
    // Delete Mcq By its Id
    const delete_mcq_by_id = () => {
        if (window.value != null) {
            const index = window.value;
            setConfirmDialog(false)
            props.deleteState(index)
            setQuestion("")
            setOptions([])
            setTopics([])
            mcqButtonChangeBorder(-1)
            setOpenAlertDelete(true);
            setImages([])
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
    // Close Alert
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlertDelete(false);
        setOpenAlertUpdate(false);
        setDialogStatus(false);
        setConfirmDialog(false)
    };
    // Finish Exam
    const finish_paper = () => {
        setProgressBarStatus(true)
        const data = new Array(boardReducer[0]);
        mcqReducer.map((item, i) => {
            data.push(item)
        })
        fetch("/dashboard/de/questions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginReducer}`
            },
            body: JSON.stringify(data),
        })
            .then(res => res.json())
            .then(res => {
                console.log(data)
                props.resetState();
                props.resetBoard();
                setProgressBarStatus(false)
                history.push("/admin/panel/papers")
            })
            .catch((err) => {
                console.log(err)
                setProgressBarStatus(false)
                setDialogDesc("Some went wrong. please try Again..")
                setDialogStatus(true)
            }
        )
    }

    // On custom add images
    const handleAddImage = (e) => {
        e.preventDefault();
        let files = e.target.files
        var newFiles = []

        var oldImageNames = []
        for (var i = 0; i < images.length; i++) {
            var lastSegment = "";
            if (images[i].imageurl) {
                var parts = images[i].imageurl.split('/');
                lastSegment = parts.pop() || parts.pop();
                oldImageNames.push(lastSegment)
            } else {
                oldImageNames.push(images[i].name)
            }
        }

        for (var i = 0; i < files.length; i++) {
            if (!oldImageNames.includes(files[i].name)) {
                newFiles.push(files[i])
            }
        }

        setImages([...images, ...newFiles]);

        var filesInput = $('.upload_images_input_for_mcqs');
        filesInput.replaceWith(filesInput.val(''));
    }

    const deleteImage = (data) => {
        for (var i = 0; i < images.length; i++) {
            if (images[i].imageurl) {
                if (images[i].imageurl === images[data].imageurl) {
                    const parts = images[data].imageurl.split('/');
                    const lastSegment = parts.pop() || parts.pop();
                    setDeleteImagesNames([...deleteImagesNames, lastSegment])
                    setImages(images.filter((item, index) => index !== data))
                    console.log(deleteImagesNames);
                }
            } else {
                setImages(images.filter((item, index) => index !== data))
            }
        }
    };

    return (
        <section className="add_mcq_main pt-3">
            {/* Add MCQs Child  */}
            <div className="add_mcq_child container-fluid">
                <div className="row">
                    <div className="col-lg-2 mb-5 mcqs_list_main ">
                        <div className="bg-white py-3 container-fluid" style={{ borderRadius: '20px', boxShadow: '0px 0px 2px black' }}>
                            {mcqReducer.map((item, i) => (
                                <button key={i} style={{ width: '40px' }} className={`col-3 text-center bg-success text-white question${i}`} onClick={() => getOldMcq(i)}>{i + 1}</button>
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
                        <form onSubmit={submit} className="container-fluid" autoComplete="off" style={{ minHeight: '60vh' }}>
                            <div className="form-group">
                                <textarea className="form-control" placeholder="Enter Question" rows="5" value={question} onChange={questionChange} required></textarea>
                            </div>
                            <div className="row">
                                <select value={markdownFontSize} onChange={(e) => setMarkdownFontSize(e.target.value)} className="small ml-3" style={{ height: '25px' }}>
                                    <option value="12px">12px</option>
                                    <option value="13px">13px</option>
                                    <option value="14px">14px</option>
                                    <option value="15px">15px</option>
                                    <option value="16px">16px</option>
                                </select>
                                <button type="button" onClick={question_output_hide_show} className="btn mr-3 btn-sm btn-info mybutton mb-2 d-flex ml-auto">Hide / Show</button>
                            </div>
                            <div className="p-2 form-group question_output col-12" style={{ fontSize: markdownFontSize }}>
                                <MathpixLoader>
                                    <MathpixMarkdown text={question} />
                                </MathpixLoader>
                            </div>
                            <div className="form-group m-0">
                                <input type="text" name="option_input" placeholder="Enter Option" style={{ width: "90%" }} className="d-inline static_option form-control" required /> <button type="submit" className="p-1 mt-1" style={{ width: '5%', background: "none", border: "none", outline: "none" }}><FcPlus className="another_option h2" /></button>
                            </div>
                            {options.map((item, i) => {
                                return <div key={i} className={`mcqDisplay mcq${i}`}><p style={{ width: '80%', fontSize: '15px', wordWrap: 'break-word' }} className="option_text py-auto mb-2">{item.option}</p><div className="mcqDisplay__button"><svg onClick={() => onselect(i)} className="MuiSvgIcon-root mcqDisplay__correct" style={{ cursor: 'pointer' }} focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></svg><svg onClick={() => deleteOption(i)} style={{ cursor: 'pointer' }} className="MuiSvgIcon-root mcqDisplay__delete" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg></div></div>
                            })}
                        </form>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12 mx-auto mt-4">
                                    <div className="all_mcq_operations_button d-flex mx-auto justify-content-between w-100 ">
                                        <div>
                                            <button type="button" onClick={finish_paper} className="bg-success mx-2 mt-2 btn mybutton">Finish</button>
                                        </div>
                                        <div>
                                            <button type="button" style={{ display: "none" }} onClick={() => setConfirmDialog(true)} className="border mx-2 mt-2 mybutton delete_mcq_button btn btn-info">delete</button>
                                            <button type="button" style={{ display: "none" }} onClick={update_mcq_by_id} className="border mt-2 mybutton update_mcq_button btn mybutton btn-info">update</button>
                                            <Button variant="contained" onClick={add_mcq} className="bg-info mybutton next_mcq_button">Next</Button>
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
                                        return <div key={i} className={`topicDisplay`} style={{ fontSize: '12px', fontWeight: '500' }}><p className="option_text my-1">{item.topic}</p><span className="delete_topic" style={{ fontSize: '16px' }} onClick={() => deleteTopic(i)}>&times;</span></div>
                                    })}
                                </div>
                            </div>
                        </form>
                        <br />
                        <form className="bg-white py-4 px-3" style={{ borderRadius: '20px', boxShadow: '0px 0px 2px black' }}>
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
                                        return <div className="position-relative d-flex align-items-center w-50">
                                            <img alt="Image Error" style={{ height: '80px', width: '100%' }} className="img-fluid p-2" src={item.imageurl} />
                                            <DeleteIcon onClick={() => deleteImage(i)} className="bg-dark text-white rounded cursor-pointer" style={{ position: 'absolute',top:'0', right: '0' }} />
                                        </div>
                                    }
                                    var url = URL.createObjectURL(item)
                                    return <div className="position-relative d-flex align-items-center w-50">
                                        <img alt="Image Error" style={{ height: '80px', width: '100%' }} className="img-fluid p-2" src={url} />
                                        <DeleteIcon onClick={() => deleteImage(i)} className="bg-dark text-white rounded cursor-pointer" style={{ position: 'absolute',top:'0', right: '0' }} />
                                    </div>
                                })}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <br />
            {/* Alerts */}
            <Snackbar open={openAlertDelete} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Deleted Successfull
                </Alert>
            </Snackbar>
            <Snackbar open={openAlertUpdate} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Updated Successfull
                </Alert>
            </Snackbar>
            {/* Dialog Box */}
            <ModelNotification DialogStatus={DialogStatus} DialogTitle={DialogTitle} DialogDesc={DialogDesc} handleClose={handleClose} DialogOk={DialogOk} />
            {/*   Confirm Dialog Box   */}
            <ConfirmDialog delete_mcq_by_id={delete_mcq_by_id} ConfirmDialog={ConfirmDialogStatus} ConfirmDesc="Are you sure you want to delete this field?" handleClose={handleClose} />
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
            dispatch(add_mcq(data))
        },
        updateState: (data) => {
            dispatch(update_mcq(data))
        },
        deleteState: (data) => {
            dispatch(remove_mcq(data))
        },
        resetState: () => {
            dispatch(reset_mcq())
        },
        resetBoard: () => {
            dispatch(reset_board())
        }
    }
}


export default connect(null, mapDispatchToProps)(AdminAddmcqsComponent);