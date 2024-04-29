import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    // 인증 실패에 대한 특별 처리
    if (status === HttpStatus.UNAUTHORIZED) {

      response.status(401).send(`
          <script>
            alert("로그인을 해주세요.");
            window.location.href = '/auth/users_h/login';
          </script>
        `);
    } else {}    
  }
}