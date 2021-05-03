import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
  Request,
  Logger,
  Response,
  Get,
  HttpCode,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { User } from './auth.entity';
import { DoesUserExist } from './guards/DoesUserExist';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { upload } from './uploadimage';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Sign Up
  @UseGuards(DoesUserExist)
  @Post('signup')
  async signUp(@Body() user: User) {
    try {
      return this.authService.register(user);
    } catch (error) {
      Logger.log(error);
      return false;
    }
  }

  @UseGuards(DoesUserExist)
  @Post('signup/:refUrl')
  async signUpWithRef(@Request() request, @Body() user: User) {
    try {
      const refUrl = request.params.refUrl;
      return this.authService.registerWithRef(user, refUrl);
    } catch (error) {
      Logger.log(error);
      return false;
    }
  }

  // Sign In
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @HttpCode(200)
  async signIn(@Request() request) {
    try {
      return this.authService.login(request.user);
    } catch (error) {
      Logger.log(error);
      return false;
    }
  }

  // Update avatar
  @Put('profile/avatar/')
  @UseGuards(JwtAuthGuard)
  async updateProfileAvatar(
    @Body() user: User,
    @Response() response,
    @Request() request,
  ) {
    try {
      const singleUpload = upload.single('avatar');
      await singleUpload(request, response, (err) => {
        if (err) {
          return response.status(422).send({
            errors: [{ title: 'File Upload Error', detail: err.message }],
          });
        }
        user.avatar = request.file.location;
        this.authService.updateUserById(request.user.id, user);
        return response.json(user);
      });
    } catch (error) {
      Logger.log(error);
      return false;
    }
  }

  // Update profile
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Body() user: User,
    @Response() response,
    @Request() request: any,
  ) {
    try {
      this.authService.updateUserById(request.user.id, user);
      return response.json(user);
    } catch (error) {
      Logger.log(error);
      return false;
    }
  }

  // Get Me
  @Get('getMe')
  @UseGuards(JwtAuthGuard)
  public async getProfile(@Request() request: any): Promise<any> {
    try {
      return this.authService.findOneById(request.user.id);
    } catch (error) {
      Logger.log(error);
      return false;
    }
  }

  @MessagePattern({ role: 'user', cmd: 'get' })
  async getProfileById(id): Promise<User> {
    return this.authService.findOneById(id);
  }

  @MessagePattern({ role: 'auth', cmd: 'check' })
  async loggedIn(data) {
    try {
      const res = this.authService.validateToken(data.jwt);
      return res;
    } catch (e) {
      Logger.log(e);
      return false;
    }
  }
}
