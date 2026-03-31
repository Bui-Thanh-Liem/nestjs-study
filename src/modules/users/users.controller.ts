import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/modules/users/decorator/current-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serializer } from 'src/interceptors/serializer.interceptor';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { SignupUserDto } from './dto/signup-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';

// @UseInterceptors(new SerializerInterceptor(UserDto))
@Serializer(UserDto)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signUp(@Body() signupUserDto: SignupUserDto, @Session() session: any) {
    const user = await this.authService.singUp(
      signupUserDto.email,
      signupUserDto.password,
    );

    session.userId = user.id;
    return user;
  }

  @Post('signin')
  async signIn(@Body() signInDto: SigninUserDto, @Session() session: any) {
    const user = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    session.userId = user.id;
    return user;
  }

  @Post('signout')
  signOut(@Session() session: any) {
    session.userId = null;
    return { message: 'Signed out successfully' };
  }

  @Get('whoami')
  @UseGuards(AuthGuard)
  whoami(@CurrentUser() user: UserEntity) {
    return user;
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);

    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('email') email: string,
  ) {
    console.log('UsersController - findAll');
    return this.usersService.findAll({ page, limit, email });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
