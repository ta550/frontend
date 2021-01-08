import React, {useEffect} from 'react'
import {NavLink} from 'react-router-dom'
import {FcHome, FcPlus, FcTodoList, FcDeleteDatabase} from "react-icons/fc"
import {BsFillCaretRightFill} from 'react-icons/bs'
import '../css/AdminSideBar.css'
import $ from 'jquery'
import {useHistory} from 'react-router-dom'
import { connect , useSelector } from 'react-redux'
import { setLogout } from '../../action/index'


function AdminSideBar(props) {
    const history = useHistory();
    const loginReducer = useSelector(state => state.loginReducer)
    useEffect(()=> {
        if (!loginReducer){
            history.push("/admin/panel/")
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

    return (
        <section className="Admin_Sidebar">
        <ul className="sidebar_ul">
                <li className="admin_panel_heading_li"><h4 exact to="/admin/panel/">Admin Panel</h4></li>
                <li><NavLink exact to="/admin/panel/papers"><FcHome /> Home</NavLink></li>
                <li><NavLink exact to="/admin/panel/add/papers"><FcPlus /> Add Paper</NavLink></li>
                <li><NavLink exact to="/admin/panel/papers"><FcTodoList /> Paper List</NavLink></li>
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
        }
    }
}

export default connect(null, mapDispatchToProps)(AdminSideBar);