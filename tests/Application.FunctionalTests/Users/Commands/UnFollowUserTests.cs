using Application.Users.Commands.FollowUser;
using Application.Users.Commands.UnFollowUser;
using Domain.Entities;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Users.Commands
{
    public class UnFollowUserTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new UnFollowUserCommand();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized(){
            var command = new UnFollowUserCommand
            {
                UserId = "Valid"
            };

            var action = () => SendAsync(command);
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldUnFollowUser(){
            //Arrange
            var adminId = await RunAsAdministratorAsync();
            var userId = await RunAsDefaultUserAsync();
            await SendAsync(new FollowUserCommand(){UserId = adminId});
            var command = new UnFollowUserCommand(){UserId = adminId};

            //Act
            await SendAsync(command);

            //Assert
            var user = await FindIncludeAsync<User,ICollection<Follow>>(x=>x.Id == userId,x=>x.Followings);
            user.Should().NotBeNull();
            user!.Followings.Should().NotContain(x=>x.FollowingId == adminId);
        }
    }
}