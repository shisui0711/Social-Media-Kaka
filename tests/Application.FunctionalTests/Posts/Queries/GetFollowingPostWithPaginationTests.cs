
using Application.Posts.Commands.CreatePost;
using Application.Posts.Queries.GetFollowingPostWithPagination;
using Application.Users.Commands.FollowUser;
using Bogus;
using Domain.Entities;
using static Application.FunctionalTests.Testing;
using ValidationException = Application.Common.Exceptions.ValidationException;


namespace Application.FunctionalTests.Posts.Queries
{
    public class GetFollowingPostWithPaginationTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldValidationFields()
        {
            await RunAsDefaultUserAsync();
            var command = new GetFollowingPostWithPaginationQuery(){
                PageSize = 0,
                PageNumber = 0
            };

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized(){
            var action = () => SendAsync(new GetFollowingPostWithPaginationQuery(){ PageNumber = 1, PageSize = 10 });
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldReturnBookmarkPostWithPagination(){
            //Arrange
            var adminId = await RunAsAdministratorAsync();
            //Fake post data
            Faker<CreatePostCommand> faker = new Faker<CreatePostCommand>();
            faker.RuleFor(x=>x.Content, f => f.Lorem.Paragraph(10));
            List<CreatePostCommand> commands = faker.Generate(20);
            foreach (var command in commands)
            {
                await SendAsync(command);
            }
            // Following User admin
            await RunAsDefaultUserAsync();
            await SendAsync(new FollowUserCommand(){UserId = adminId});

            var query = new GetFollowingPostWithPaginationQuery(){
                PageNumber = 1,
                PageSize = 10,
            };
            //Act
            var followingPosts = await SendAsync(query);
            //Assert
            followingPosts.Should().NotBeNull();
            followingPosts.PageNumber.Should().Be(1);
            followingPosts.TotalPages.Should().Be(2);
            followingPosts.TotalCount.Should().Be(20);
            followingPosts.HasNextPage.Should().BeTrue();
            followingPosts.HasPreviousPage.Should().BeFalse();
            followingPosts.Items.Count.Should().Be(10);
            //post orderby desc so command should be reverse
            commands.Reverse();
            followingPosts.Items.Select(x=>x.Content)
            .SequenceEqual(commands.Take(10).Select(x=>x.Content)).Should().BeTrue();
        }
    }
}