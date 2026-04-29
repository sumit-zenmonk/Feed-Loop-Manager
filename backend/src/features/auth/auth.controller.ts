import { Body, Controller, Post } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/register')
    async registerUser(@Body() body: RegisterDto) {
        return this.authService.registerUser(body);
    }

    @Post('/login')
    async loginUser(@Body() body: LoginDto) {
        return this.authService.loginUser(body);
    }
}