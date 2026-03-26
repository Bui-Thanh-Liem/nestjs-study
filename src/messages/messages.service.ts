import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessagesRepository } from './messages.repository';

@Injectable()
export class MessagesService {
  constructor(private messagesRepo: MessagesRepository) {}

  async create(createMessageDto: CreateMessageDto) {
    await this.messagesRepo.create(createMessageDto.content);
    return 'Message created successfully';
  }

  async findAll() {
    return await this.messagesRepo.findAll();
  }

  async findOne(id: string): Promise<string> {
    return await this.messagesRepo.findOne(id);
  }

  update(id: string, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  async remove(id: string) {
    return await this.messagesRepo.remove(id);
  }
}
