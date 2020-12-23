import React from 'react'
import AdminAddBoardComponent from '../Components/AdminAddBoardComponent'
import AdminSideBar from '../Components/AdminSideBar'
import '../css/AdminAddBoard.css'

function AdminAddBoard() {
    return (
        <div>
            <AdminSideBar />
            <AdminAddBoardComponent />
        </div>
    )
}

export default AdminAddBoard;
