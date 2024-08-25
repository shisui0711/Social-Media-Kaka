using Application.Comments.Commands.CreateComment;
using Application.Comments.Commands.CreateNestedComment;
using Application.Common.Models;
using Application.Posts.Commands.CreatePost;
using Domain.Entities;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Comments.Commands
{
    public class CreateNestedCommentTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new CreateNestedCommentCommand();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized(){
            var command = new CreateNestedCommentCommand
            {
                CommentId = "Valid",
                Content = "Valid"
            };

            var action = () => SendAsync(command);
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldCreateNestedComment()
        {
            //Arrange
            var userId = await RunAsDefaultUserAsync();
            var post = await SendAsync(new CreatePostCommand
            {
                Content = "Test content",
            });
            var parrentComment = await SendAsync(new CreateCommentCommand(){PostId = post.Id, Content = "Test content"});

            var command = new CreateNestedCommentCommand(){CommentId = parrentComment.Id, Content = "Test content"};

            //Act
            var result = await SendAsync(command);

            //Assert
            var comment = await FindAsync<Comment>(result.Id);
            comment.Should().NotBeNull();
            comment!.Id.Should().NotBeEmpty();
            comment.Content.Should().Be("Test content");
            comment.PostId.Should().Be(post.Id);
            comment.UserId.Should().Be(userId);
            comment.ParentId.Should().Be(parrentComment.Id);
        }

        [Test]
        public async Task ShouldCreateNestedCommentWithParrentIsTop()
        {
            //Arrange
            var userId = await RunAsDefaultUserAsync();
            var post = await SendAsync(new CreatePostCommand
            {
                Content = "Test content",
            });
            var parrentComment = await SendAsync(new CreateCommentCommand(){PostId = post.Id, Content = "Test content"});
            var childComment = await SendAsync(new CreateNestedCommentCommand(){CommentId = parrentComment.Id, Content = "Test content"});
            //Act
            var result = await SendAsync(new CreateNestedCommentCommand(){CommentId = childComment.Id, Content = "Test content"});

            //Assert
            var comment = await FindAsync<Comment>(result.Id);
            comment.Should().NotBeNull();
            comment!.Id.Should().NotBeEmpty();
            comment.Content.Should().Be("Test content");
            comment.PostId.Should().Be(post.Id);
            comment.UserId.Should().Be(userId);
            comment.ParentId.Should().Be(parrentComment.Id);
        }
    }
}