import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RemoveDto } from '../../common/dtos/embedded/remove.dto';
import { IdDto } from '../../common/dtos/id.dto';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() PaginationDto: PaginationDto) {
    return this.usersService.findAll(PaginationDto);
  }

  @Get(':id')
  findOne(@Param('id') { id }: IdDto) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') { id }: IdDto, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') { id }: IdDto, @Query() { soft }: RemoveDto) {
    return this.usersService.remove(+id, soft);
  }
  @Patch(':id/recovery')
  recovery(@Param() { id }: IdDto) {
    return this.usersService.recovery(id);
  }
}
