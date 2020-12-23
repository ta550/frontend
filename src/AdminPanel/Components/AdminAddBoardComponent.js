import React, {useEffect, useState} from 'react'
import '../css/AdminAddmcqs.css'
import {add_board } from '../../action/index'
import {connect} from 'react-redux'
import {useHistory} from 'react-router-dom'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function AdminAddBoardComponent(props) {
    const history = useHistory();
    const [startDate, setStartDate] = useState(new Date());
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
        props.add_board(paper)
        history.push("/admin/panel/add/mcqs")
    }

    const change_input = (e) => {
        setPaper({...paper, [e.target.name]: e.target.value})
    }

    const change_month_and_year = (date) => {
        setStartDate(date)
        const month = date.getMonth() + 1
        const year = date.getFullYear()
        setPaper({...paper, year: year, month: month})
    }

    return (
        <section className="add_board_main">
            <div className="add_board_child px-md-5 px-4">
                <h1 className="text-center board_titile">Add Paper</h1>
                <form className="board_form mx-auto mt-5" onSubmit={submit_data}>
                    <div className="form-group">
                        <label for="">Enter System :</label>
                        <input type="text" autoFocus className="form-control" name="system" onChange={change_input} value={paper.system} required/>
                    </div>
                    <div className="form-group">
                        <label for="">Enter Board :</label>
                        <input type="text" className="form-control" onChange={change_input} name="board" value={paper.board} required/>
                    </div>
                    <div className="form-group">
                        <label for="">Enter Subject :</label>
                        <input type="text" className="form-control" onChange={change_input} name="subject" value={paper.subject} required/>
                    </div>
                    <div className="form-group datepicker_main">
                        <label for="">Select Year And Month :</label><br />
                        <DatePicker className="form-control w-100" selected={startDate} showMonthYearPicker peekNextMonth onChangeRaw={e => e.preventDefault()} onFocus={e => e.preventDefault()} onKeyDown={e => e.preventDefault()} disabledKeyboardNavigation dateFormat="MMMM yyyy" onChange={change_month_and_year} />
                    </div>
                    <div className="form-group">
                        <label for="">Enter Series :</label>
                        <input type="text" className="form-control" onChange={change_input} name="series" value={paper.series} required/>
                    </div>
                    <div className="form-group">
                        <label for="">Enter Paper:</label>
                        <input type="text" className="form-control" onChange={change_input} name="paper" value={paper.paper} required/>
                    </div>
                    <div className="form-group justify-content-center d-flex">
                        <button type="submit" className="btn px-5 py-2 mybutton">Submit</button>
                    </div>
                </form>
            </div>
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