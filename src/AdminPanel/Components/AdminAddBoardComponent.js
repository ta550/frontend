import React, { useState } from 'react'
import '../css/AdminAddmcqs.css'
import { add_board } from '../../action/index'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ModelNotification from '../../Modals/ModelNotification'
import { ListSubheader, MenuItem, Select } from '@material-ui/core'

function AdminAddBoardComponent(props) {
    const history = useHistory();
    const [startDate, setStartDate] = useState(new Date());
    const [notificationStatus, setNotificationStatus] = useState(false)
    const [systems, setSystems] = useState([
        { system: "GCSE" },
        { system: "IGCSE" },
        { system: "AS" },
        { system: "A Level" },
        { system: "O Level" },
        { system: "Pre U" },
        { system: "IB" },
    ])
    const [boards, setBoards] = useState([])

    const [subjects, setSubjects] = useState([
        { subject: "Math" },
        { subject: "Physics" },
        { subject: "Biology" },
    ])

    const [series, setSeries] = useState([
        { series: "series 1" },
        { series: "series 2" },
        { series: "series 3" },
    ])

    const [papers, setPapers] = useState([
        { paper: "paper 1" },
        { paper: "paper 2" },
        { paper: "paper 3" },
    ])

    const [paper, setPaper] = useState({
        system: '',
        board: '',
        subject: '',
        year: '',
        month: '',
        series: '',
        paper: ''
    });

    const submit_data = (e) => {
        e.preventDefault()
        if (paper.month === "" || paper.year === "") {
            setNotificationStatus(true)
        } else {
            props.add_board(paper)
            history.push("/admin/panel/add/")
        }

    }

    const change_input = (e) => {
        if (e.target.name === "system") {
            if (e.target.value === "GCSE") {
                setBoards([
                    { board: "Edexcel CGSE" },
                    { board: "AQA GCSE" },
                    { board: "OCR GCSE" },
                    { board: "CCEA GCSE" }
                ])
            } else if (e.target.value === "IGCSE") {
                setBoards([
                    { board: "Edexcel IGCSE" },
                    { board: "CIE IGCSE" },
                ])
            } else if (e.target.value === "AS") {
                setBoards([
                    { board: "Edexcel AS" },
                    { board: "AQA AS" },
                    { board: "OCR AS" },
                    { board: "CIE AS" },
                    { board: "Edexcel IAL" }
                ])
            } else if (e.target.value === "A Level") {
                setBoards([
                    { board: "Edexcel A Level" },
                    { board: "AQA A Level" },
                    { board: "OCR A Level" },
                    { board: "CIE A Level" },
                    { board: "Edexcel IAL" }
                ])
            } else if (e.target.value === "O Level") {
                setBoards([
                    { board: "Edexcel A Level" },
                    { board: "AQA A Level" },
                    { board: "OCR A Level" },
                    { board: "CIE A Level" },
                    { board: "Edexcel IAL" }
                ])
            } else if (e.target.value === "O Level") {
                setBoards([
                    { board: "CIE O Level" }
                ])
            } else if (e.target.value === "Pre U") {
                setBoards([
                    { board: "CIE Pre U" }
                ])
            } else if (e.target.value === "IB") {
                setBoards([
                    { board: "No Board", status: "disable" }
                ])
            }
        }
        setPaper({ ...paper, [e.target.name]: e.target.value })
    }

    const change_month_and_year = (date) => {
        setStartDate(date)
        const monthNumber = date.getMonth();
        const year = date.getFullYear();
        var month = "";
        switch (monthNumber.toString()) {
            case "0":
                month = "January";
                break;
            case "1":
                month = "February";
                break;
            case "2":
                month = "March"
                break;
            case "3":
                month = "April"
                break;
            case "4":
                month = "May"
                break;
            case "5":
                month = "June"
                break;
            case "6":
                month = "July"
                break;
            case "7":
                month = "August"
                break;
            case "8":
                month = "September"
                break;
            case "9":
                month = "October"
                break;
            case "10":
                month = "November"
                break;
            case "11":
                month = "December"
                break;
            default:
                alert("please try again")
        }
        setPaper({ ...paper, year: year.toString(), month: month })
    }

    return (
        <section className="add_board_main">
            <div className="add_board_child px-md-5 px-4">
                <h1 className="text-center board_titile py-3">Paper Meta Data</h1>
                <form className="board_form mx-auto" onSubmit={submit_data}>
                    <div className="form-group">
                        <label htmlFor="">Select System :</label>
                        <Select defaultValue="" name="system" onChange={change_input} id="grouped-select" className="form-control" required>
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {systems.map((item, i) => {
                                return (
                                    <MenuItem value={item.system}>{item.system}</MenuItem>
                                )
                            })}
                        </Select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Select Board :</label>
                        <Select defaultValue="" name="board" onChange={change_input} id="grouped-select" className="form-control" required>
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {boards.map((item, i) => {
                                return (
                                    <MenuItem value={item.board}>{item.board}</MenuItem>
                                )
                            })}
                        </Select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Select Subject :</label>
                        <Select defaultValue="" name="subject" onChange={change_input} id="grouped-select" className="form-control" required>
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {subjects.map((item, i) => {
                                return (
                                    <MenuItem value={item.subject}>{item.subject}</MenuItem>
                                )
                            })}
                        </Select>
                    </div>
                    <div className="form-group datepicker_main">
                        <label htmlFor="">Select Year And Month :</label><br />
                        <DatePicker className="form-control w-100" selected={startDate} showMonthYearPicker peekNextMonth onChangeRaw={e => e.preventDefault()} onFocus={e => e.preventDefault()} onKeyDown={e => e.preventDefault()} disabledKeyboardNavigation dateFormat="MMMM yyyy" onChange={change_month_and_year} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Select Series :</label>
                        <Select defaultValue="" name="series" onChange={change_input} id="grouped-select" className="form-control" required>
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {series.map((item, i) => {
                                return (
                                    <MenuItem value={item.series}>{item.series}</MenuItem>
                                )
                            })}
                        </Select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Select Paper:</label>
                        <Select defaultValue="" name="paper" onChange={change_input} id="grouped-select" className="form-control" required>
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {papers.map((item, i) => {
                                return (
                                    <MenuItem value={item.paper}>{item.paper}</MenuItem>
                                )
                            })}
                        </Select>
                    </div>
                    <div className="form-group justify-content-center d-flex">
                        <button type="submit" className="btn px-5 py-2 bg-info mybutton">Submit</button>
                    </div>
                </form>
            </div>
            <ModelNotification DialogStatus={notificationStatus} DialogTitle="Notification" DialogDesc="Please Select Year and month." handleClose={() => setNotificationStatus(false)} DialogOk="Ok" />
        </section>
    )
}


const mapDispatchToProps = (dispatch) => {
    return {
        add_board: (data) => {
            dispatch(add_board(data))
        }
    }
}

export default connect(null, mapDispatchToProps)(AdminAddBoardComponent);