import React, {useEffect} from 'react'
import {NavLink} from 'react-router-dom'
import {FcRemoveImage, FcPlus, FcTodoList, FcDeleteDatabase} from "react-icons/fc"
import {BsFillCaretRightFill} from 'react-icons/bs'
import '../css/AdminSideBar.css'
import $ from 'jquery'
import {useHistory} from 'react-router-dom'
import { connect , useSelector } from 'react-redux'
import { reset_board, reset_theory, reset_mcq } from '../../action/index'

function AdminSideBar(props) {
    const history = useHistory();
    const loginReducer = useSelector(state => state.loginReducer)
    useEffect(()=> {
        if (loginReducer === ""){
            history.push("/admin/panel")
        }
    }, [])
    const sidebar_open = () => {
        $('.Admin_Sidebar').toggleClass("open_sidebar")
        $('.Admin_Sidebar').blur(()=>{
            $(this).toggleClass("open_sidebar")
        })
    }
    const logout = () => {
        props.set_logout();
        history.push("/admin/panel/")
    }

    const clear_cache = () => {
        props.reset_board();
        props.reset_mcq();
        props.reset_theory();
        history.push('/admin/panel/add/papers/')
        $('.Admin_Sidebar').toggleClass("open_sidebar")
    }


    return (
        <section className="Admin_Sidebar">
        <ul className="sidebar_ul">
                <li className="admin_panel_heading_li"><h4 exact to="/admin/panel/">Admin Panel</h4></li>
                <li><NavLink exact to="/admin/panel/papers"><FcTodoList /> Papers List</NavLink></li>
                <li><NavLink exact to="/admin/panel/add/papers"><FcPlus /> Add Paper</NavLink></li>
                <li><NavLink exact to="/admin/panel/add/"><FcPlus /> Add Questions</NavLink></li>
                <li onClick={logout}><NavLink to="#"><FcDeleteDatabase /> Logout</NavLink></li>
            </ul>
            <BsFillCaretRightFill className="sidebar_open_icon" onClick={sidebar_open} />
        </section>
    )
}


const mapDispatchToProps = (dispatch) => {
    return {
        set_logout: () => {
            dispatch({type: 'logout'})
        },
        reset_board: () => {
            dispatch(reset_board())
        },
        reset_mcq: () => {
            dispatch(reset_mcq())
        },
        reset_theory: () => {
            dispatch(reset_theory())
        }
    }
}

export default connect(null, mapDispatchToProps)(AdminSideBar);