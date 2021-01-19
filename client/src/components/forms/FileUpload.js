import React from 'react';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';
import {Avatar,Badge} from 'antd'
import { useSelector } from 'react-redux';
const FileUpload = ({ values, setValues }) => {
  const { user } = useSelector((state) => ({ ...state }));
const handleImageRemove=(public_id)=>{
axios.post(`${process.env.REACT_APP_API}/removeimage`,{public_id},
{
  headers: {
    authtoken:user?user.token:""
  }
})
.then((res)=>{
const {images}=values
let filteredImages=images.filter((item)=>{
  return item.public_id !== public_id})
  setValues({...values,images:filteredImages})

})
.catch((err)=>{
console.log(err)
})
}
  const fileUploadAndResize = (e) => {
    let files = e.target.files;
    let allUploadedFiles = values.images;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        Resizer.imageFileResizer(
          files[i],
          720,
          720,
          'JPEG',
          100,
          0,
          (uri) => {
            axios
              .post(
                `${process.env.REACT_APP_API}/uploadimages`,
                { image: uri },
                {
                  headers: {
                    authtoken: user ? user.token : '',
                  },
                }
              )
              .then((res) => {
                console.log(res);
                allUploadedFiles.push(res.data);
                setValues({ ...values, images: allUploadedFiles });
              })
              .catch((err) => console.log(err));
          },
          'base64',720,720
        );
      }
    }
  };
  return (
    <div>
    {values.images&& values.images.map((im)=>(
      <span style={{marginRight:"2rem"}} key={im.public_id}>
      <Badge style={{cursor:"pointer"}}  count="x" onClick={()=>handleImageRemove(im.public_id)}>
<Avatar shape="square"  src={im.url} size={40}/>
</Badge>
</span>
    ))}
    <div className="file-upload">
      <label className='choose-file'>
        Choose file
        <input
          hidden
          type='file'
          multiple
          accept='images/*'
          onChange={fileUploadAndResize}
        />
      </label>
    </div>
    </div>
  );
};

export default FileUpload;
