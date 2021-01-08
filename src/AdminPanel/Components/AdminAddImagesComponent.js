import React, { useState, useEffect } from 'react'
import { FcAddImage } from 'react-icons/fc'
import $ from 'jquery'
import { useSelector } from 'react-redux'
import LinearProgressWithLabel from './LinearProgressBarWithLabel'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';



const useStyles = makeStyles((theme) => ({
   backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
   },
}));


const AdminAddImagesComponent = () => {
   const mcqReducer = useSelector(state => state.mcqReducer)
   const boardReducer = useSelector(state => state.boardReducer)
   const [open, setOpen] = React.useState(false);
   // Create Progress
   const classes = useStyles();
   const [progress, setProgress] = useState(10);
   useEffect(() => {
      const timer = setInterval(() => {
         setProgress((prevProgress) => (prevProgress >= 90 ? 10 : prevProgress + 7));
      }, 800);
      return () => {
         clearInterval(timer);
      };
   }, []);
   // Upload images
   const upload_imgaes = (files) => {
      handleToggle();
      console.log(files)
      $('.upload-icon').removeClass('hover_image_upload')
      $('.icon-text-box').css({ backgroundColor: '#fff' })
      // const array = new Array(boardReducer[0]);
      // mcqReducer.map((item, i) => {
      //    array.push(item)
      // })
      // const jsonData = JSON.stringify(array);
      // document.write(jsonData)
   }
   // on Drag Enter
   const handleDragEnter = (e) => {
      e.preventDefault();
   }
   // On Drag Over
   const handleDragOver = (e) => {
      e.preventDefault();
      $('.upload-icon').addClass('hover_image_upload')
      $('.icon-text-box').css({ backgroundColor: '#96a599' })
   }
   // On Drag Leave
   const handleDragLeave = (e) => {
      e.preventDefault();
      $('.upload-icon').removeClass('hover_image_upload')
      $('.icon-text-box').css({ backgroundColor: '#fff' })
   }
   // On Dropg images
   const handleDrop = (e) => {
      e.preventDefault();
      let images = e.dataTransfer.files
      // Upload Images function callings
      upload_imgaes(images)

   }
   // On custom add images
   const handleAddImage = (e) => {
      e.preventDefault();
      let images = e.target.files
      // Upload Images function callings
      upload_imgaes(images)
   }
   // progressbra close
   const handleClose = () => {
      setOpen(false);
   };
   //  Propgressbar toogle
   const handleToggle = () => {
      setOpen(!open);
   };

   return (
      <div className="image-uploader-wrapper">
         <div className="display-box">
            <div className="icon-text-box">
               <div className="upload-icon">
                  <FcAddImage className="upload_icon" />
               </div>
            </div>
            <div>
               <input
                  type="file"
                  id="upload-image-input"
                  className="upload-image-input"
                  multiple
                  onDrop={handleDrop}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onChange={handleAddImage}
               />
            </div>
         </div>
         <div>
         </div>
         <Backdrop className={classes.backdrop} open={open}>
            <LinearProgressWithLabel value={progress} />;
      </Backdrop>
         {/* Full Width Progress bar */}
         {/*<div style={{ width: '100%' }} className="Full_Page_Progress">
               <LinearProgressWithLabel value={progress} />
   </div>*/}
      </div>
   );
}




export default AdminAddImagesComponent
