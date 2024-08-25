using Application.Posts.Commands.CreatePost;
using Application.Posts.Queries.GetUserTaggedPostWithPagination;
using Domain.Entities;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Posts.Queries
{
    public class GetUserTaggedPostWithPaginationTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldValidationFields()
        {
            await RunAsDefaultUserAsync();
            var command = new GetUserTaggedPostWithPaginationQuery(){
                PageSize = 0,
                PageNumber = 0
            };

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized(){
            var action = () => SendAsync(new GetUserTaggedPostWithPaginationQuery(){ PageNumber = 1, PageSize = 10 });
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldGetUserTaggedPostWithPagination()
        {
            // Arrange
            var userId = await RunAsDefaultUserAsync();
            var user =  await FindAsync<User>(userId);
            var post = await SendAsync(new CreatePostCommand(){Content=$"@{user!.UserName} Test Content"});
            var query = new GetUserTaggedPostWithPaginationQuery(){ UserName=user!.UserName! ,PageNumber = 1, PageSize = 10 };
            // Act
            var result = await SendAsync(query);

            // Assert
            result.Should().NotBeNull();
            result.Items.Count.Should().Be(1);
            result.Items.First().Id.Should().Be(post.Id);
            result.Items.First().Content.Should().Be($"@{user.UserName} Test Content");
        }
    }
}