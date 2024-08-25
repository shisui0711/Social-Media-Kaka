using Application.Users.Commands.AddFriend;
using Application.Users.Queries.GetFriendInfo;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Users.Queries
{
    public class GetFriendInfoTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new GetFriendInfoQuery();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized()
        {
            var query = new GetFriendInfoQuery
            {
                UserId = "Valid"
            };

            var action = () => SendAsync(query);
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShoudReturnSendedWhenUserAddFriend()
        {
            //Arrange
            var adminId = await RunAsAdministratorAsync();
            await RunAsDefaultUserAsync();
            await SendAsync(new AddFriendCommand(){UserId = adminId});
            var query = new GetFriendInfoQuery(){ UserId = adminId};

            //Act
            var result = await SendAsync(query);

            //Assert
            result.Should().NotBeNull();
            result!.isSended.Should().BeTrue();
            result.isFriend.Should().BeFalse();
        }

        [Test]
        public async Task ShoudReturnNotSendedWhenUserNotAddFriend()
        {
            //Arrange
            var adminId = await RunAsAdministratorAsync();
            await RunAsDefaultUserAsync();
            var query = new GetFriendInfoQuery(){ UserId = adminId};

            //Act
            var result = await SendAsync(query);

            //Assert
            result.Should().NotBeNull();
            result!.isSended.Should().BeFalse();
        }

        [Test]
        public async Task ShouReturnIsFriendWhenUserAccepted()
        {
            //Arrange
            var adminId = await RunAsAdministratorAsync();
            var userId = await RunAsDefaultUserAsync();
            await SendAsync(new AddFriendCommand(){UserId = adminId});
            await RunAsAdministratorAsync();
            await SendAsync(new AddFriendCommand(){UserId = userId});
            var query = new GetFriendInfoQuery(){ UserId = userId};

            //Act
            var result = await SendAsync(query);

            //Assert
            result.Should().NotBeNull();
            result!.isFriend.Should().BeTrue();
        }
    }
}