import { HttpException, HttpStatus } from "@nestjs/common";
import { extname } from "path";

//check the file's type
export const imageFileFilter = (req, file, callback) => {
    if (!(String(file.originalname).toLowerCase()).match(/\.(jpg|jpeg|png|gif)$/)) {
    //   return callback(new Error('Only image files are allowed!'), false);
    return callback(new HttpException({status: HttpStatus.FORBIDDEN, error: 'Only image files are allowed!  Types are allowed: jpg|jpeg|png|gif'}, HttpStatus.FORBIDDEN));
    }
    callback(null, true);
  };

  //transform the file name
  export const editFileName = (req, file, callback) => {
    //take the name
    const name = file.originalname.split('.')[0];

    //take the extname
    const fileExtName = extname(file.originalname);
    
    callback(null, `${name}-${randomName()}${fileExtName}`);
  };

  export const randomName = ()=>{
    return Array(8)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  }