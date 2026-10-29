# AP1_Academia

API REST para gerenciamento de personais de uma academia, desenvolvida com ASP.NET Core, .NET 10, Entity Framework Core e SQLite.

## Requisitos

* .NET SDK 10.0 ou superior
* Entity Framework Core
* SQLite

## Como executar

Na raiz do projeto, execute:

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

| Método | Rota                 | Descrição                      |
| ------ | -------------------- | ------------------------------ |
| GET    | `/api/personal`      | Lista todos os personais       |
| GET    | `/api/personal/{id}` | Busca um personal pelo ID      |
| POST   | `/api/personal`      | Cadastra um novo personal      |
| PUT    | `/api/personal/{id}` | Atualiza um personal existente |
| DELETE | `/api/personal/{id}` | Remove um personal             |

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

## Link do Vídeo de Demonstração

https://drive.google.com/file/d/1WZ-vwlB7B3INtQ_5DtNhAguz5lBUuRTk/view?usp=sharing

## Link Parte 2
https://drive.google.com/file/d/12LpypeNMjWtnK4iqfq8STAbt_7MjNTGn/view?usp=sharing
