using Application.Posts.Queries.GetPostFeedWithPagination;
using static Application.FunctionalTests.Testing;
using ValidationException = Application.Common.Exceptions.ValidationException;
using Bogus;
using Application.Posts.Commands.CreatePost;

namespace Application.FunctionalTests.Posts.Queries
{
    public class GetPostFeedWithPaginationTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldValidationFields()
        {
            await RunAsDefaultUserAsync();
            var command = new GetPostFeedWithPaginationQuery(){
                PageSize = 0,
                PageNumber = 0
            };

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized(){
            var action = () => SendAsync(new GetPostFeedWithPaginationQuery(){ PageNumber = 1, PageSize = 10 });
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldReturnPostFeedWithPagination(){
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

            var query = new GetPostFeedWithPaginationQuery(){
                PageNumber = 1,
                PageSize = 10,
            };
            //Act
            var posts = await SendAsync(query);
            //Assert
            posts.Should().NotBeNull();
            posts.PageNumber.Should().Be(1);
            posts.TotalPages.Should().Be(2);
            posts.TotalCount.Should().Be(20);
            posts.HasNextPage.Should().BeTrue();
            posts.HasPreviousPage.Should().BeFalse();
            posts.Items.Count.Should().Be(10);
            //post orderby desc so command should be reverse
            commands.Reverse();
            posts.Items.Select(x=>x.Content)
            .SequenceEqual(commands.Take(10).Select(x=>x.Content)).Should().BeTrue();
        }
    }
}