import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  matricula: string;

  @Exclude()
  @Column()
  senha: string;

  @Column({ nullable: true })
  resetPasswordToken?: string;
}