using Application.Users.Commands.AddFriend;
using Application.Users.Queries.GetMyFriendByName;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Users.Queries
{
    public class GetMyFriendByNameTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new GetMyFriendByNameQuery();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized()
        {
            var query = new GetMyFriendByNameQuery
            {
                Name = "Valid"
            };

            var action = () => SendAsync(query);
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShoudReturnMyFriends()
        {
            //Arrange
            var adminId = await RunAsAdministratorAsync();
            var userId = await RunAsDefaultUserAsync();
            await SendAsync(new AddFriendCommand(){UserId = adminId});
            await RunAsAdministratorAsync();
            await SendAsync(new AddFriendCommand(){UserId = userId});
            var query = new GetMyFriendByNameQuery(){Name = "test"};

            //Act
            var result = await SendAsync(query);

            //Assert
            result.Should().HaveCount(1);
            result.First().Id.Should().Be(userId);
        }
    }
}