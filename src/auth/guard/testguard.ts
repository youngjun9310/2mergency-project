import { AuthGuard } from "@nestjs/passport";

export class testguard extends AuthGuard('jwt'){}