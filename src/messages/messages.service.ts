import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessagesRepository } from './messages.repository';

@Injectable()
export class MessagesService {
  private messageRepo = new MessagesRepository();

  async create(createMessageDto: CreateMessageDto) {
    await this.messageRepo.create(createMessageDto.content);
    return 'Message created successfully';
  }

  async findAll() {
    return await this.messageRepo.findAll();
  }

  async findOne(id: string): Promise<string> {
    return await this.messageRepo.findOne(id);
  }

  update(id: string, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  async remove(id: string) {
    return await this.messageRepo.remove(id);
  }
}
