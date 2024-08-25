using Application.Users.Commands.FollowUser;
using Application.Users.Queries.GetFollowInfo;
using static Application.FunctionalTests.Testing;
namespace Application.FunctionalTests.Users.Queries
{
    public class GetFollowInfoTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new GetFollowInfoQuery();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized()
        {
            var query = new GetFollowInfoQuery
            {
                UserId = "Valid"
            };

            var action = () => SendAsync(query);
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldReturnFollowedWhenUserFollowed(){
            //Arrange
            var adminId = await RunAsAdministratorAsync();
            await RunAsDefaultUserAsync();
            await SendAsync(new FollowUserCommand(){UserId = adminId});
            var query = new GetFollowInfoQuery(){UserId = adminId};

            //Act
            var result = await SendAsync(query);

            //Assert
            result.Should().NotBeNull();
            result!.isFollowedByUser.Should().BeTrue();
        }

        [Test]
        public async Task ShouldReturnNotFollowedWhenUserNotFollowed(){
            //Arrange
            var adminId = await RunAsAdministratorAsync();
            await RunAsDefaultUserAsync();
            var query = new GetFollowInfoQuery(){UserId = adminId};

            //Act
            var result = await SendAsync(query);

            //Assert
            result.Should().NotBeNull();
            result!.isFollowedByUser.Should().BeFalse();
        }
    }
}