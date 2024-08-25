using Application.Users.Commands.FollowUser;
using Domain.Entities;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Users.Commands
{
    public class FollowUserTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new FollowUserCommand();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized(){
            var command = new FollowUserCommand
            {
                UserId = "Valid"
            };

            var action = () => SendAsync(command);
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldFollowUser(){
            //Arrange
            var adminId = await RunAsAdministratorAsync();
            var userId = await RunAsDefaultUserAsync();

            var command = new FollowUserCommand(){UserId = adminId};

            //Act
            await SendAsync(command);

            //Assert
            var user = await FindIncludeAsync<User,ICollection<Follow>>(x=>x.Id == userId,x=>x.Followings);
            user.Should().NotBeNull();
            user!.Followings.Should().Contain(x=>x.FollowingId == adminId);
        }
    }
}