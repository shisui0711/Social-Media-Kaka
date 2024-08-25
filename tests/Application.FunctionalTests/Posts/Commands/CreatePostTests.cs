


using Application.Common.Models;
using Application.Posts.Commands.CreatePost;
using Domain.Entities;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Posts.Commands
{
    public class CreatePostTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new CreatePostCommand();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized(){
            var command = new CreatePostCommand
            {
                Content = "Test content",
                Medias = new List<Media>
                {
                    new Media { MediaUrl = "http://example.com/media.jpg", Type = "image" }
                }
            };

            var action = () => SendAsync(command);
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldCreatePost()
        {
            //Arrange
            var userId = await RunAsDefaultUserAsync();

            var command = new CreatePostCommand
            {
                Content = "Test content",
                Medias = new List<Media>
                {
                    new Media { MediaUrl = "http://example.com/media.jpg", Type = "image" }
                }
            };
            //Act
            var postDto = await SendAsync(command);

             // Assert
            Assert.NotNull(postDto);
            Assert.That(postDto.Content, Is.EqualTo("Test content"));

            var post = await FindWithAllReferrence<Post,PostDto>(x=>x.Id == postDto.Id);
            Assert.NotNull(post);
            Assert.That(post.UserId, Is.EqualTo(userId));
            Assert.That(post.User, Is.Not.Null);
            Assert.That(post.User.Id, Is.EqualTo(userId));
            Assert.That(post.CreatedBy, Is.EqualTo(userId));
            Assert.That(post.LastModifiedBy, Is.EqualTo(userId));
            Assert.That(post.Content, Is.EqualTo("Test content"));
            Assert.That(post.Attachments.Count, Is.EqualTo(1));
            Assert.That(post.Attachments.First().Url, Is.EqualTo("http://example.com/media.jpg"));
            Assert.That(post.Attachments.First().Type, Is.EqualTo("image"));
        }

        [Test]
        public async Task ShouldCreatePostWithOutMedia(){
            //Arrange
            var userId = await RunAsDefaultUserAsync();

            var command = new CreatePostCommand
            {
                Content = "Test content",
            };
            //Act
            var postDto = await SendAsync(command);

             // Assert
            Assert.NotNull(postDto);
            Assert.That(postDto.Content, Is.EqualTo("Test content"));

            var post = await FindAsync<Post>(postDto.Id);
            Assert.NotNull(post);
            Assert.That(post.UserId, Is.EqualTo(userId));
            Assert.That(post.CreatedBy, Is.EqualTo(userId));
            Assert.That(post.LastModifiedBy, Is.EqualTo(userId));
            Assert.That(post.Content, Is.EqualTo("Test content"));
        }
    }
}