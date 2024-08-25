

namespace Application.FunctionalTests
{
    public static class TestDatabaseFactory
{
    public static async Task<ITestDatabase> CreateAsync()
    {
    #if DEBUG
        var database = new PostgresqlTestDatabase();
    #else
        var database = new TestcontainersTestDatabase();
    #endif

        await database.InitialiseAsync();

        return database;
    }
}
}