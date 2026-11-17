using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ApiAcademia.Models;
using ApiAcademia.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApiDbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

var app = builder.Build();

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";

        await context.Response.WriteAsJsonAsync(new
        {
            mensagem = "Ocorreu um erro interno. Tente novamente mais tarde."
        });
    });
});

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/", () => "Academia");

app.MapGet("/api/personal", async (ApiDbContext db) =>
{
    var personais = await db.Personais.ToListAsync();

    return Results.Ok(personais);
});

app.MapGet("/api/personal/{id:int}", async (int id, ApiDbContext db) =>
{
    var personalEncontrado = await db.Personais.FindAsync(id);

    if (personalEncontrado is null)
    {
        return Results.NotFound();
    }

    return Results.Ok(personalEncontrado);
});

app.MapPost("/api/personal", async (AcademiaPersonaisEntity dados, ApiDbContext db) =>
{
    db.Personais.Add(dados);

    await db.SaveChangesAsync();

    return Results.Created(
        $"/api/personal/{dados.id}",
        dados
    );
});

app.MapPut("/api/personal/{id:int}", async (int id, AcademiaPersonaisEntity dados, ApiDbContext db) =>
{
    var personalEncontrado = await db.Personais.FindAsync(id);

    if (personalEncontrado is null)
    {
        return Results.NotFound();
    }

    personalEncontrado.Nome = dados.Nome;
    personalEncontrado.tipo = dados.tipo;

    await db.SaveChangesAsync();

    return Results.Ok(personalEncontrado);
});

app.MapDelete("/api/personal/{id:int}", async (int id, ApiDbContext db) =>
{
    var personalEncontrado = await db.Personais.FindAsync(id);

    if (personalEncontrado is null)
    {
        return Results.NotFound();
    }

    db.Personais.Remove(personalEncontrado);

    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.Run();