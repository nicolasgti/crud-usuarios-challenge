import { DataSource } from 'typeorm';
import { User } from './user.entity'; // Certifique-se de que o caminho está correto
import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../../data-source'; // Ajuste o caminho para o arquivo de configuração do DataSource

async function seedRootUser() {
  const dataSource = await AppDataSource.initialize(); // Inicializa o DataSource
  const userRepository = dataSource.getRepository(User);

  // Verifica se já existe um usuário root
  const existingRootUser = await userRepository.findOne({ where: { email: 'root@admin.com' } });
  if (existingRootUser) {
    console.log('Usuário root já existe.');
    await dataSource.destroy(); // Fecha a conexão
    return;
  }

  // Cria o usuário root
  const rootUser = userRepository.create({
    nome: 'Administrador',
    email: 'root@admin.com',
    matricula: '0001',
    senha: await bcrypt.hash('root123', 10), // Substitua por uma senha segura
    isRoot: true,
  });

  await userRepository.save(rootUser);
  console.log('Usuário root criado com sucesso.');

  await dataSource.destroy(); // Fecha a conexão
}

seedRootUser()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Erro ao criar o usuário root:', error);
    process.exit(1);
  });