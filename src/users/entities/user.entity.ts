import { BaseEntity } from 'src/shared/Base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class UserEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  logInsert() {
    console.log(
      `Đã chèn thành công User có ID: ${this.id} - Name: ${this.name}`,
    );
  }

  logUpdate(): void {
    console.log(
      `Đã cập nhật thành công User có ID: ${this.id} - Name: ${this.name}`,
    );
  }

  logRemove(): void {
    console.log(
      `Đã xóa thành công User có ID: ${this.id} - Name: ${this.name}`,
    );
  }
}
