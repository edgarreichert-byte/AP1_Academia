using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var personais = new List<Personal>
{
    new Personal(1, "Carlos", true),
    new Personal(2, "Fernanda", false)
};

app.MapGet("/", () => "Academia");

app.MapGet("/api/personal", () =>
{
    return Results.Ok(personais);
});

app.MapGet("/api/personal/{id:int}", (int id) =>
{
    var personalEncontrado = personais.Find(personal => personal.id == id);

    if (personalEncontrado is null)
    {
        return Results.NotFound();
    }

    return Results.Ok(personalEncontrado);
});

app.MapPost("/api/personal", (PersonalDTO dados) =>
{
    int proximoId = personais.Count + 1;

    var novoPersonal = new Personal(proximoId, dados.nome, true);

    personais.Add(novoPersonal);

    return Results.Created($"/api/personais/{novoPersonal.id}", novoPersonal);
});

app.MapPut("/api/personais/{id:int}", (int id, PersonalAtualizadoDTO dados) =>
{
    int indice = personais.FindIndex(personalDaLista => personalDaLista.id == id);

    if (indice == -1)
    {
        return Results.NotFound();
    }

    var atualizado = new Personal(id, dados.nome, dados.disponivel);
    personais[indice] = atualizado;

    return Results.Ok(atualizado);
});

app.MapDelete("/api/personais/{id:int}", (int id) =>
{
    int indice = personais.FindIndex(personalDaLista => personalDaLista.id == id);

    if (indice == -1)
    {
        return Results.NotFound();
    }

    personais.RemoveAt(indice);

    return Results.NoContent();
});


app.Run();

record Personal(int id, string nome, bool disponivel);

record PersonalDTO(string nome);

record PersonalAtualizadoDTO(string nome, bool disponivel);