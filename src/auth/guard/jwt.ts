// import { PassportStrategy } from "@nestjs/passport"
// import { Strategy } from "passport-jwt"
// //import { AuthService } from "../auth.service"
// import { NotFoundException } from "@nestjs/common";


// export class testjwt extends PassportStrategy(Strategy, 'jwt'){
//     constructor(private authService : AuthService){
//         super({
//             useremail : 'email',
//             userpassword : 'password'
//         });
//     }

//     async vaildate(email : string, password : string ){
//         const user = await this.authService.findEmail(email, password);

//         if(!user){
//             throw new NotFoundException("유효하지 않는 접근입니다.");
//         }
//     }
// }