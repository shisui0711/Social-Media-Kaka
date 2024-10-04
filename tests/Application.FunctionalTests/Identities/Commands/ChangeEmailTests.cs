using Application.Identities.Commands.ChangeEmail;
using Domain.Entities;
using Domain.Errors;
using Domain.Exceptions;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Identities.Commands
{
    public class ChangeEmailTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new ChangeEmailCommand();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized()
        {
            var command = new ChangeEmailCommand
            {
                Email = "newemail@example.com"
            };

            var action = () => SendAsync(command);
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }


        [Test]
        public async Task ShouldChangeEmailIfCorrectPassowrd()
        {
            //Arrange
            var userId = await RunAsDefaultUserAsync();
            var command = new ChangeEmailCommand()
            {
                Email = "newemail@example.com",
                Password = "Testing1234!"
            };

            //Act
            var result = await SendAsync(command);

            //Assert
            result.Should().BeTrue();
            var user = await FindAsync<User>(userId);
            user!.Email.Should().Be(command.Email);
        }

        [Test]
        public async Task ShoudNotChangEmailIfLastChangeGreatThan30Days()
        {
            //Arrange
            var userId = await RunAsDefaultUserAsync();
            var email = "example@email.com";
            await SendAsync(new ChangeEmailCommand()
            {
                Email = email,
                Password = "Testing1234!"
            });
            var command = new ChangeEmailCommand()
            {
                Email = "valid@email.com",
                Password = "Testing1234!"
            };
            //Act
            var result = await SendAsync(command);

            //Assert
            result.Should().BeFalse();
            var user = await FindAsync<User>(userId);
            user!.Email.Should().Be(email);
        }

        [Test]
        public async Task ShoudNotChangEmailIfEmailAlreadyExists()
        {
            //Arrange
            await RunAsAdministratorAsync();
            var userId = await RunAsDefaultUserAsync();
            var command = new ChangeEmailCommand()
            {
                Email = "administratorlocal@email.com",
                Password = "Testing1234!"
            };

            //Act
            var action = () => SendAsync(command);

            //Assert
            var ex = await action.Should().ThrowAsync<DomainException>();
            ex.Subject.First().Error.Should().Be(DomainErrors.User.EmailAlreadyExists);
        }

        [Test]
        public async Task ShoudNotChangEmailIfPasswordIsIncorrect()
        {
            //Arrange
            var userId = await RunAsDefaultUserAsync();
            var command = new ChangeEmailCommand()
            {
                Email = "newemail@example.com",
                Password = "WrongPassword"
            };

            //Act
            var action = () => SendAsync(command);

            //Assert
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }
    }
}