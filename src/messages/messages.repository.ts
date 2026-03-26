import { readFile, writeFile } from 'fs/promises';

export class MessagesRepository {
  private pathDb =
    '/Users/nguyenducnghia/liemdev/study/nestjs/src/db/messages.json';

  async create(content: string) {
    const contents = await readFile(this.pathDb, 'utf-8');
    const messages = JSON.parse(contents) as Record<string, string>[];

    const id = Math.random() * 999;
    messages[id] = { id: String(id), content };

    // TODO: write file
    await writeFile(this.pathDb, JSON.stringify(messages), 'utf-8');
  }

  async findAll() {
    const contents = await readFile(this.pathDb, 'utf-8');
    const messages = JSON.parse(contents) as Record<string, string>;
    return Object.values(messages);
  }

  async findOne(id: string): Promise<string> {
    const contents = await readFile(this.pathDb, 'utf-8');
    const messages = JSON.parse(contents) as Record<string, string>;
    return messages[id];
  }

  update(id: string, content: string) {
    return `This action updates a #${id} message`;
  }

  async remove(id: string) {
    const contents = await readFile(this.pathDb, 'utf-8');
    const messages = JSON.parse(contents) as Record<string, string>;
    delete messages[id];
    await writeFile(this.pathDb, JSON.stringify(messages), 'utf-8');
    return `This action removes a #${id} message`;
  }
}
