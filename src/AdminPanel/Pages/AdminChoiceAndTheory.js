import React from 'react'
import AdminSideBar from '../Components/AdminSideBar'
import {Button } from '@material-ui/core'
import {useHistory, NavLink} from 'react-router-dom'

function AdminChoiceAndTheory() {
    const history = useHistory();
    return (
        <div>
            <AdminSideBar />
            <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
                <div>
                    <Button color="primary" onClick={() => history.push("/admin/panel/add/mcqs")} className="mr-3" variant="contained">Add Multiple Choice Question</Button>
                    <Button color="primary" onClick={() => history.push("/admin/panel/add/theory")}variant="contained">Add Theory Question</Button>
                </div>
            </div>
        </div>
    )
}

export default AdminChoiceAndTheory;
