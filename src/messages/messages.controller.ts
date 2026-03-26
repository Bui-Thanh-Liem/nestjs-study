import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Logger,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
  private readonly logger = new Logger(MessagesController.name);

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    this.logger.log('create - body:', createMessageDto);
    return this.messagesService.create(createMessageDto);
  }

  @Get()
  findAll(@Query() query: { page: number; limit: number }) {
    this.logger.log('findAll - query:', query);
    return this.messagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log('findOne - id:', id);
    return this.messagesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    this.logger.log('update - id:', id);
    return this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.log('remove - id:', id);
    return this.messagesService.remove(id);
  }
}
