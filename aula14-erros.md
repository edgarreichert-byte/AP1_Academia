# Aula 14 – Tratamento de erros, exceções e middleware

## 1. Objetivo da atividade

Implementar um tratamento centralizado de exceções na API do projeto Academia, utilizando middleware para evitar que informações técnicas e internas do sistema sejam expostas aos clientes.

A implementação foi realizada no projeto existente da AP2, preservando as funcionalidades e as rotas do CRUD.

## 2. Implementação do middleware

O middleware `UseExceptionHandler` foi adicionado no arquivo `Program.cs`, logo após a criação da aplicação com `var app = builder.Build();` e antes dos arquivos estáticos e dos endpoints.

Sua função é capturar exceções inesperadas e retornar uma resposta padronizada em formato JSON.

A resposta configurada utiliza:

- **Status HTTP:** 500 – Internal Server Error.
- **Content-Type:** application/json.
- **Mensagem:** Ocorreu um erro interno. Tente novamente mais tarde.

## 3. Teste de exceção no Bruno

Para verificar o funcionamento do tratamento de erros, foi criada temporariamente uma rota específica para simular uma exceção.

| Informação | Resultado |
|---|---|
| Método | GET |
| Rota | `/api/teste-erro` |
| Status esperado | 500 |
| Ambiente | Production |

**Resposta JSON esperada:**

```json
{
  "mensagem": "Ocorreu um erro interno. Tente novamente mais tarde."
}
```

A mensagem original da exceção, `Falha simulada para teste.`, não deve aparecer na resposta enviada ao cliente.

## 4. Verificação das rotas existentes

Após a implementação, foram previstos testes para verificar se as funcionalidades anteriores continuaram funcionando normalmente.

| Método | Endpoint | Resultado esperado |
|---|---|---|
| GET | `/api/personal` | 200 – OK |
| GET | `/api/personal/9999` | 404 – Not Found |

A consulta de um ID inexistente deve continuar retornando 404, pois a ausência de um registro não representa uma exceção inesperada.

## 5. Remoção da rota temporária

Após a realização dos testes, a rota `/api/teste-erro` deve ser removida do `Program.cs`.

O middleware permanece na aplicação, garantindo o tratamento centralizado das exceções inesperadas.

Também deve ser executado novamente o comando `dotnet build` para verificar se o projeto continua compilando corretamente.

## 6. Reflexão sobre segurança

Não devemos enviar a mensagem original da exceção ao cliente porque ela pode revelar informações internas da aplicação, como detalhes técnicos, caminhos de arquivos e informações sobre o funcionamento do sistema.

Por isso, é importante apresentar uma mensagem genérica ao usuário e manter os detalhes técnicos restritos ao ambiente de desenvolvimento e aos registros internos apropriados.

## 7. Conclusão

A atividade permitiu compreender a importância do tratamento centralizado de erros em uma API.

Com a implementação do middleware, o projeto Academia passou a contar com uma resposta padronizada para falhas inesperadas, mantendo o comportamento normal das rotas existentes, incluindo as respostas 404.

**Projeto:** Academia – API  
**Atividade:** Trabalho Discente Efetivo – Aula 14  
**Tecnologias:** C#, ASP.NET Core, Entity Framework Core e SQLite