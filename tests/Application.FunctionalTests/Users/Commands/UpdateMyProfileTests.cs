using Application.Users.Commands.UpdateMyProfile;
using Domain.Entities;
using Domain.Errors;
using Domain.Exceptions;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Users.Commands
{
    public class UpdateMyProfileTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new UpdateMyProfileCommand();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized(){
            var command = new UpdateMyProfileCommand
            {
                FirstName = "John",
                LastName = "Doe",
                UserName = "john.doe",
            };

            var action = () => SendAsync(command);
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldUpdateMyProfileExcludeUserName(){
            //Arrange
            var userId = await RunAsDefaultUserAsync();
            var user = await FindAsync<User>(userId);
            var oldUserName = user!.UserName;
            var command = new UpdateMyProfileCommand()
            {
                FirstName = "John",
                LastName = "Doe",
                UserName = oldUserName!,
                Bio = "Test"
            };

            //Act
            await SendAsync(command);

            //Assert
            var updatedUser = await FindAsync<User>(userId);
            updatedUser!.UserName.Should().Be(oldUserName);
            updatedUser.FirstName.Should().Be(command.FirstName);
            updatedUser.LastName.Should().Be(command.LastName);
            updatedUser.Bio.Should().Be(command.Bio);
        }

        [Test]
        public async Task TaskShouldUpdateMyProfileIncludeUserNameWhenNotLimitExceeded(){
            //Arrange
            var userId = await RunAsDefaultUserAsync();
            var user = await FindAsync<User>(userId);
            var oldUserName = user!.UserName;
            await SendAsync(new UpdateMyProfileCommand()
            {
                FirstName = "John",
                LastName = "Doe",
                UserName = oldUserName!,
                Bio = "Test"
            });

            var command = new UpdateMyProfileCommand()
            {
                FirstName = "John",
                LastName = "Doe",
                UserName = "NewUserName",
                Bio = "Test"
            };

            //Act
            await SendAsync(command);

            //Assert
            var updatedUser = await FindAsync<User>(userId);
            updatedUser!.UserName.Should().Be("NewUserName");
            updatedUser.FirstName.Should().Be(command.FirstName);
            updatedUser.LastName.Should().Be(command.LastName);
            updatedUser.Bio.Should().Be(command.Bio);
        }

        [Test]
        public async Task ShouldThrowExceptionWhenLimitExceeded(){
            //Arrange
            var userId = await RunAsDefaultUserAsync();
            var user = await FindAsync<User>(userId);
            var oldUserName = user!.UserName;
            await SendAsync(new UpdateMyProfileCommand()
            {
                FirstName = "John",
                LastName = "Doe",
                UserName = "NewUserName",
                Bio = "Test"
            });

            var command = new UpdateMyProfileCommand()
            {
                FirstName = "John",
                LastName = "Doe",
                UserName = "NewerUserName",
                Bio = "Test"
            };

            //Act
            var action = () => SendAsync(command);

            //Assert
            var ex = await action.Should().ThrowAsync<DomainException>();
            ex.Subject.First().Error.Should().Be(DomainErrors.User.UserNameChangeLimitExceeded);
        }
    }
}