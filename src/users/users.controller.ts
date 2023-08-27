import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto,UpdateUserDto, FilterUsersDto } from './dto';
import { MongoPipe } from 'src/common/pipes/mongo-id.pipe';
import { JwtAuthAccessGuard } from 'src/iam/guards/jwt-auth-access.guard';
import { isPublic } from 'src/iam/decorators/is-public.decorator';




@UseGuards(JwtAuthAccessGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  
  @Post('create')
  async create(@Body() payload: CreateUserDto) {
    return await this.usersService.create(payload);
  }
  
  //@isPublic()
  @Get()
  async findAll(@Query() params?: FilterUsersDto) {
    return await this.usersService.findAll(params);
  }

  @Get(':id')
  async findOne(@Param('id', MongoPipe) id: string) {
    return await this.usersService.findOne(id)

  }

  @Put(':id')
  async update(@Param('id', MongoPipe) id: string, @Body() payload: UpdateUserDto) {
    return await this.usersService.update(id, payload);
  }

  /* ELIMINACION LOGICA */
  @Put('delete/:id')
  async delete(@Param('id', MongoPipe) id: string) {
    return await this.usersService.delete(id);
  }

  /* ELIMINACION FISICA */
  @Delete(':id')
  async remove(@Param('id', MongoPipe) id: string) {
    return await this.usersService.remove(id);
  }
}
