import React from 'react'
import AdminAddImagesComponent from '../Components/AdminAddImagesComponent';
import AdminSideBar from '../Components/AdminSideBar';
import '../css/AdminAddImage.css'
function AdminAddImages() {
    return (
        <div>
            <AdminSideBar />
            <AdminAddImagesComponent />
        </div>
    )
}

export default AdminAddImages
