import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  PrimaryGeneratedColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

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
