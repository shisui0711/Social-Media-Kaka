using Application.Users.Commands.ChangeBirthDay;
using Domain.Entities;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Users.Commands
{
    public class ChangeBirthDayTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new ChangeBirthDayCommand();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized()
        {
            var command = new ChangeBirthDayCommand
            {
                BirhtDay = DateTime.Now
            };

            var action = () => SendAsync(command);
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldChangeBirthDay()
        {
            //Arrange
            var userId = await RunAsDefaultUserAsync();
            var command = new ChangeBirthDayCommand(){BirhtDay = DateTime.Now};
            //Act
            var result = await SendAsync(command);

            //Assert
            var user = await FindAsync<User>(userId);
            user!.BirthDay.Should().BeSameDateAs(command.BirhtDay);
            result.Should().BeTrue();
        }

        [Test]
        public async Task ShoudNotChangeBirthDayIfLastChangeGreatThan30Days()
        {
            //Arrange
            var userId = await RunAsDefaultUserAsync();
            var date = DateTime.Now.AddDays(-1);
            await SendAsync(new ChangeBirthDayCommand(){BirhtDay = date});
            var command = new ChangeBirthDayCommand(){BirhtDay = DateTime.Now};
            //Act
            var result = await SendAsync(command);

            //Assert
            result.Should().BeFalse();
            var user = await FindAsync<User>(userId);
            user!.BirthDay.Should().BeSameDateAs(date);
        }
    }
}