using Application.Bookmarks.Commands.BookmarkPost;
using Application.Bookmarks.Queries.GetBookmarkInfo;
using Application.Posts.Commands.CreatePost;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Bookmarks.Queries
{
    public class GetBookmarkInfoTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new GetBookmarkInfoQuery();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized()
        {
            var query = new GetBookmarkInfoQuery
            {
                PostId = "Valid"
            };

            var action = () => SendAsync(query);
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShoudBookmarkExistWhenUserBookmarkedPost(){
            //Arrange
            await RunAsAdministratorAsync();
            var post = await SendAsync(new CreatePostCommand(){Content = "Test Content"});
            await SendAsync(new BookmarkPostCommand(){ PostId = post.Id });
            var query = new GetBookmarkInfoQuery
            {
                PostId = post.Id
            };

            //Act
            var bookmarkInfo = await SendAsync(query);

            //Assert
            bookmarkInfo.Should().NotBeNull();
            bookmarkInfo.isBookmarkedByUser.Should().BeTrue();
        }

        [Test]
        public async Task ShoudBookmarkNotExistWhenUserDidNotBookmarkPost(){
            //Arrange
            await RunAsAdministratorAsync();
            var post = await SendAsync(new CreatePostCommand(){Content = "Test Content"});
            var query = new GetBookmarkInfoQuery
            {
                PostId = post.Id
            };

            //Act
            var bookmarkInfo = await SendAsync(query);

            //Assert
            bookmarkInfo.Should().NotBeNull();
            bookmarkInfo.isBookmarkedByUser.Should().BeFalse();
        }
    }
}