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
import { NavLink } from 'react-router-dom'
import { FcEditImage , FcDeleteDatabase } from "react-icons/fc";

const DataOperatorUI = () => {
    const loginReducer = useSelector(state => state.loginReducer)
    const [data, setData] = useState({
        username: "",
        useremail: ""
    })
    function createData(username,useremail,edit,del) {
        return { username, useremail, edit, del };
    }

    const rows = [
        createData("username","useremail"),
        createData("username","useremail"),
        createData("username","useremail"),
        createData("username","useremail"),
        createData("username","useremail"),
        createData("username","useremail"),
        createData("username","useremail"),
        createData("username","useremail"),
        createData("username","useremail"),
        createData("username","useremail"),
        createData("username","useremail"),
        createData("username","useremail"),
        createData("username","useremail"),
        createData("username","useremail"),
        createData("username","useremail"),
        createData("username","useremail"),
        createData("username","useremail"),
        createData("username","useremail"),
        createData("username","useremail"),
        createData("username","useremail"),
        createData("username","useremail"),
        createData("username","useremail"),
    ];

    const handleSubmit = (e) => {
        setData({username: "", useremail: ""})
        e.preventDefault();
        alert('Successful Added')
        // fetch("/superuser/add_operator",{
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': "application/json",
        //         'Authorization': `Bearer ${loginReducer}`
        //     },
        //     body: JSON.stringify(data),
        // })
        // .then(res => res.json())
        // .then(res => {
        //     console.log(res)
        //     console.log(data)
        // })
        // .catch((err)=> console.log(err))

    }

    const handleChange = (e, name) => {
        setData({...data, [name]: e.target.value})
    }



    return (
        <div className="container-fluid py-5" style={{ background: '#E5E5E5', minHeight: '100vh' }}>
            <div className="row">
                <div className="col-md-4">
                    <form onSubmit={handleSubmit} className="py-4 rounded bg-white">
                        <h2 className="text-center">Add Operator</h2><br />
                        <TextField value={data.username} onChange={(e) => handleChange(e,"username")} id="standard-basic" label="User Name" className="mx-auto d-flex" style={{ width: '80%' }} required /><br />
                        <TextField value={data.useremail} onChange={(e) => handleChange(e, "useremail")} id="standard-basic" label="User Email" className="mx-auto d-flex" style={{ width: '80%' }} required />
                        <Button type="submit" variant="contained" color="primary" className="mx-auto d-flex mt-5">Add</Button>
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
                                            <TableCell className="border" align="center">{row.useremail}</TableCell>
                                            <TableCell className="border" align="center"><FcEditImage onClick={() => alert(index)}  style={{ cursor: 'pointer', fontSize: "23px" }} /></TableCell>
                                            <TableCell className="border" align="center"><FcDeleteDatabase onClick={() => alert(index)} style={{ cursor: 'pointer', fontSize: "23px" }} /></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DataOperatorUI;