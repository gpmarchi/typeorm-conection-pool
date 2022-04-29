import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('password_recovery_tokens')
class PasswordRecoveryToken {
  @PrimaryColumn()
  readonly id: string;

  @Column()
  readonly token: string;

  @Column()
  user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }

    if (!this.token) {
      this.token = uuid();
    }
  }
}

export { PasswordRecoveryToken };
