

using System.Data.Common;
using Infrastructure;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Respawn;
using Testcontainers.PostgreSql;

namespace Application.FunctionalTests
{
    public class TestcontainersTestDatabase : ITestDatabase
    {
        private readonly PostgreSqlContainer _container;
        private NpgsqlConnection _connection = null!;
        private string _connectionString = null!;
        private Respawner _respawner = null!;

        public TestcontainersTestDatabase()
        {
            _container = new PostgreSqlBuilder()
                .WithAutoRemove(true)
                .WithDatabase("test")
                .Build();
        }

        public async Task InitialiseAsync()
        {
            await _container.StartAsync();

            _connectionString = _container.GetConnectionString();

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
                DbAdapter = DbAdapter.Postgres
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
            await _container.DisposeAsync();
        }
    }
}