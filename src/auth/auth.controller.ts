// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { RegisterDto } from './dto/register.dto';
// import { LoginDto } from './dto/login.dto';
// import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @ApiTags('users')
//   @ApiOperation({ summary: '유저 생성 API', description: '유저를 생성한다.' })
//   @ApiCreatedResponse({ description: '유저를 생성한다.', type: RegisterDto })
//   @Post('/register')
//   async create(@Body() registerDto: RegisterDto) {
//     return await this.authService.create(registerDto);
//   }

//   @ApiTags('users')
//   @ApiOperation({ summary: '유저 로그인 API', description: '유저 로그인' })
//   @ApiCreatedResponse({ description: '유저 계정으로 로그인', type: LoginDto })
//   @Post('/login')
//   async login(@Body() loginDto : LoginDto) {
//     const token = await this.authService.login(loginDto.email, loginDto.password);
//     return token;
//   }

// }
