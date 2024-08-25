
using Application.Posts.Commands.CreatePost;
using Application.Posts.Commands.LikePost;
using Domain.Entities;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Posts.Commands
{
    public class LikePostTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new LikePostCommand();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized(){
            var action = () => SendAsync(new LikePostCommand(){PostId = "Valid"});
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldLikePost(){
            //Arrange
            var userId = await RunAsDefaultUserAsync();

            var command = new CreatePostCommand
            {
                Content = "Test content",
            };
            //Act
            var postDto = await SendAsync(command);

            await SendAsync(new LikePostCommand(){PostId = postDto.Id});

            var post = await FindIncludeAsync<Post,ICollection<Like>>(x=>x.Id == postDto.Id, x=>x.Likes);

            //Assert
            post!.Likes.Should().HaveCount(1);
            post.Likes.First().PostId.Should().Be(postDto.Id);
            post.Likes.First().UserId.Should().Be(userId);
        }
    }
}