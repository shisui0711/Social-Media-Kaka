using Application.Identities.Commands.SignUp;
using Domain.Entities;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Identities.Commands
{
    public class SignUpTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            var command = new SignUpCommand();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShouldSignUpUser()
        {
            // Arrange
            var command = new SignUpCommand
            {
                Email = "test@test.com",
                Password = "Test123456@",
                FirstName = "John",
                LastName = "Doe",
                Username = "johndoe"
            };

            // Act
            await SendAsync(command);

            // Assert
            var user = await FindByConditionAsync<User>(x=>x.UserName == command.Username);
            user.Should().NotBeNull();
            user!.UserName.Should().Be(command.Username);
            user.Email.Should().Be(command.Email);
            user.FirstName.Should().Be(command.FirstName);
            user.LastName.Should().Be(command.LastName);
        }
    }
}