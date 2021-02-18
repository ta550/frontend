import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import { useSelector } from 'react-redux'
import DatePicker from "react-datepicker";
import ModelNotification from '../../../Modals/ModelNotification'



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


function DialogModalMetaData(props) {
  const [open, setOpen] = React.useState(props.DialogStatus);
  const loginReducer = useSelector(state => state.loginReducer)
  const { callUseEffect } = props;
  
  const [startDate, setStartDate] = useState(new Date());
  const [notificationStatus, setNotificationStatus] = useState(false)
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
      fetch(`/dashboard/de/metadata/${props.id}`,{
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loginReducer}`
        },
        body: JSON.stringify(paper)
      })
      .then(res => res.json())
      .then(res => {
        props.handleClose();
        callUseEffect();
      })
      .catch(err => console.log(err))
  }

  
  React.useEffect(() => {
    setOpen(props.DialogStatus)
    setPaper(props.data)
    let year = props.data.year;
    let month = props.data.month;
    let monthNumber = "";
      switch(month){
          case "January":
              monthNumber= 0
              break;
          case "February":
              monthNumber= 1;
              break;
          case "March":
              monthNumber= 2;
              break;
          case "April":
              monthNumber= 3;
              break;
          case "May":
              monthNumber= 4;
              break;
          case "June":
              monthNumber= 5;
              break;
          case "July":
              monthNumber= 6;
              break;
          case "August":
              monthNumber= 7;
              break;
          case "September":
              monthNumber= 8;
              break;
          case "October":
              monthNumber= 9;
              break;
          case "November":
              monthNumber= 10;
              break;
          case "December":
              monthNumber= 11;
              break;
          default:
              monthNumber=1
              year = 2020
      }
    const newDate = new Date(year, monthNumber)
    setStartDate(newDate)
  }, [props.DialogStatus])

  const change_input = (e) => {
      setPaper({...paper, [e.target.name]: e.target.value})
  }

  const change_month_and_year = (date) => {
      setStartDate(date)
      const monthNumber = date.getMonth();
      const year = date.getFullYear();
      var month = "";
      switch(monthNumber.toString()){
          case "0":
              month="January";
              break;
          case "1":
              month="February";
              break;
          case "2":
              month="March"
              break;
          case "3":
              month="April"
              break;
          case "4":
              month="May"
              break;
          case "5":
              month="June"
              break;
          case "6":
              month="July"
              break;
          case "7":
              month="August"
              break;
          case "8":
              month="September"
              break;
          case "9":
              month="October"
              break;
          case "10":
              month="November"
              break;
          case "11":
              month="December"
              break;
          default:
              alert("please try again")
      }
      setPaper({...paper, year: year.toString(), month: month})
  }

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        fullWidth="true"
        maxWidth="sm"
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent className="px-5">
                <form className="board_form mx-auto" onSubmit={submit_data}>
                    <div className="form-group">
                        <label htmlFor="">Enter System :</label>
                        <input type="text" autoFocus className="form-control" name="system" onChange={change_input} value={paper.system} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Enter Board :</label>
                        <input type="text" className="form-control" onChange={change_input} name="board" value={paper.board} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Enter Subject :</label>
                        <input type="text" className="form-control" onChange={change_input} name="subject" value={paper.subject} required/>
                    </div>
                    <div className="form-group datepicker_main">
                        <label htmlFor="">Select Year And Month :</label><br />
                        <DatePicker className="form-control w-100" selected={startDate} showMonthYearPicker peekNextMonth onChangeRaw={e => e.preventDefault()} onFocus={e => e.preventDefault()} onKeyDown={e => e.preventDefault()} disabledKeyboardNavigation dateFormat="MMMM yyyy" onChange={change_month_and_year} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Enter Series :</label>
                        <input type="text" className="form-control" onChange={change_input} name="series" value={paper.series} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Enter Paper:</label>
                        <input type="text" className="form-control" onChange={change_input} name="paper" value={paper.paper} required/>
                    </div>
                    <div className="form-group justify-content-center d-flex">
                        <button type="submit" className="btn px-5 py-2 bg-info mybutton">Submit</button>
                    </div>
                </form>
            <ModelNotification DialogStatus={notificationStatus} DialogTitle="Notification" DialogDesc="Please Select Year and month." handleClose={() => setNotificationStatus(false)} DialogOk="Ok" />
        </DialogContent>
        <DialogActions>

        </DialogActions>
      </Dialog>
    </div>
  );
}


export default DialogModalMetaData;