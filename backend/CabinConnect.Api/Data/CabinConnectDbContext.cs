using Microsoft.EntityFrameworkCore;

namespace CabinConnect.Api.Data;

public class CabinConnectDbContext : DbContext
{
    public CabinConnectDbContext(DbContextOptions<CabinConnectDbContext> options)
        : base(options)
    {
    }
}
