using Application.Posts.Commands.CreatePost;
using Application.Posts.Queries.GetPostInfo;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Posts.Queries
{
    public class GetPostInfoTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new GetPostInfoQuery();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized()
        {
            var query = new GetPostInfoQuery
            {
                PostId = "Valid"
            };

            var action = () => SendAsync(query);
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldReturnPostInfo(){
            // Arrange
            var userId = await RunAsDefaultUserAsync();
            var post = await SendAsync(new CreatePostCommand(){Content = "Test"});
            var query = new GetPostInfoQuery(){PostId=post.Id};
            // Act
            var result = await SendAsync(query);
            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(post.Id);
            result.Content.Should().Be("Test");
            result.UserId.Should().Be(userId);
        }

        [Test]
        public async Task ShouldThrowNotFoundIfPostDoesNotExist()
        {
            // Arrange
            await RunAsDefaultUserAsync();
            var query = new GetPostInfoQuery(){PostId=Guid.NewGuid().ToString()};
            // Act
            var action = () => SendAsync(query);
            // Assert
            await action.Should().ThrowAsync<NotFoundException>();
        }
    }
}