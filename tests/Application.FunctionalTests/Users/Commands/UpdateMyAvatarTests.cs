using Application.Users.Commands.UpdateMyAvatar;
using Domain.Entities;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Users.Commands
{
    public class UpdateMyAvatarTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new UpdateMyAvatarCommand();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized(){
            var command = new UpdateMyAvatarCommand
            {
                AvatarUrl = "Valid"
            };

            var action = () => SendAsync(command);
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldUpdateAvatar(){
            //Arrange
            var userId = await RunAsDefaultUserAsync();
            var command = new UpdateMyAvatarCommand()
            {
                AvatarUrl = "https://www.google.com",
            };

            //Act
            await SendAsync(command);

            //Assert
            var user = await FindAsync<User>(userId);
            user.Should().NotBeNull();
            user!.AvatarUrl.Should().Be("https://www.google.com");
        }
    }
}