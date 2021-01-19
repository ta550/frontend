import React, {useEffect, useState} from 'react'
import '../css/AdminAddmcqs.css'
import {add_board } from '../../action/index'
import {connect} from 'react-redux'
import {useHistory} from 'react-router-dom'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ModelNotification from './ModelNotification'

function AdminAddBoardComponent(props) {
    const history = useHistory();
    const [startDate, setStartDate] = useState(new Date());
    const [notificationStatus, setNotificationStatus] = useState(false)
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
        }else{
            props.add_board(paper)
            history.push("/admin/panel/add/")
        }
        
    }

    const change_input = (e) => {
        setPaper({...paper, [e.target.name]: e.target.value})
    }

    const change_month_and_year = (date) => {
        setStartDate(date)
        const monthNumber = startDate.getMonth();
        const year = date.getFullYear();
        var month = "";
        switch(monthNumber.toString()){
            case "0":
                month="January";
                break;
            case "1":
                month="February";
                break;
            case "2":
                month="March"
                break;
            case "3":
                month="April"
                break;
            case "4":
                month="May"
                break;
            case "5":
                month="June"
                break;
            case "6":
                month="July"
                break;
            case "7":
                month="August"
                break;
            case "8":
                month="September"
                break;
            case "9":
                month="October"
                break;
            case "10":
                month="November"
                break;
            case "11":
                month="December"
                break;
            default:
                alert("please try again")
        }
        setPaper({...paper, year: year.toString(), month: month})
    }

    return (
        <section className="add_board_main">
            <div className="add_board_child px-md-5 px-4">
                <h1 className="text-center board_titile">Add Paper</h1>
                <form className="board_form mx-auto mt-5" onSubmit={submit_data}>
                    <div className="form-group">
                        <label htmlFor="">Enter System :</label>
                        <input type="text" autoFocus className="form-control" name="system" onChange={change_input} value={paper.system} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Enter Board :</label>
                        <input type="text" className="form-control" onChange={change_input} name="board" value={paper.board} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Enter Subject :</label>
                        <input type="text" className="form-control" onChange={change_input} name="subject" value={paper.subject} required/>
                    </div>
                    <div className="form-group datepicker_main">
                        <label htmlFor="">Select Year And Month :</label><br />
                        <DatePicker className="form-control w-100" selected={startDate} showMonthYearPicker peekNextMonth onChangeRaw={e => e.preventDefault()} onFocus={e => e.preventDefault()} onKeyDown={e => e.preventDefault()} disabledKeyboardNavigation dateFormat="MMMM yyyy" onChange={change_month_and_year} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Enter Series :</label>
                        <input type="text" className="form-control" onChange={change_input} name="series" value={paper.series} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Enter Paper:</label>
                        <input type="text" className="form-control" onChange={change_input} name="paper" value={paper.paper} required/>
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