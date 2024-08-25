using Application.Comments.Commands.CreateComment;
using Application.Posts.Commands.CreatePost;
using Domain.Entities;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Comments.Commands
{
    public class CreateCommentTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new CreateCommentCommand();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized(){
            var command = new CreateCommentCommand
            {
                PostId = "Valid",
                Content = "Valid"
            };

            var action = () => SendAsync(command);
                await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldCreateComment()
        {
            // Arrange
            var userId = await RunAsDefaultUserAsync();
            var post = await SendAsync(new CreatePostCommand
            {
                Content = "Test content",
            });
            var command = new CreateCommentCommand
            {
                PostId = post.Id,
                Content = "Test Content"
            };

            // Act
            var result = await SendAsync(command);

            // Assert
            var comment = await FindAsync<Comment>(result.Id);
            comment.Should().NotBeNull();
            comment!.Id.Should().NotBeEmpty();
            comment.ParentComment.Should().BeNull();
            comment.Content.Should().Be("Test Content");
            comment.ChildrenComment.Should().HaveCount(0);
            comment.PostId.Should().Be(post.Id);
            comment.UserId.Should().Be(userId);
        }
    }
}