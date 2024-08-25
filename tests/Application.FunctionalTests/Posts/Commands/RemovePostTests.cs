
using Application.Posts.Commands.CreatePost;
using Application.Posts.Commands.RemovePost;
using Domain.Entities;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Posts.Commands
{
    public class RemovePostTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new RemovePostCommand();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized(){
            var action = () => SendAsync(new RemovePostCommand(){PostId = "Valid"});
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldRemovePost()
        {
            //Arrange
            await RunAsDefaultUserAsync();

            var command = new CreatePostCommand
            {
                Content = "Test content",
            };
            //Act
            var postDto = await SendAsync(command);

            await SendAsync(new RemovePostCommand(){PostId = postDto.Id});

            var post = await FindAsync<Post>(postDto.Id);

            //Assert
            post.Should().BeNull();
        }
    }
}