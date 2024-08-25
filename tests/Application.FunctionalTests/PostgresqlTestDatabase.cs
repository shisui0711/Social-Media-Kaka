using Microsoft.Extensions.Configuration;
using Npgsql;
using Respawn;
using Microsoft.EntityFrameworkCore;
using Infrastructure;
using System.Data.Common;

namespace Application.FunctionalTests
{
    public class PostgresqlTestDatabase : ITestDatabase
    {
        private readonly string _connectionString = null!;
        private NpgsqlConnection _connection = null!;
        private Respawner _respawner = null!;

        public PostgresqlTestDatabase()
        {
            var configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .AddEnvironmentVariables()
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection");

            Guard.Against.Null(connectionString);

            _connectionString = connectionString;
        }

        public async Task InitialiseAsync()
        {
            _connection = new NpgsqlConnection(_connectionString);


            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseNpgsql(_connectionString)
                .Options;

            var context = new ApplicationDbContext(options);

            context.Database.Migrate();

            await _connection.OpenAsync();

            _respawner = await Respawner.CreateAsync(_connection, new RespawnerOptions
            {
                TablesToIgnore = new Respawn.Graph.Table[] { "__EFMigrationsHistory" },
                DbAdapter = DbAdapter.Postgres,
            });
        }

        public DbConnection GetConnection()
        {
            return _connection;
        }

        public async Task ResetAsync()
        {
            await _respawner.ResetAsync(_connection);
        }

        public async Task DisposeAsync()
        {
            await _connection.DisposeAsync();
        }
    }
}