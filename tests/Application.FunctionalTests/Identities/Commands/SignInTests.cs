using Application.Identities.Commands.SignIn;
using Application.Identities.Commands.SignUp;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Identities.Commands
{
    public class SignInTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            var command = new SignInCommand();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShouldSignInUserWhenCorrectPassword()
        {
            //Arrange
            await SendAsync(new SignUpCommand
            {
                Email = "test@test.com",
                Password = "Test123456@",
                FirstName = "John",
                LastName = "Doe",
                Username = "johndoe"
            });
            var command = new SignInCommand()
            {
                Username = "johndoe",
                Password = "Test123456@"
            };

            //Act
            var response = await SendAsync(command);

            //Assert
            response.Should().NotBeNull();
            response.Token.Should().NotBeNullOrEmpty();
            response.RefreshToken.Should().NotBeNullOrEmpty();
        }

        [Test]
        public async Task ShouldNotSignInUserWhenIncorrectPassword()
        {
            //Arrange
            await SendAsync(new SignUpCommand
            {
                Email = "test@test.com",
                Password = "Test123456@",
                FirstName = "John",
                LastName = "Doe",
                Username = "johndoe"
            });
            var command = new SignInCommand()
            {
                Username = "johndoe",
                Password = "Incorrect"
            };

            //Act
            var action = () => SendAsync(command);

            //Assert
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }
    }
}