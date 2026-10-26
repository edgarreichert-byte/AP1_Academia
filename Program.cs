

using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApiDbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

var app = builder.Build();

// Disponibilizar a interface da pasta wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

var personais = new List<Personal>
{
    new Personal(1, "Carlos", true),
    new Personal(2, "Fernanda", false)
};

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

// PUT - Atualizar um personal no banco
app.MapPut("/api/personal/{id:int}", async (int id, PersonalAtualizadoDTO dados, ApiDbContext db) =>
{
    var personalEncontrado = await db.Personais.FindAsync(id);

    if (personalEncontrado is null)
    {
        return Results.NotFound();
    }

    personalEncontrado.Nome = dados.nome;
    personalEncontrado.tipo = dados.tipo;

    await db.SaveChangesAsync();

    return Results.Ok(personalEncontrado);
});

// DELETE - Excluir um personal do banco
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

class AcademiaPersonaisEntity
{
    public int id { get; set; }
    public string Nome { get; set; }
    public string tipo { get; set; }
}

class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions<ApiDbContext> options)
        : base(options)
    {
    }

    public DbSet<AcademiaPersonaisEntity> Personais
        => Set<AcademiaPersonaisEntity>();
}

record Personal(int id, string nome, bool disponivel);

record PersonalDTO(string nome);

record PersonalAtualizadoDTO(string nome, string tipo);
