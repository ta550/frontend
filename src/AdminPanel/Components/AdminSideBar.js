import React from 'react'
import {NavLink} from 'react-router-dom'
import {FcHome, FcPlus, FcTodoList} from "react-icons/fc"
import {BsFillCaretRightFill} from 'react-icons/bs'
import '../css/Style.css'
import $ from 'jquery'

function AdminSideBar() {
    
    const sidebar_open = () => {
        $('.Admin_Sidebar').toggleClass("open_sidebar")
        $('.Admin_Sidebar').blur(()=>{
            $(this).toggleClass("open_sidebar")
        })
    }

    return (
        <section className="Admin_Sidebar">
            <ul className="sidebar_ul">
                <li><NavLink exact to="/admin/panel/"><FcHome /> Home</NavLink></li>
                <li><NavLink exact to="/admin/panel/add/board"><FcPlus /> MCQs Paper</NavLink></li>
                <li><NavLink exact to=""><FcTodoList /> MCQs Paper List</NavLink></li>
            </ul>
            <BsFillCaretRightFill className="sidebar_open_icon" onClick={sidebar_open} />
        </section>
    )
}

export default AdminSideBar;