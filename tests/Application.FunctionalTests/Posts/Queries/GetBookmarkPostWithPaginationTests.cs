using Application.Bookmarks.Commands.BookmarkPost;
using Application.Posts.Commands.CreatePost;
using Application.Posts.Queries.GetBookmarkPostWithPagination;
using Bogus;
using Domain.Entities;
using static Application.FunctionalTests.Testing;
using ValidationException = Application.Common.Exceptions.ValidationException;

namespace Application.FunctionalTests.Posts.Queries
{
    public class GetBookmarkPostWithPaginationTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldValidationFields()
        {
            await RunAsDefaultUserAsync();
            var command = new GetBookmarkPostWithPaginationQuery(){
                PageSize = 0,
                PageNumber = 0
            };

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized(){
            var action = () => SendAsync(new GetBookmarkPostWithPaginationQuery(){ PageNumber = 1, PageSize = 10 });
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldReturnBookmarkPostWithPagination(){
            //Arrange
            await RunAsDefaultUserAsync();
            //Fake post data
            Faker<CreatePostCommand> faker = new Faker<CreatePostCommand>();
            faker.RuleFor(x=>x.Content, f => f.Lorem.Paragraph(10));
            List<CreatePostCommand> commands = faker.Generate(20);
            foreach (var command in commands)
            {
                await SendAsync(command);
            }
            //Try bookmark post
            var posts = await TakeAsync<Post>(20);
            foreach (var post in posts)
            {
                var bookmarkCommand = new BookmarkPostCommand(){ PostId = post.Id };
                await SendAsync(bookmarkCommand);
            }

            var query = new GetBookmarkPostWithPaginationQuery(){
                PageNumber = 1,
                PageSize = 10,
            };
            //Act
            var bookmarkedPosts = await SendAsync(query);
            //Assert
            bookmarkedPosts.Should().NotBeNull();
            bookmarkedPosts.PageNumber.Should().Be(1);
            bookmarkedPosts.TotalPages.Should().Be(2);
            bookmarkedPosts.TotalCount.Should().Be(20);
            bookmarkedPosts.HasNextPage.Should().BeTrue();
            bookmarkedPosts.HasPreviousPage.Should().BeFalse();
            bookmarkedPosts.Items.Count.Should().Be(10);
            //post orderby desc so command should be reverse
            commands.Reverse();
            bookmarkedPosts.Items.Select(x=>x.Content)
            .SequenceEqual(commands.Take(10).Select(x=>x.Content)).Should().BeTrue();
        }
    }
}