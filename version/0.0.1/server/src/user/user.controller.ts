//-Path: "motiva/server/src/user/user.controller.ts"
import {
    Get,
    Put,
    Body,
    Post,
    Param,
    Query,
    Delete,
    Controller,
    NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryOptions, ResponseUserDto } from './dto/response-user.dto';

@ApiTags('Users')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @ApiResponse({
        status: 200,
        type: [ResponseUserDto],
        description: 'Success',
    })
    @ApiResponse({
        status: 404,
        type: [ResponseUserDto],
        description: 'Not Found',
    })
    @ApiOperation({
        summary: 'Get all users',
        description: 'Get all users',
    })
    findAll(@Query() querys: QueryOptions) {
        return this.userService.findAll(this.userService.options(querys));
    }

    @Get('id/:id')
    @ApiResponse({
        status: 200,
        type: ResponseUserDto,
        description: 'Success',
    })
    @ApiResponse({
        status: 404,
        type: ResponseUserDto,
        description: 'Not Found',
    })
    @ApiOperation({
        summary: 'Get user by ID',
        description: 'Get user by ID',
    })
    async findOneById(@Param('id') id: string, @Query() querys: QueryOptions) {
        const user = await this.userService.findUser(
            id,
            this.userService.options(querys),
        );
        if (user === null)
            throw new NotFoundException(`User with ID ${id} not found.`);
        return user;
    }

    @Post()
    @ApiResponse({
        status: 200,
        type: ResponseUserDto,
        description: 'Success',
    })
    @ApiResponse({
        status: 404,
        type: ResponseUserDto,
        description: 'Not Found',
    })
    @ApiOperation({
        summary: 'Create user',
        description: 'Create user',
    })
    async create(@Body() body: CreateUserDto) {
        return this.userService.create(body);
    }

    @Put('id/:id')
    @ApiResponse({
        status: 200,
        type: ResponseUserDto,
        description: 'Success',
    })
    @ApiResponse({
        status: 404,
        type: ResponseUserDto,
        description: 'Not Found',
    })
    @ApiOperation({
        summary: 'Update user by ID',
        description: 'Update user by ID',
    })
    async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.userService.update(id, body);
    }

    @Delete('id/:id')
    @ApiResponse({
        status: 200,
        type: ResponseUserDto,
        description: 'Success',
    })
    @ApiResponse({
        status: 404,
        type: ResponseUserDto,
        description: 'Not Found',
    })
    @ApiOperation({
        summary: 'Delete user by ID',
        description: 'Delete user by ID',
    })
    async remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }

    @Delete('ban/:id')
    @ApiResponse({
        status: 200,
        type: ResponseUserDto,
        description: 'Success',
    })
    @ApiResponse({
        status: 404,
        type: ResponseUserDto,
        description: 'Not Found',
    })
    @ApiOperation({
        summary: 'Ban user by ID',
        description: 'Ban user by ID',
    })
    async ban(@Param('id') id: string) {
        return this.userService.ban(id);
    }
}
