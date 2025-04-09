import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { ILike } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: dto.email }, { matricula: dto.matricula }],
    });

    if (existingUser) {
      throw new ConflictException('Email ou Matricula já cadastrados');
    }

    const user = Object.assign(new User(), dto);
    user.senha = await bcrypt.hash(dto.senha, 10);
    
    const savedUser = await this.userRepository.save(user);

    const { senha, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async findByEmailOrMatricula(identifier: string): Promise<User | null> {
    if (!identifier) return null;
  
    const isEmail = identifier.includes('@');
  
    return this.userRepository.findOne({
      where: isEmail ? { email: identifier } : { matricula: identifier },
      select: ['id', 'nome', 'email', 'matricula', 'senha'],
    });
  }
  
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { email } ,
      select: ['id', 'nome', 'email', 'matricula', 'senha'],
    });
  }

  async validatePassword(enteredPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(enteredPassword, hashedPassword);
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users.map(({ senha, ...userWithoutPassword }) => userWithoutPassword);
  }

  async findAllPaginated(page: number, limit: number, search?: string) {
    const [data, total] = await this.userRepository.findAndCount({
      where: search
        ? [
            { nome: ILike(`%${search}%`) },
            { email: ILike(`%${search}%`) },
            { matricula: ILike(`%${search}%`) },
          ]
        : {},
      skip: (page - 1) * limit,
      take: limit,
      order: { nome: 'ASC' },
    });
  
    return {
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) return null;

    const { senha, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: number, user: Partial<User>) {
    await this.userRepository.update(id, user);
    return this.findOne(id); 
  }

  async remove(id: number) {
    return this.userRepository.delete(id);
  }
}
