
# AP1_Academia

API REST para gerenciamento de personais de uma academia, desenvolvida com ASP.NET Core, .NET 10, Entity Framework Core e SQLite.

O projeto permite realizar operações de cadastro, consulta, atualização e exclusão de personais, utilizando uma API integrada a um banco de dados e uma interface web.

## Requisitos

* .NET SDK 10.0 ou superior
* Entity Framework Core
* SQLite

## Tecnologias utilizadas

* C#
* .NET 10
* ASP.NET Core
* Entity Framework Core
* SQLite
* HTML, CSS e JavaScript
* Bruno para testes das requisições HTTP

## Estrutura do projeto

```text
Academia/
│
├── Data/
│   └── ApiDbContext.cs
│
├── Dtos/
│   ├── AtualizarPersonal.cs
│   ├── CriarPersonal.cs
│   └── PersonalDto.cs
│
├── Migrations/
│
├── Models/
│   └── PersonalEntity.cs
│
├── Properties/
│
├── wwwroot/
│
├── Program.cs
├── Academia.csproj
├── .gitignore
├── appsettings.json
├── appsettings.Development.json
├── aula14-erros.md
└── README.md
```

### Organização das pastas

* **Data:** contém a classe `ApiDbContext`, responsável pelo acesso ao banco de dados.
* **Dtos:** contém os objetos de transferência de dados utilizados nas operações de cadastro, atualização e consulta.
* **Models:** contém a entidade que representa os dados dos personais.
* **Migrations:** armazena as migrações do Entity Framework Core.
* **Properties:** contém configurações relacionadas à execução do projeto.
* **wwwroot:** armazena os arquivos da interface web.
* **Program.cs:** contém a configuração da aplicação, os middlewares e os endpoints da API.

## Como executar

Na raiz do projeto, execute:

```bash
dotnet restore
```

Depois, compile a aplicação:

```bash
dotnet build
```

Para iniciar a API:

```bash
dotnet run
```

A API estará disponível nos endereços configurados na aplicação. As portas podem variar conforme a configuração do projeto.

Para verificar se a API está funcionando:

```http
GET http://localhost:5098/
```

Resposta esperada:

```text
Academia
```

## Interface Web

A aplicação disponibiliza uma interface web por meio da pasta `wwwroot`.

Os arquivos da interface são disponibilizados utilizando `UseDefaultFiles()` e `UseStaticFiles()`.

Para acessar a interface, execute a aplicação e abra o endereço local no navegador.

## Endpoints

| Método | Rota | Descrição |
| ------ | -------------------- | ------------------------------ |
| GET | `/api/personal` | Lista todos os personais |
| GET | `/api/personal/{id}` | Busca um personal pelo ID |
| POST | `/api/personal` | Cadastra um novo personal |
| PUT | `/api/personal/{id}` | Atualiza um personal existente |
| DELETE | `/api/personal/{id}` | Remove um personal |

### Listar personais

```http
GET /api/personal
```

Retorna todos os personais cadastrados no banco de dados.

### Buscar personal por ID

```http
GET /api/personal/1
```

Retorna os dados do personal correspondente ao ID informado.

Caso o personal não seja encontrado, retorna HTTP `404 Not Found`.

### Cadastrar personal

```http
POST /api/personal
Content-Type: application/json

{
  "nome": "João",
  "tipo": "Musculação"
}
```

Cadastra um novo personal no banco de dados e retorna HTTP `201 Created`, junto com os dados cadastrados.

### Atualizar personal

```http
PUT /api/personal/1
Content-Type: application/json

{
  "nome": "Carlos",
  "tipo": "Personal Trainer"
}
```

Atualiza o nome e o tipo do personal correspondente ao ID informado.

Se o personal não for encontrado, retorna HTTP `404 Not Found`. Se a atualização for realizada, retorna HTTP `200 OK`.

### Remover personal

```http
DELETE /api/personal/1
```

Remove o personal correspondente ao ID informado do banco de dados.

Se a remoção for realizada, retorna HTTP `204 No Content`. Caso o personal não seja encontrado, retorna HTTP `404 Not Found`.

## Tratamento de erros e exceções

A API possui tratamento centralizado de exceções utilizando o middleware `UseExceptionHandler`.

O middleware está localizado no `Program.cs`, logo após `var app = builder.Build();` e antes dos demais middlewares e endpoints.

Sua função é capturar exceções inesperadas e retornar uma resposta padronizada ao cliente, sem expor detalhes técnicos internos da aplicação.

### Resposta para erros internos

Quando ocorre uma exceção inesperada, a API retorna:

**HTTP 500 – Internal Server Error**

```json
{
  "mensagem": "Ocorreu um erro interno. Tente novamente mais tarde."
}
```

A mensagem original da exceção não é enviada ao cliente, ajudando a proteger informações internas do sistema.

### Respostas para registros inexistentes

As consultas e operações envolvendo um ID inexistente continuam retornando HTTP `404 Not Found`.

Isso acontece porque não encontrar um registro é uma situação normal da API, não uma exceção inesperada.

### Teste temporário de exceção

Durante a atividade da Aula 14, foi utilizada temporariamente a rota:

```http
GET /api/teste-erro
```

Essa rota foi criada exclusivamente para simular uma falha e verificar o funcionamento do middleware.

Após os testes, a rota temporária deve ser removida, mantendo apenas o tratamento centralizado de erros.

## Observações

* Os dados dos personais são armazenados em um banco de dados SQLite.
* A integração com o banco de dados é realizada por meio do Entity Framework Core.
* A classe `ApiDbContext` gerencia o acesso aos dados.
* A entidade `AcademiaPersonaisEntity` possui os campos `id`, `Nome` e `tipo`.
* A conexão com o banco de dados é configurada pela propriedade `DefaultConnection`.
* Operações para um ID inexistente retornam HTTP `404 Not Found`.
* O cadastro retorna HTTP `201 Created`.
* A atualização bem-sucedida retorna HTTP `200 OK`.
* A remoção bem-sucedida retorna HTTP `204 No Content`.
* A API utiliza endpoints REST para realizar operações de consulta, cadastro, atualização e exclusão de personais.
* A interface web é disponibilizada pela pasta `wwwroot`.
* O tratamento centralizado de exceções utiliza o middleware `UseExceptionHandler`.
* As respostas de erros internos utilizam status HTTP `500` e uma mensagem genérica em JSON.
* Os tipos do projeto são organizados em arquivos separados nas pastas `Models`, `Dtos` e `Data`.

## Link do Vídeo de Demonstração

https://drive.google.com/file/d/1WZ-vwlB7B3INtQ_5DtNhAguz5lBUuRTk/view?usp=sharing

## Link Parte 2

https://drive.google.com/file/d/12LpypeNMjWtnK4iqfq8STAbt_7MjNTGn/view?usp=sharing

---

**Projeto:** AP1_Academia

**Curso:** Análise e Desenvolvimento de Sistemas (ADS)

**Tecnologias principais:** C#, ASP.NET Core, Entity Framework Core e SQLite.
