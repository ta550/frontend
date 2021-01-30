import React, {useEffect, useState} from 'react'
import '../css/Style.css'
// import { IconButton, Input , InputLabel , InputAdornment , FormControl, TextField } from '@material-ui/core';
// import { Visibility , VisibilityOff } from '@material-ui/icons';
import { useHistory } from 'react-router-dom'
import { connect , useSelector } from 'react-redux'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button , TextField} from '@material-ui/core'
import Slide from '@material-ui/core/Slide';
// import axios from 'axios'


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function AdminIndex(props) {
    const [values, setValues] = useState({
        username: '',
        password: '',
        useremail: '',
        showPassword: false,
    });
    const [DialogStatus, setDialogStatus] = React.useState(false);


    const history = useHistory();
    const loginReducer = useSelector(state => state.loginReducer)
    useEffect(()=> {
        if (loginReducer){
            history.push("/admin/panel/papers")
        }
    }, [])


    const handleChange = (prop) => (e) => {
        setValues({ ...values, [prop]: e.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (e) => {
        e.preventDefault();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        

        if (values.username === "jon" && values.useremail === "abc@efg.xyz") {
            props.set_login("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
            history.push("/admin/panel/papers")
        }else {
            setDialogStatus(true)
        }

        // axios({
        //     method: 'post',
        //     url: '/login',
        //     headers: {
        //       'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        //     },
        //     data: `username=${values.username}&useremail=${values.password}`,
        //   })
        //   .then(res => {
        //       props.set_login(res.data.token);
        //       history.push("/admin/panel/papers")
        //   })
        //   .catch(err => 
        //     setDialogStatus(true)
        //   )
        
    }


    return (
        <section className="admnh_login_main">
            <form class="admin_login_form py-4" onSubmit={handleSubmit}>
                <h2 className="text-center mb-5">Admin Login</h2>
                <div style={{ width: '60%', margin: '5px auto', display: 'flex' }}>
                    <TextField onChange={handleChange("username")} value={values.username} id="standard-basic" label="User Name" className="AdminUserField w-100" type="text" required />
                </div><br />
                <div style={{ width: '60%', margin: '0x auto', display: 'flex' }}>
                    <TextField onChange={handleChange("useremail")} value={values.useremail} id="standard-basic" label="User Email" className="AdminUserField w-100" type="text" required />
                </div><br />
                {/* <FormControl style={{ width: '60%', margin: '0 auto', display: 'flex' }} variant="fille">
                    <InputLabel htmlFor="filled-adornment-password">Password *</InputLabel>
                    <Input
                        id="filled-adornment-password"
                        type={values.showPassword ? 'text' : 'password'}
                        required
                        value={values.password}
                        onChange={handleChange('password')}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                    /><br /><br />
                </FormControl> */}
                <Button type="submit" variant="contained" className="mx-auto my-4 d-flex px-5 py-2" color="primary">
                    Log In
                </Button>
            </form>
            <Dialog
                open={DialogStatus}
                TransitionComponent={Transition}
                keepMounted
                maxWidth="xs"
                fullWidth="true"
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title" className="py-3 text-center h3">Error</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Please Enter Valid Username or Password
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogStatus(false)} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </section>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        set_login: (token) => {
            dispatch({type: 'login', token: token})
        }
    }
}

export default connect(null, mapDispatchToProps)(AdminIndex)
