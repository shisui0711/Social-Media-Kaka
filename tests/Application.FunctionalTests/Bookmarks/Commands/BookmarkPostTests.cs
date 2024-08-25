

using Application.Bookmarks.Commands.BookmarkPost;
using Application.Posts.Commands.CreatePost;
using Domain.Entities;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Bookmarks.Commands
{
    public class BookmarkPostTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new BookmarkPostCommand();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized(){
            var action = () => SendAsync(new BookmarkPostCommand(){ PostId = "Valid" });
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldBookmarkPost(){
            //Arrange
            var userId = await RunAsDefaultUserAsync();

            var post = await SendAsync(new CreatePostCommand(){Content = "Test Content"});

            //Act
            await SendAsync(new BookmarkPostCommand(){ PostId = post.Id });

            //Assert
            var bookmark = await FindByConditionAsync<Bookmark>(x=>x.PostId == post.Id && x.UserId == userId);
            bookmark.Should().NotBeNull();
            bookmark!.PostId.Should().Be(post.Id);
            bookmark.UserId.Should().Be(userId);
        }

        [Test]
        public async Task ShouldNotBookmarkPostTwice(){
            //Arrange
            var userId = await RunAsDefaultUserAsync();

            var post = await SendAsync(new CreatePostCommand(){Content = "Test Content"});

            //Act
            await SendAsync(new BookmarkPostCommand(){ PostId = post.Id });
            await SendAsync(new BookmarkPostCommand(){ PostId = post.Id });

            //Assert
            var bookmark = await FindByConditionAsync<Bookmark>(x=>x.PostId == post.Id && x.UserId == userId);
            bookmark.Should().NotBeNull();
            bookmark!.PostId.Should().Be(post.Id);
            bookmark.UserId.Should().Be(userId);
        }

        [Test]
        public async Task ShouldThrowNotFoundWhenPostDoesNotExist(){
            //Arrange
            var userId = await RunAsDefaultUserAsync();

            //Act
            var action = () => SendAsync(new BookmarkPostCommand(){ PostId = Guid.NewGuid().ToString() });

            //Assert
            await action.Should().ThrowAsync<NotFoundException>();
        }
    }
}