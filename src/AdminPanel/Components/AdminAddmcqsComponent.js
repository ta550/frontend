import React, { useEffect, useState } from 'react'
import '../css/AdminAddmcqs.css'
import { FcPlus } from 'react-icons/fc'
import $ from 'jquery'
import { MathpixLoader, MathpixMarkdown } from "mathpix-markdown-it";
import { add_mcq, add_mcqs_complete, remove_mcq, update_mcq } from '../../action/index'
import { connect , useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

function AdminAddmcqsComponent(props) {
    // React State hooks
    const [question, setQuestion] = useState("")
    const [topic, setTopic] = useState("");
    const [options, setOptions] = useState([]);
    const [topics, setTopics] = useState([])
    // React Redux
    const mcqReducer = useSelector(state => state.mcqReducer)
    const boardReducer = useSelector(state => state.boardReducer)
    const history = useHistory();
    // Math compiler
    // question input changehandler
    const questionChange = (e) => {
        setQuestion(e.target.value);
    }
    // SetTime Out Functions
    const mcqButtonChangeBorder = (e) => {
        setTimeout(() =>{
            for (var i = 0;i < mcqReducer.length; i++){
                if (i === e){
                    $(`.question${e}`).css({border: '3px solid black'})
                }else{
                    $(`.question${i}`).css({border: '3px solid white'})
                }
            }
        },100)
    }
    const SelectedOptionsBackgroundChange = optionsbyindex => {
        setTimeout(() => {
            for (var i = 0; i < optionsbyindex.length; i++) {
                if (optionsbyindex[i].status === true) {
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
            setOptions([...options, { status: false, option: option }]);
            $('.static_option').val("");
        }
        SelectedOptionsBackgroundChange(options)
    }
    // on option delete
    const deleteOption = (e) => {
        let items = [...options];
        let item = { ...items[e] };
        const newTodos = options.filter((_, index) => index !== e);
        setOptions(newTodos);
        var optionsbyindex = newTodos;
        SelectedOptionsBackgroundChange(optionsbyindex)
    }
    // on option selected
    const onselect = (e) => {
        let items = [...options];
        let item = { ...items[e] };
        for (var i = 0; i < items.length; i++) {
            if (items[i].status === true) {
                $(`.mcq${i}`).removeClass("mcq_selected")
                item.status = true;
                let item2 = { ...items[i] }
                item2.status = false
                items[i] = item2
            } else {
                $(`.mcq${e}`).addClass("mcq_selected")
                item.status = true;
            }
        }
        if (item.status === true) {
            $(`.mcq${e}`).addClass("mcq_selected");
            item.status = true
        }
        items[e] = item;
        setOptions(items)
    }
    // on mcq added
    const add_mcq = () => {
        const mark = $('.marks').val();
        if (question === "" || mark === "" || options.length === 0) {
            alert("Please Fill out all fields")
        } else {
            const items = [...options];
            let status = 0;
            for (var i = 0; i < items.length; i++) {
                if (items[i].status === true) {
                    status = 1;
                }
            }
            if (status === 1) {
                const data = {
                    question: question,
                    marks: mark,
                    options: options,
                    topics: topics
                }
                props.changeState(data)
                setOptions([])
                setQuestion("")
                setTopics([])
            } else {
                alert('Choose the Correct Option')
            }
        }
    }
    // Get Old Mcq for Update
    const getOldMcq = (e) => {
        window.value = e;
        mcqButtonChangeBorder(e)
        setTopics([])
        setOptions(mcqReducer[e].options)
        setQuestion(mcqReducer[e].question)
        $('.marks').val(mcqReducer[e].marks);
        setTopics(mcqReducer[e].topics)
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
                alert("Please Fill out all fields")
            } else {
                const items = [...options];
                let status = 0;
                for (var i = 0; i < items.length; i++) {
                    if (items[i].status === true) {
                        status = 1;
                    }
                }
                if (status === 1) {
                    const mark = $('.marks').val();
                    const data = { question: question, marks: mark, options: options, topics: topics, index: window.value }
                    props.updateState(data)
                    setQuestion("")
                    setOptions([])
                    setTopics([])
                    mcqButtonChangeBorder(-1)
                    $('.next_mcq_button').css("display", "inline")
                    $('.update_mcq_button').css("display", "none");
                    $('.delete_mcq_button').css("display", "none");
                } else {
                    alert('Choose the Correct Option')
                }
            }
        } else {
            alert("Please Select Mcq for Delete")
        }
    }
    // Delete Mcq By its Id
    const delete_mcq_by_id = () => {
        if (window.value != null) {
            if (window.confirm("Are you sure you want to delete this field?")) {
                const index = window.value;
                props.deleteState(index)
                setQuestion("")
                setOptions([])
                setTopics([])
                mcqButtonChangeBorder(-1)
                $('.next_mcq_button').css("display", "inline")
                $('.update_mcq_button').css("display", "none");
                $('.delete_mcq_button').css("display", "none");
            }
        } else {
            alert("Please Select Mcq for Delete")
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
    // Create JSON
    const send_json = () => {
        const array = new Array(boardReducer[0]);
        mcqReducer.map((item, i) => {
            array.push(item)
        })
        const jsonData = JSON.stringify(array);
        document.write(jsonData)
    }

    return (
        <section className="add_mcq_main">
            {/* Add MCQs Child  */}
            <div className="add_mcq_child container-fluid pt-2">
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
                                    <tr className="text-center">
                                        <td style={{ whiteSpace: 'nowrap' }}>{boardReducer[0].system}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{boardReducer[0].board}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{boardReducer[0].subject}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{boardReducer[0].year}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{boardReducer[0].month}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{boardReducer[0].series}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{boardReducer[0].paper}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <form onSubmit={submit} className="container-fluid" autoComplete="off" style={{ minHeight: '60vh' }}>
                            <div className="form-group">
                                <textarea className="form-control" placeholder="Enter Question" rows="5" value={question} onChange={questionChange} required></textarea>
                            </div>
                            <button type="button" onClick={question_output_hide_show} className="btn btn-sm mybutton py-1 mb-2 px-2 d-flex ml-auto m-0">hide / show</button>
                            <div className="p-2 form-group question_output bg-info text-white col-12" style={{ height: "160px", borderRadius: "5px", overflowY: 'scroll' }}>
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
                                            <button type="button" onClick={() => history.push("/admin/panel/add/images")} className="bg-success mx-2 mt-2 btn mybutton">Next Step</button>
                                        </div>
                                        <div>
                                            <button type="button" style={{ display: "none" }} onClick={delete_mcq_by_id} className="border mt-2 mybutton delete_mcq_button btn">delete</button>
                                            <button type="button" style={{ display: "none" }} onClick={update_mcq_by_id} className="border mt-2 mybutton update_mcq_button btn mybutton">update</button>
                                            <button type="button" onClick={add_mcq} className="mt-2 mybutton next_mcq_button btn">Next</button>
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
        addMcqsComplete: (data) => {
            dispatch(add_mcqs_complete(data))
        }
    }
}


export default connect(null, mapDispatchToProps)(AdminAddmcqsComponent);
