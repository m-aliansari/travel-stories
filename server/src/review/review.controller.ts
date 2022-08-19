/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseInterceptors,
  Res,
  UploadedFiles,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import * as FirebaseStorage from 'multer-firebase-storage';

export const FIREBASE_BUCKET_URL = process.env.FIREBASE_BUCKET_URL;
export const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;
export const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY;
export const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;

export let storage = {};

@Controller('review')
@ApiTags('Review')
@ApiSecurity('JWT-auth')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {
    storage = {
      storage: FirebaseStorage({
        bucketName: process.env.FIREBASE_BUCKET_URL,
        directoryPath: 'images',
        credentials: {
          //   clientEmail:
          //     'firebase-adminsdk-zhgmw@travel-stories-c7474.iam.gserviceaccount.com',
          //   privateKey:
          //     '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCsv/UkZXMuavXc\nn7SVlCMu1o45XVtIBo1BL0VJeruqz1IIOZIo1JzhaWuiGRGxRwdSSOhj3VSWf4XD\nkau7kJnLzHM8SHtsjz1MvuNqLAmOZYVII9WRXR+Qx7GLnZbErgwwLZyvfXB+npaX\n3SGmexPzwnRIBaEk3NHXp4mm4i0sR4ksCbqSbIA2y2XjeebXwwcQNI/c9GDYAQrk\nsBN2CsDFfDIVODnXBbHbp7rBJhKyHVKXrAJ5drOKI3nIz3U6NOFAWpKd0WtrMH2H\nAHY+L3bfoDlKBd2+KmOu2MQd920koGzmMssWVQLthIOTQsrG1HW2W3Q8HwtgwS27\nhpznI8CtAgMBAAECggEABsRO2Xn3Mj0dXA2OI4KAgvquP+AAzd2igIhV/06v9ZJr\nxQe1n899ml998wURX4TdQWNlZa1gqAk0bQM9Rg/K086ylYzEokLVegv2LjgDDdFl\n5aawXHfYidwl/8aQsSvyLUb0HsmxSOcfFgbNpSRSv+yA5TtXOHGamgclig8iXtwZ\nNFBO3g7JVNKE8lvpEdBVhksEkn8FQ3t40EXdPrDcePowhcHO3xzGw+Mx63+8SuUH\nbHMDiHaQRLYZRkYpbVyxMr7MpM447L0HrW+jBaiiWVr1Ok8Ob693e4Y9Rm21PRnN\nCvCBQTw1or2CyiFERJE/3GkEikJNYArFHwTSD+Qx/wKBgQDxK/x+AVMqIiKLguiD\n27l4dhtC0DEz1ibnEj3t58E3av9QXomtWV8Pl4apsVBvosspMMAhts41MI9iq7Vg\nM2zs6WE9USKnL9GewF3ngmkxkKBINdZuzF3Elowd/M1ComD3C8jO0Lcptxj6kPvF\nVfTqLD/mRHaFrgko6GEh2Mt8XwKBgQC3XwSXuZqAng55l/oiRs3oJ7s+koMUSvUN\nOjzPl0jnwV3vXTMD3VW9Par7r4WdeqesgPzulzQYo/eDbFYgkznYo+RnI5xtnJYX\nOKaqub90qREioU/RdhJxSmuVGAI6USXmoU1t5YGB5TdPzhFl9DhvzRlQ2BzESdkP\nXcwjrfBecwKBgQCxytWXJu7ibsu8wcMcAg3XKmqqdMTxC/0d+CrDiki8zBpwa2Ff\n9DTKT9CspNVBl2fic9gQgq2+NJBgE2nhA8hXVy2igH/ldLE6MWKI23ElYxNmaJou\nkGbIGJwvN0Ey0HZfacaeAOwmyp6VifCx585oHDr3TJ17q3OBPt7sjuBkTQKBgQCx\nrWH32iH46i3AaCA4wj6V6pmmQbS9HvxfOsTdqQs9dMIeQ0JBRl/jpDNe+G4Rb120\n6q8qSFx0W7xjHcA+hCmS3wtbXMgf9ZABJCVqW91FnuQ5l/CNV0j7eU7RAph2BVci\nJ72s9KsOQBnePB/jmEZvHl6fVShakeu+1fYNxGaaPQKBgEmSC5h/0XOTVdOXqE7n\naYVqpGiaJxXu+JgPSHSQmIlsMu32O86w8JBkaLDS5oaPTo65cQIfkSvAB/ljYh2v\nZqQ+2y3M5TcP/6l/1j7lMWDvkqNAhD4bDqGESlFarfvC0pRviXq8jealBwv0G1Mq\nwCEaVH+0gvUO31L+0+7vdmuZ\n-----END PRIVATE KEY-----\n',
          //   projectId: 'travel-stories-c7474',
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          projectId: process.env.FIREBASE_PROJECT_ID,
        },
        hooks: {
          beforeUpload(req, file) {
            const splitted: string[] = file.originalname.split('.');
            file.originalname =
              splitted[0].replace(/\s/g, '') + uuidv4() + '.' + splitted[1];
          },
        },
      }),
    };
  }

  @Post(':userId')
  @UseInterceptors(FilesInterceptor('Images', 10, storage))
  create(
    @UploadedFiles() files: Array<any>,
    @Param('userId') userId: number,
    @Body(ValidationPipe) body: any,
  ) {
    const fileNames: string[] = files.map((f) => f.originalname);

    console.log(fileNames);

    return this.reviewService.create(body, userId, fileNames);
  }

  @Get()
  allReviews() {
    return this.reviewService.allReviews();
  }

  @Get('/myReviews/:userId')
  findMyReviews(@Param('userId') userId: number) {
    return this.reviewService.myReviews(Number(userId));
  }

  // @Get('/myFavoriteReviews/:userId')
  // findMyFavoriteReviews(@Param('userId') userId: number) {
  //   return this.reviewService.myFavoriteReviews(Number(userId));
  // }
  @Get('/myFavoriteReviews/')
  findMyFavoriteReviews() {
    return this.reviewService.myFavoriteReviews();
  }

  //Get Review by review id
  @Get(':id')
  findReviewById(@Param('id') id: number) {
    return this.reviewService.findReviewById(Number(id));
  }

  //Edit Review
  @Patch(':reviewid')
  @UseInterceptors(FilesInterceptor('Images', 10, storage))
  updateReview(
    @Body(ValidationPipe) body: any,
    @UploadedFiles() files: Array<any>,
    @Param('reviewid') reviewid: number,
  ) {
    const fileNames: string[] | undefined = files?.map((f) => f.originalname);
    console.log(fileNames);
    return this.reviewService.updateReview(Number(reviewid), body, fileNames);
  }

  //Mark Favorite
  @Patch('/markFavorite/:reviewId')
  update(@Param('reviewId') reviewId: number) {
    return this.reviewService.update(Number(reviewId));
  }

  @Patch('/removeFavorite/:reviewId')
  removeFavorite(@Param('reviewId') reviewId: number) {
    return this.reviewService.removeFavorite(Number(reviewId));
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.reviewService.remove(Number(id));
  }

  // @Post('image/upload/:reviewId')
  // @UseInterceptors(FileInterceptor('photo', storage))
  // uploadFile(@UploadedFile() file, @Param('reviewId') reviewId: number): any {
  //   // console.log(reviewId);
  //   // console.log(file.filename);

  //   return this.reviewService.uploadImage(
  //     Number(reviewId),
  //     String(file.filename),
  //   );
  // }

  // @Post('image/upload')
  // @UseInterceptors(FilesInterceptor('files'))
  // uploadFile(
  //   @UploadedFiles() files: Array<Express.Multer.File>,
  //   @Param('reviewId') reviewId: number,
  // ) {
  //   console.log(files);
  //   return this.reviewService.uploadImage(Number(reviewId), files);
  // }

  @Get('/image/:reviewId')
  findImage(@Param('reviewId') reviewId: number, @Res() res): any {
    let filename = null;
    const imagename = this.reviewService.getImageByReviewId(Number(reviewId));
    console.log('imagename :: ', +imagename);

    imagename.then(function (result) {
      filename = result.map((image) => {
        return image.Images;
      });
      console.log('filename :: ', +filename);
      return res.sendFile(
        join(process.cwd(), 'uploads/review-images/' + filename),
      );
    });
  }
}
