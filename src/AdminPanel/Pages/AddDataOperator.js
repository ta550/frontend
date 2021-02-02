import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useSelector } from 'react-redux'
import { FcEditImage, FcDeleteDatabase } from "react-icons/fc";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ConfirmDialog from "../Components/ConfirmDialog";
import $ from 'jquery'


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const DataOperatorUI = () => {
    const loginReducer = useSelector(state => state.loginReducer)
    const [data, setData] = useState({
        username: "",
        email: ""
    })
    const [rows, setRows] = React.useState([])
    const [openSnakBar, setOpenSnakBar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("")
    const [confirmDialogStatus, setConfirmDialogStatus] = React.useState(false)
    const [confirmDialogDesc, setConfirmDialogDesc] = React.useState(false)
    const [callUseEffect, setCallUseEffect] = useState(false)

    // Get Operator Data
    React.useEffect(() => {
        fetch("/superuser/operators")
        .then(res => res.json())
        .then(res => {
            if (res.message) {
                setRows([])
            }else {
                setRows(res)
            }
        })
        .catch(err => console.log(err))
    },[callUseEffect])


    // Call Use Effect 
    const fetchData = () => {
        if (callUseEffect){
            setCallUseEffect(false)
        }else {
            setCallUseEffect(true)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("/superuser/operator", {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(data),
        })
        .then(res => res.json())
        .then(res => {
            setSnackbarMessage("Operator Added Successful!")
            setOpenSnakBar(true)
            setData({ username: "", email: "" })
            fetchData();
        })
        .catch((err) => console.log(err))
    }

    const handleChange = (e, name) => {
        setData({ ...data, [name]: e.target.value })
    }



    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenSnakBar(false);
      };

    const setOperatorData = (id) => {
        rows.map((item ,i )=> {
            if (item.id == id) {
                window.updateId = item.id;
                setData({username: item.username, email: item.email})
                // Update Button Show
                $('.updateButton').removeClass("d-none")
                $('.updateButton').addClass('d-flex')
                // Add Button Hide
                $('.addButton').addClass("d-none")
                $('.addButton').removeClass("d-flex")
            }
        })
    }

    const updateOperator = (id) => {
        if (window.updateId !== "") {
        const body = {
            id: window.updateId,
            username: data.username,
            email: data.email
        
        }  
        fetch(`/superuser/operator/${window.updateId}`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(body),
        })
        .then(res => res.json())
        .then(res => {
            if (res !== 0){
                setSnackbarMessage("Operator Updated Successful!")
                setOpenSnakBar(true)
                // Update Button Hide
                $('.updateButton').removeClass("d-flex")
                $('.updateButton').addClass('d-none')
                // Add Button Show
                $('.addButton').addClass("d-flex")
                $('.addButton').removeClass("d-none")
                setData({ username: "", email: ""})
                fetchData();
            }
        })
        .catch((err) => console.log(err))
        window.updateId = ""
    }
}

    const openConfirmDialog = (id) => {
        window.deleteId = id;
        setConfirmDialogDesc("Are you sure you want to delete this field!")
        setConfirmDialogStatus(true)
    }

    const deleteOperator = () => {
        if (window.deleteId === "") {
            alert('Some went wrong please try again')
        }else {
            fetch(`/superuser/operator/${window.deleteId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': "application/json"
                }
            })
            .then(res => res.json())
            .then(res => {
                setConfirmDialogStatus(false)
                setSnackbarMessage("Operator Deleted Successful!")
                setOpenSnakBar(true)
                fetchData();
            })
            .catch((err) => console.log(err))
            window.deleteId = ""
        }
    }


    return (
        <div className="container-fluid py-5" style={{ background: '#E5E5E5', minHeight: '100vh' }}>
            <div className="row">
                <div className="col-md-4">
                    <form onSubmit={handleSubmit} className="py-4 rounded bg-white">
                        <h2 className="text-center">Add Operator</h2><br />
                        <TextField type="text" value={data.username} onChange={(e) => handleChange(e, "username")} id="standard-basic" label="User Name" className="mx-auto d-flex" style={{ width: '80%' }} required /><br />
                        <TextField type="email" value={data.email} onChange={(e) => handleChange(e, "email")} id="standard-basic" label="User Email" className="mx-auto d-flex" style={{ width: '80%' }} required />
                        <Button type="submit" variant="contained" color="primary" className="mx-auto addButton d-flex mt-5">Add</Button>
                        <Button variant="contained" color="primary" onClick={updateOperator} className="d-none updateButton mx-auto mt-5">Update</Button>
                    </form>
                </div>
                <div className="col-md-8">
                    <div className="rounded bg-white">
                        <h1 className="text-center m-0 shadow border py-4">All Operators</h1>
                        <TableContainer className="pb-3" component={Paper} style={{ maxHeight: "70vh", overflowY: 'scroll' }}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="border font-weight-bold" align="center">User Name</TableCell>
                                        <TableCell className="border font-weight-bold" align="center">User Email</TableCell>
                                        <TableCell className="border font-weight-bold" colSpan="2" align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row, index) => (
                                        <TableRow key={row.name}>
                                            <TableCell className="border" align="center">
                                                {row.username}
                                            </TableCell>
                                            <TableCell className="border" align="center">{row.email}</TableCell>
                                            <TableCell className="border" align="center"><FcEditImage onClick={() => setOperatorData(row.id)} style={{ cursor: 'pointer', fontSize: "23px" }} /></TableCell>
                                            <TableCell className="border" align="center"><FcDeleteDatabase onClick={() => openConfirmDialog(row.id)} style={{ cursor: 'pointer', fontSize: "23px" }} /></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>


            {/* Snak Bar */}

            <Snackbar open={openSnakBar} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Model For Information */}

            {/*   Confirm Dialog Box   */}
            <ConfirmDialog delete_mcq_by_id={deleteOperator} ConfirmDialog={confirmDialogStatus} ConfirmDesc={confirmDialogDesc} handleClose={() => setConfirmDialogStatus(false)} />
        </div>
    )
}

export default DataOperatorUI;