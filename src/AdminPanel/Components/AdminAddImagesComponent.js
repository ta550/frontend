import React, { useState } from 'react'
import { FcAddImage } from 'react-icons/fc'
import $ from 'jquery'
import { useSelector } from 'react-redux'

const AdminAddImagesComponent = () => {
   const mcqReducer = useSelector(state => state.mcqReducer)
   const boardReducer = useSelector(state => state.boardReducer)

   // Upload images
   const upload_imgaes = (files) => {
      console.log(files)
   }

   const handleDragEnter = (e) => {
      e.preventDefault();
   }
   const handleDragOver = (e) => {
      e.preventDefault();
      $('.upload-icon').addClass('hover_image_upload')
      $('.icon-text-box').css({ backgroundColor: '#96a599' })
   }
   const handleDragLeave = (e) => {
      e.preventDefault();
      $('.upload-icon').removeClass('hover_image_upload')
      $('.icon-text-box').css({ backgroundColor: '#fff' })
   }
   const handleDrop = (e) => {
      e.preventDefault();
      let images = e.dataTransfer.files
      // Upload Images function callings
      upload_imgaes(images)
      $('.upload-icon').removeClass('hover_image_upload')
      $('.icon-text-box').css({ backgroundColor: '#fff' })
      const array = new Array(boardReducer[0]);
      mcqReducer.map((item, i) => {
         array.push(item)
      })
      const jsonData = JSON.stringify(array);
      document.write(jsonData)
   }
   const handleAddImage = (e) => {
      e.preventDefault();
      let images = e.target.files
      // Upload Images function callings
      upload_imgaes(images)
      const array = new Array(boardReducer[0]);
      mcqReducer.map((item, i) => {
         array.push(item)
      })
      const jsonData = JSON.stringify(array);
      document.write(jsonData)
   }


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
      </div>
   );
}




export default AdminAddImagesComponent
