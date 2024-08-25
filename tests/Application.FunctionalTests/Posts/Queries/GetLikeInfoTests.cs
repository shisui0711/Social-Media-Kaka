using Application.Posts.Commands.CreatePost;
using Application.Posts.Commands.LikePost;
using Application.Posts.Queries.GetLikeInfo;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Posts.Queries
{
    public class GetLikeInfoTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new GetLikeInfoQuery();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized()
        {
            var query = new GetLikeInfoQuery
            {
                PostId = "Valid"
            };

            var action = () => SendAsync(query);
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShoudLikedWhenUserLikedPost()
        {
            //Arrange
            await RunAsDefaultUserAsync();
            var post = await SendAsync(new CreatePostCommand(){Content="Test Content"});
            await SendAsync(new LikePostCommand(){PostId=post.Id});
            var query = new GetLikeInfoQuery(){PostId = post.Id};

            //Act
            var result = await SendAsync(query);

            //Assert
            result.isLikedByUser.Should().BeTrue();
        }

        [Test]
        public async Task ShoudNotLikedWhenUserDidNotLikePost(){
            //Arrange
            await RunAsDefaultUserAsync();
            var post = await SendAsync(new CreatePostCommand(){Content="Test Content"});
            var query = new GetLikeInfoQuery(){PostId = post.Id};

            //Act
            var result = await SendAsync(query);

            //Assert
            result.isLikedByUser.Should().BeFalse();
        }
    }
}