
using System.Linq.Expressions;
using Application.Common.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Constants;
using Domain.Entities;
using Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Application.FunctionalTests
{
    [SetUpFixture]
    public partial class Testing
    {
        private static ITestDatabase _database;
        private static CustomWebApplicationFactory _factory = null!;
        private static IServiceScopeFactory _scopeFactory = null!;
        private static string? _userId;

        [OneTimeSetUp]
        public async Task RunBeforeAnyTests()
        {
            _database = await TestDatabaseFactory.CreateAsync();

            _factory = new CustomWebApplicationFactory(_database.GetConnection());

            _scopeFactory = _factory.Services.GetRequiredService<IServiceScopeFactory>();
        }

        public static async Task<TResponse> SendAsync<TResponse>(IRequest<TResponse> request)
        {
            using var scope = _scopeFactory.CreateScope();

            var mediator = scope.ServiceProvider.GetRequiredService<ISender>();

            return await mediator.Send(request);
        }

        public static async Task SendAsync(IBaseRequest request)
        {
            using var scope = _scopeFactory.CreateScope();

            var mediator = scope.ServiceProvider.GetRequiredService<ISender>();

            await mediator.Send(request);
        }

        public static string? GetUserId()
        {
            return _userId;
        }

        public static async Task<string> RunAsDefaultUserAsync()
        {
            return await RunAsUserAsync("test@local", "Testing1234!", Array.Empty<string>());
        }

        public static async Task<string> RunAsAdministratorAsync()
        {
            return await RunAsUserAsync("administrator@local", "Administrator1234!", new[] { Roles.Administrator });
        }

        public static async Task<string> RunAsUserAsync(string userName, string password, string[] roles)
        {
            using var scope = _scopeFactory.CreateScope();

            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            var user = await userManager.FindByNameAsync(userName);
            if (user == null)
            {
                user = new User
                {
                    UserName = userName,
                    Email = userName,
                    FirstName = "admin",
                    LastName = "",
                    DisplayName = "Test"
                };
                var result = await userManager.CreateAsync(user, password);

                if (roles.Any())
                {
                    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

                    foreach (var role in roles)
                    {
                        await roleManager.CreateAsync(new IdentityRole(role));
                    }

                    await userManager.AddToRolesAsync(user, roles);
                }
                if (result.Succeeded)
                {
                    _userId = user.Id;

                    return _userId;
                }

                var errors = string.Join(Environment.NewLine, result.Succeeded
                    ? Result.Success()
                    : Result.Failure(result.Errors.Select(e => e.Description)).Errors);
                throw new Exception($"Unable to create {userName}.{Environment.NewLine}{errors}");
            }
            _userId = user.Id;
            return user.Id;
        }

        public static async Task ResetState()
        {
            try
            {
                await _database.ResetAsync();
            }
            catch (Exception)
            {

            }

            _userId = null;
        }

        public static async Task<TEntity?> FindAsync<TEntity>(params object[] keyValues)
            where TEntity : class
        {
            using var scope = _scopeFactory.CreateScope();

            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            return await context.FindAsync<TEntity>(keyValues);
        }

        public static async Task<TEntity?> FindByConditionAsync<TEntity>(Expression<Func<TEntity, bool>> predicate) where TEntity : class
        {
            using var scope = _scopeFactory.CreateScope();

            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            return await context.Set<TEntity>().FirstOrDefaultAsync(predicate);
        }

        public static async Task<IEnumerable<TEntity>> TakeAsync<TEntity>(int count) where TEntity : class
        {

            using var scope = _scopeFactory.CreateScope();

            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            return await context.Set<TEntity>().Take(count).ToListAsync();
        }

        public static async Task<TEntity?> FindIncludeAsync<TEntity, TProperty>
        (Expression<Func<TEntity, bool>> predicate, Expression<Func<TEntity, TProperty>> navigationPropertyPath) where TEntity : class
        {
            using var scope = _scopeFactory.CreateScope();

            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            return await context.Set<TEntity>().Include(navigationPropertyPath).FirstOrDefaultAsync(predicate);
        }

        public static async Task<TDto?> FindWithAllReferrence<TEntity,TDto>(Expression<Func<TEntity, bool>> predicate) where TEntity : class
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var mapper = scope.ServiceProvider.GetRequiredService<IMapper>();
            return await context.Set<TEntity>().Where(predicate).ProjectTo<TDto>(mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();
        }

        public static async Task AddAsync<TEntity>(TEntity entity)
            where TEntity : class
        {
            using var scope = _scopeFactory.CreateScope();

            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            context.Add(entity);

            await context.SaveChangesAsync();
        }

        public static async Task<int> CountAsync<TEntity>() where TEntity : class
        {
            using var scope = _scopeFactory.CreateScope();

            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            return await context.Set<TEntity>().CountAsync();
        }

        [OneTimeTearDown]
        public async Task RunAfterAnyTests()
        {
            await ResetState();
            await _database.DisposeAsync();
            await _factory.DisposeAsync();
        }
    }
}