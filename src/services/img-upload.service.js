import axios from 'axios';

export const uploadImg = async (ev) => {
   // Defining our variables
   const CLOUD_NAME = 'or21321' // Insert yours
   const UPLOAD_PRESET = 'or21321_unsigned' // Insert yours
   const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

   const FORM_DATA = new FormData();
   // Building the request body
      FORM_DATA.append('file', ev.target.files[0])
      FORM_DATA.append('upload_preset', UPLOAD_PRESET)
   //  FORM_DATA.append('file', ev.target.files[0])
 
    // Sending a post method request to Cloudniarys' API
    try {
         const res = await axios.post(UPLOAD_URL, FORM_DATA)
         return res.data;
    } catch (err) {
        console.error('ERROR!', err)
    }
}