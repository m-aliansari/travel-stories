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
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          projectId: process.env.FIREBASE_PROJECT_ID,
        },
        hooks: {
          beforeUpload(req: any, file: any) {
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

  @Get('/image/:reviewId')
  findImage(@Param('reviewId') reviewId: number, @Res() res): any {
    let filename = null;
    const imagename = this.reviewService.getImageByReviewId(Number(reviewId));

    imagename.then(function (result) {
      filename = result.map((image) => {
        return image.Images;
      });
      return res.sendFile(
        join(process.cwd(), 'uploads/review-images/' + filename),
      );
    });
  }
}
