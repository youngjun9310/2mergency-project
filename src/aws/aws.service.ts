import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as multerS3 from 'multer-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AwsService {
  s3Client: S3Client;

  constructor(private configService: ConfigService) {
    // AWS S3 클라이언트 초기화. 환경 설정 정보를 사용하여 AWS 리전, Access Key, Secret Key 설정.
    this.s3Client = new S3Client({
      region: this.configService.get('S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get('S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('S3_SECRET_ACCESS_KEY'),
      },
    });
  }

  async imageUpload(file: Express.Multer.File) {
    try {
      const fileName = uuidv4() + '_' + file.originalname;
      console.log('fileName', fileName);
      const ext = file.originalname.split('.').pop();
      const bucket = this.configService.get('S3_BUCKET');

      // AWS S3에 이미지 업로드 명령을 생성. 파일 이름, 파일 버퍼, 파일 접근 권한, 파일 타입 등을 설정
      const command = new PutObjectCommand({
        Bucket: bucket, // S3 버킷명
        Key: fileName, // 업로드될 파일의 이름
        Body: file.buffer, // 업로드할 파일
        ACL: 'public-read', // 파일 접근 권한
        ContentType: `image/${ext}`, //multerS3.AUTO_CONTENT_TYPE // 파일 타입
      });

      // 생성된 명령을 S3 클라이언트에 전달하여 이미지 업로드
      await this.s3Client.send(command);
      `https://s3.${process.env.S3_REGION}.amazonaws.com/${process.env.S3_BUCKET}/${fileName}`;

      // 업로드된 이미지의 URL 반환
      return fileName;
    } catch (error) {
      console.log('error Message:', error);
      throw new UnauthorizedException(
        '이미지 S3 업로드 과정에서 오류가 발생하였습니다.',
      );
    }
  }
}
