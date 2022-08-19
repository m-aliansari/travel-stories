import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ReviewRepository } from './repo/review.repository';
import { UserModule } from 'src/user/user.module';
import { TypeOrmExModule } from '../database/typeorm-ex.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([ReviewRepository]),
    UserModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
