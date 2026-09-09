<<<<<<< HEAD
# AP1_Academia
=======
# AP1_Academia

API REST minimalista para gerenciamento de personais de uma academia, desenvolvida com ASP.NET Core e .NET 10.

## Requisitos

* .NET SDK 10.0 ou superior

## Como executar

Na raiz do projeto, execute:

```bash
dotnet run
```

A API estará disponível em:

* HTTP: `http://localhost:5098`
* HTTPS: `https://localhost:7004`

Para verificar se a API está funcionando:

```http
GET http://localhost:5098/
```

Resposta esperada:

```text
Academia
```

## Endpoints

| Método | Rota                  | Descrição                      |
| ------ | --------------------- | ------------------------------ |
| GET    | `/api/personal`       | Lista todos os personais       |
| GET    | `/api/personal/{id}`  | Busca um personal pelo ID      |
| POST   | `/api/personal`       | Cadastra um novo personal      |
| PUT    | `/api/personais/{id}` | Atualiza um personal existente |
| DELETE | `/api/personais/{id}` | Remove um personal             |

### Listar personais

```http
GET /api/personal
```

Retorna todos os personais cadastrados na academia.

### Buscar personal por ID

```http
GET /api/personal/1
```

Retorna os dados do personal correspondente ao ID informado.

### Cadastrar personal

```http
POST /api/personal
Content-Type: application/json

{
  "nome": "João"
}
```

O novo personal é cadastrado como disponível.

### Atualizar personal

```http
PUT /api/personais/1
Content-Type: application/json

{
  "nome": "Carlos",
  "disponivel": false
}
```

Atualiza o nome e a disponibilidade do personal.

### Remover personal

```http
DELETE /api/personais/1
```

Remove o personal correspondente ao ID informado.

## Observações

* A aplicação inicia com os personais `Carlos` e `Fernanda`.
* A disponibilidade dos personais é representada pelo campo `disponivel`.
* Os dados ficam armazenados somente em memória e são perdidos ao reiniciar a aplicação.
* Operações para um ID inexistente retornam HTTP `404 Not Found`.
* O cadastro retorna HTTP `201 Created`.
* A remoção bem-sucedida retorna HTTP `204 No Content`.
* A API utiliza endpoints REST para realizar operações de consulta, cadastro, atualização e exclusão de personais.

>>>>>>> 5b146efe2454c6fb914d66339528911f27b34329
