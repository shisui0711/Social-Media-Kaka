using Application.Posts.Commands.CreatePost;
using Application.Posts.Queries;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Posts.Queries
{
    public class GetTrendingTagTests : BaseTestFixture
    {

        [Test]
        public async Task ShoudRequireAuthorized()
        {
            var action = () => SendAsync(new GetTrendingTagQuery());
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldReturnTrendingTag()
        {
            // Arrange
            await RunAsDefaultUserAsync();
            await SendAsync(new CreatePostCommand(){Content = $"#first {Guid.NewGuid()}"});
            await SendAsync(new CreatePostCommand(){Content = $"#first {Guid.NewGuid()}"});
            await SendAsync(new CreatePostCommand(){Content = $"#first {Guid.NewGuid()}"});
            await SendAsync(new CreatePostCommand(){Content = $"#second {Guid.NewGuid()}"});
            await SendAsync(new CreatePostCommand(){Content = $"#second {Guid.NewGuid()}"});
            await SendAsync(new CreatePostCommand(){Content = $"#three {Guid.NewGuid()}"});
            await SendAsync(new CreatePostCommand(){Content = $"#four {Guid.NewGuid()}"});
            await SendAsync(new CreatePostCommand(){Content = $"#five {Guid.NewGuid()}"});

            var query = new GetTrendingTagQuery();

            // Act
            var response = await SendAsync(query);

            // Assert
            response.Should().NotBeNull();
            response.Count().Should().Be(5);
            response.First().Tag.Should().Be("#first");
            response.First().Count.Should().Be(3);
            response.Skip(1).First().Tag.Should().Be("#second");
            response.Skip(1).First().Count.Should().Be(2);
            response.Skip(2).First().Tag.Should().Be("#five");
            response.Skip(2).First().Count.Should().Be(1);
        }
    }
}