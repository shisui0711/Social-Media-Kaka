
using Bogus;
using Domain.Constants;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data
{
    public static class InitialiserExtensions
    {
        public static async Task InitialiseDatabaseAsync(this IServiceProvider service)
        {
            using var scope = service.CreateScope();

            var initialiser = scope.ServiceProvider.GetRequiredService<ApplicationDbContextInitialiser>();

            await initialiser.InitialiseAsync();

            await initialiser.SeedAsync();
        }
    }

    public class ApplicationDbContextInitialiser
    {
        private readonly ILogger<ApplicationDbContextInitialiser> _logger;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public ApplicationDbContextInitialiser(ILogger<ApplicationDbContextInitialiser> logger,
        ApplicationDbContext context, UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            _logger = logger;
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task InitialiseAsync()
        {
            try
            {
                await _context.Database.MigrateAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while initialising the database.");
                throw;
            }
        }

        public async Task SeedAsync()
        {
            try
            {
                await TrySeedAsync();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "An error occurred while seeding the database.");
                throw;
            }
        }

        public async Task TrySeedAsync()
        {
            // Default roles
            var administratorRole = new IdentityRole(Roles.Administrator);

            if (_roleManager.Roles.All(r => r.Name != administratorRole.Name))
            {
                await _roleManager.CreateAsync(administratorRole);
            }

            // Default users
            var administrator = new User
            {
                UserName = "administrator@localhost",
                Email = "administrator@localhost",
                DisplayName = "admin",
                FirstName = "admin",
                LastName = ""
            };

            if (_userManager.Users.All(u => u.UserName != administrator.UserName))
            {
                await _userManager.CreateAsync(administrator, "Administrator1!");
                if (!string.IsNullOrWhiteSpace(administratorRole.Name))
                {
                    await _userManager.AddToRolesAsync(administrator, new[] { administratorRole.Name });
                }
            }

            if (await _context.Users.CountAsync() > 10) return;
            // Default data
            // Seed, if necessary
            Faker faker = new Faker("vi");
            var uniqueUsernames = new HashSet<string>();
            while (uniqueUsernames.Count < 50)
            {
                uniqueUsernames.Add(faker.Internet.UserName());
            }
            var uniqueEmails = new HashSet<string>();
            while (uniqueEmails.Count < 50)
            {
                uniqueEmails.Add(faker.Internet.Email());
            }
            var listEmails = uniqueEmails.ToList();
            var listUsernames = uniqueUsernames.ToList();
            Faker<User> fakerUser = new Faker<User>("vi")
                    .RuleFor(x => x.UserName, f => listUsernames[f.IndexFaker])
                    .RuleFor(x => x.Email, f => listEmails[f.IndexFaker])
                    .RuleFor(x => x.BirthDay, f => f.Person.DateOfBirth)
                    .RuleFor(x => x.FirstName, f => f.Person.FirstName)
                    .RuleFor(x => x.LastName, f => f.Person.LastName)
                    .RuleFor(x => x.DisplayName, (f, x) => $"{x.FirstName} {x.LastName}")
                    .RuleFor(x => x.Bio, f => f.Lorem.Lines())
                    .RuleFor(x => x.Created, f => f.Date.Between(new DateTime(2024, 11, 1), new DateTime(2024, 12, 30)))
                    .RuleFor(x => x.LastModified, (f, u) => u.Created)
                    .RuleFor(x => x.AvatarUrl, f => "http://localhost:3000/images/user-placeholder.png");
            var users = fakerUser.Generate(50);

            foreach (var user in users)
            {
                await _userManager.CreateAsync(user, "Test123456@");
            }

            Faker<Post> fakerPost = new Faker<Post>("vi")
                .RuleFor(x => x.Content, f => f.Lorem.Lines())
                .RuleFor(x => x.UserId, f => users[f.IndexFaker].Id)
                .RuleFor(x => x.Created, f => f.Date.Between(new DateTime(2024, 11, 1), new DateTime(2024, 12, 30)))
                .RuleFor(x => x.LastModified, (f, u) => u.Created);
            var posts = fakerPost.Generate(50);

            foreach (var post in posts)
            {
                await _context.Posts.AddAsync(post);
            }

            Faker<PostMedia> fakerPostMedia = new Faker<PostMedia>("vi")
                .RuleFor(x => x.PostId, f => posts[f.IndexFaker].Id)
                .RuleFor(x => x.Type, f => "IMAGE")
                .RuleFor(x => x.Url, f => f.Image.PicsumUrl());
            var postMedias = fakerPostMedia.Generate(50);
            foreach (var media in postMedias)
            {
                await _context.PostMedias.AddAsync(media);
            }

            Faker<Comment> fakerComment = new Faker<Comment>("vi")
                .RuleFor(x => x.PostId, f => f.PickRandom<Post>(posts).Id)
                .RuleFor(x => x.UserId, f => f.PickRandom<User>(users).Id)
                .RuleFor(x => x.Content, f => f.Lorem.Lines());

            var comments = fakerComment.Generate(500);
            foreach (var comment in comments)
            {
                await _context.Comments.AddAsync(comment);
            }

            await _context.SaveChangesAsync();
        }

    }
}