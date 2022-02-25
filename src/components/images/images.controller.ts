import { WriteResult } from '@google-cloud/firestore';
import * as fs from 'fs';
import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiResponse } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { uploads } from 'src/consts';
import { CreateImageDtoRequest, FindImageDtoResponse, UpdateImageDtoRequest } from './images.document';
import { ImagesService } from './images.service';
import { editFileName, imageFileFilter, randomName } from './multer-functions';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) { }

  //upload new image
  @Post('upload')
  @ApiResponse({ status: 200, type: [FindImageDtoResponse] })
  //search for key named "images", maximum images per request is 10
  @UseInterceptors(FilesInterceptor('images', 10, {
    storage: diskStorage({
      //save in this folder
      destination: uploads.UPLOAD_IMAGE_DESTINATION,
      //transfoem the filename, see the editFileName in multer-functions file
      filename: editFileName,
    }),
    //check the file's type, see the imageFileFilter in multer-functions file
    fileFilter: imageFileFilter,
  }),
  )
  async uploadFiles(@UploadedFiles() images: Array<Express.Multer.File>
  ): Promise<FindImageDtoResponse[]> {
    const newImages: FindImageDtoResponse[] = [];
    for (let i = 0; i < images.length; i++) {
      const image = await this.imagesService.create({ name: images[i].filename, destination: images[i].destination });
      newImages.push(new FindImageDtoResponse
        (image));
    }
    return newImages;
  }

  //upload path
  @Post('upload/path')
  @ApiResponse({ status: 200, type: FindImageDtoResponse })
  async uploadFilePath(@Body('path') path: string): Promise<FindImageDtoResponse> {
    const newImage = await this.imagesService.create({ name: randomName().toString(), destination: path });
    return new FindImageDtoResponse(newImage);
  }

  //update image by upload a new one
  @Put('update/upload/:uid')
  @ApiResponse({ status: 200, type: FindImageDtoResponse })
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: uploads.UPLOAD_IMAGE_DESTINATION,
      filename: editFileName
    })
  }))
  async uploadFile(@UploadedFile() image: Express.Multer.File,
    @Param('uid') uid: string
  ): Promise<FindImageDtoResponse> {
    await this.imagesService.deleteOne(uid);
    const newImage = await this.imagesService.create({ name: image.filename, destination: image.destination });
    return new FindImageDtoResponse(newImage);
  }

  @Get()
  @ApiResponse({ status: 200, type: [FindImageDtoResponse] })
  async findAll(): Promise<FindImageDtoResponse[]> {
    return await this.imagesService.findAll();
  }

  @Get(':uid')
  @ApiResponse({ status: 200, type: FindImageDtoResponse })
  async findOne(@Param('uid') uid: string):Promise<FindImageDtoResponse> {
    return await this.imagesService.findOne(uid);
  }
  
  @Put('update/path/:id')
  @ApiResponse({ status: 200, type: FindImageDtoResponse })
  async update(@Param('uid') uid: string, @Body() updateImageDto: UpdateImageDtoRequest) {
    return await this.imagesService.updateOne(uid, updateImageDto);
  }

  @Delete(':uid')
  @ApiResponse({ status: 200, type: WriteResult })
  async delete(@Param('uid') uid: string) {
    const image = await this.findOne(uid);
    const path = "upload/images/" + image.name;
    try{
    fs.unlinkSync(path);
    }
    catch(err){
      console.log(err);
    }
    return await this.imagesService.deleteOne(uid);
  }
}
