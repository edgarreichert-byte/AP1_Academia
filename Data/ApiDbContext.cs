namespace ApiAcademia.Data;
using ApiAcademia.Models;
using Microsoft.EntityFrameworkCore;

class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions<ApiDbContext> options)
        : base(options)
    {
    }

    public DbSet<AcademiaPersonaisEntity> Personais
        => Set<AcademiaPersonaisEntity>();
};
