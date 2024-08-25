using Application.Users.Queries.GetSuggestionFollow;
using Domain.Entities;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Users.Queries
{
    public class GetSuggetionFollowTests : BaseTestFixture
    {
        [Test]
        public async Task ShoudRequireAuthorized()
        {
            var action = () => SendAsync(new GetSuggestionFollowQuery());
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldReturnSuggestionFollow(){
            // Arrange
            var adminId = await RunAsAdministratorAsync();
            await RunAsDefaultUserAsync();
            //Act
            var users = await SendAsync(new GetSuggestionFollowQuery());

            //Assert
            users.Count().Should().Be(1);
            users.First().Id.Should().Be(adminId);
        }
    }
}