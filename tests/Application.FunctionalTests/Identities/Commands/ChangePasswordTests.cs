using Application.Identities.Commands.ChangePassword;
using Domain.Entities;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Identities.Commands
{
    public class ChangePasswordTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new ChangePasswordCommand();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized()
        {
            var command = new ChangePasswordCommand()
            {
                OldPassword = "Test123456@",
                NewPassword = "New123456@"
            };

            var action = () => SendAsync(command);
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldChangePasswordIfCorrectPassowrd()
        {
            //Arrange
            var userId = await RunAsDefaultUserAsync();
            var command = new ChangePasswordCommand()
            {
                OldPassword = "Testing1234!", //This is correct password
                NewPassword = "Testing1234@",
            };

            //Act
            var result = await SendAsync(command);

            //Assert
            result.Should().BeTrue();
            var newUserInfo = await FindAsync<User>(userId);
            VerifyHashedPassword(newUserInfo!,command.NewPassword,newUserInfo!.PasswordHash!).Should().BeTrue();
        }

        [Test]
        public async Task ShouldNotChangePasswordIfIncorrectPassowrd()
        {
            //Arrange
            var userId = await RunAsDefaultUserAsync();
            var command = new ChangePasswordCommand()
            {
                OldPassword = "Testing1234", //This is incorrect password
                NewPassword = "Testing1234@",
            };

            //Act
            var action = () => SendAsync(command);

            //Assert
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }
    }
}