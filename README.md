# CRUD Usuários Challenge

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Descrição

Este projeto é um sistema de CRUD de usuários desenvolvido com o framework [NestJS](https://nestjs.com/). Ele permite criar, listar, atualizar e excluir usuários, além de implementar autenticação JWT para proteger rotas.

---

## Funcionalidades

- **Autenticação JWT**: Proteção de rotas com autenticação baseada em tokens.
- **CRUD de Usuários**:
  - Criar usuários.
  - Listar usuários com paginação e busca.
  - Atualizar informações de usuários.
  - Remover usuários.
- **Usuário Root**: Suporte para um usuário administrador com permissões especiais.
- **Validação de Dados**: Validação de entrada usando `class-validator`.
- **Banco de Dados**: Integração com TypeORM e suporte a MySQL.

---

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução.
- **NestJS**: Framework para construção de APIs escaláveis.
- **TypeScript**: Linguagem principal do projeto.
- **TypeORM**: ORM para manipulação do banco de dados.
- **JWT**: Autenticação baseada em tokens.
- **MySQL**: Banco de dados utilizado no projeto.

---

## Requisitos

- **Node.js**: Versão 16 ou superior.
- **NPM**: Versão 7 ou superior.
- **Banco de Dados**: MySQL.

---

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/crud-usuarios-challenge.git
   cd crud-usuarios-challenge
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:
   ```env
   JWT_SECRET=my-secret-key
   DATABASE_URL=mysql://usuario:senha@localhost:3306/crud_usuarios
   ```

4. Configure o banco de dados:
   - Crie o banco de dados no MySQL com o seguinte comando:
     ```sql
     CREATE DATABASE crud_usuarios;
     ```
   - Certifique-se de que o arquivo `data-source.ts` está configurado corretamente para usar o MySQL.

5. Rode o script para criar o usuário root:
   Execute o seguinte comando para criar o usuário root no banco de dados:
   ```bash
   npx ts-node src/users/seed-root-user.ts
   ```

---

## Executando o Projeto

### Ambiente de Desenvolvimento

Para rodar o projeto em modo de desenvolvimento:
```bash
npm run start:dev
```

### Ambiente de Produção

Para compilar e rodar o projeto em produção:
```bash
npm run build
npm run start:prod
```

---

## Rotas Disponíveis

### Autenticação

- **POST /auth/login**: Gera um token JWT para autenticação.
  - **Body**:
    ```json
    {
      "email": "string",
      "senha": "string"
    }
    ```

### Usuários

- **POST /users**: Cria um novo usuário (rota protegida).
  - **Body**:
    ```json
    {
      "nome": "string",
      "email": "string",
      "matricula": "string",
      "senha": "string"
    }
    ```

- **GET /users**: Lista todos os usuários com paginação.
  - **Query Params**:
    - `page`: Número da página (opcional, padrão: 1).
    - `limit`: Limite de itens por página (opcional, padrão: 10).
    - `search`: Termo de busca (opcional).

- **GET /users/:id**: Retorna os detalhes de um usuário específico (rota protegida).

- **PUT /users/:id**: Atualiza os dados de um usuário (rota protegida).
  - **Body**:
    ```json
    {
      "nome": "string",
      "email": "string",
      "matricula": "string"
    }
    ```

- **DELETE /users/:id**: Remove um usuário (rota protegida).

---

## Testes

### Testes Unitários
Para rodar os testes unitários:
```bash
npm run test
```

### Testes de Integração (e2e)
Para rodar os testes de integração:
```bash
npm run test:e2e
```

### Cobertura de Testes
Para gerar o relatório de cobertura:
```bash
npm run test:cov
```

---

## Estrutura do Projeto

```plaintext
src/
├── auth/               # Módulo de autenticação (JWT)
├── users/              # Módulo de usuários (CRUD)
├── email/              # Módulo de envio de e-mails (opcional)
├── main.ts             # Arquivo principal
├── app.module.ts       # Módulo raiz
├── data-source.ts      # Configuração do banco de dados
```

## Contribuição

Contribuições são bem-vindas! Siga os passos abaixo para contribuir:

1. Faça um fork do repositório.
2. Crie uma branch para sua feature/bugfix:
   ```bash
   git checkout -b minha-feature
   ```
3. Faça commit das suas alterações:
   ```bash
   git commit -m "Minha nova feature"
   ```
4. Envie para o repositório remoto:
   ```bash
   git push origin minha-feature
   ```
5. Abra um Pull Request.

---

## Licença

Este projeto está licenciado sob a licença [MIT](LICENSE).

---

## Autor

- **Nome**: Nicolas Fernandes
- **GitHub**: [nicolasgti](https://github.com/nicolasgti)
- **E-mail**: nicolasgti@hotmail.com