using Application.Bookmarks.Commands.BookmarkPost;
using Application.Bookmarks.Commands.UnBookmarkPost;
using Application.Posts.Commands.CreatePost;
using Domain.Entities;
using static Application.FunctionalTests.Testing;
namespace Application.FunctionalTests.Bookmarks.Commands
{
    public class UnBookmarkPostTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new UnBookmarkPostCommand();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized(){
            var action = () => SendAsync(new UnBookmarkPostCommand(){ PostId = "Valid" });
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldUnBookmarkPost(){
            // Arrange
            var userId = await RunAsDefaultUserAsync();
            var post = await SendAsync(new CreatePostCommand(){Content = "Test Content"});
            await SendAsync(new BookmarkPostCommand(){ PostId = post.Id });

            //Act
            await SendAsync(new UnBookmarkPostCommand(){ PostId = post.Id });

            //Assert
            var bookmarkPost = await FindByConditionAsync<Bookmark>(x=>x.PostId == post.Id && x.UserId == userId);
            bookmarkPost.Should().BeNull();
        }

        [Test]
        public async Task ShouldThrowNotFoundWhenPostDoesNotExist(){
            //Arrange
            var userId = await RunAsDefaultUserAsync();

            //Act
            var action = () => SendAsync(new UnBookmarkPostCommand(){ PostId = Guid.NewGuid().ToString() });

            //Assert
            await action.Should().ThrowAsync<NotFoundException>();
        }
    }
}