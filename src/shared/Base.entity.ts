import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  PrimaryGeneratedColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @AfterInsert()
  handlerAfterInsert() {
    this.logInsert();
  }

  @AfterUpdate()
  handlerAfterUpdate() {
    this.logUpdate();
  }

  @AfterRemove()
  handlerAfterRemove() {
    this.logRemove();
  }

  abstract logInsert(): void;
  abstract logUpdate(): void;
  abstract logRemove(): void;
}
