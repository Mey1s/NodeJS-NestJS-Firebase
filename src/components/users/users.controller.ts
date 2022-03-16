import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, forwardRef, Inject, Req, Request } from '@nestjs/common';
import { CreateUserDtoRequest, FindUserDtoResponse, UpdateUserDtoRequest } from './users.document';
import { UsersService } from './users.service';
import { LocalAuthGuard } from 'src/usersAuth/local-auth.guard';
import { AuthService } from 'src/usersAuth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) { }

  @Delete(':uid')
  async deleteOne(@Param('uid') uid: string): Promise<FirebaseFirestore.WriteResult> {
    return await this.usersService.deleteOne(uid);
  }

  @Put(':uid')
  async updateOne(@Param('uid') uid: string, @Body() updateUser: UpdateUserDtoRequest): Promise<FindUserDtoResponse> {
    return await this.usersService.updateOne(uid, updateUser);
  }

  @Get('details')
  async getOne(@Req() req: Express.Request): Promise<FindUserDtoResponse> {
    const user =  await this.usersService.findOne(req.uid);
    return new FindUserDtoResponse(user);
  }

  //by id/email/phone number
  // @Get(':serach')
  // async getOne(@Param('serach') serach: string): Promise<FindUserDtoResponse> {
  //   const user =  await this.usersService.findOne(serach);
  //   return new FindUserDtoResponse(user);
  // }

  @Get()
  async getAll(@Body('userFields') userFields: Partial<FindUserDtoResponse>[] = []): Promise<FindUserDtoResponse[]> {
    return await this.usersService.findAll(userFields);
  }

  @Post()
  async create(@Body() user: CreateUserDtoRequest): Promise<FindUserDtoResponse> {
    return await this.usersService.create(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    //we get the req.user from the guard
    const token = await this.authService.login(req.user);
    return token.accessToken;
  }
}
