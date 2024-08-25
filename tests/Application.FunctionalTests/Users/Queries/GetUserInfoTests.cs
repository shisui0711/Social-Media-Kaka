using Application.Users.Queries.GetUserInfo;
using Domain.Entities;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Users.Queries
{
    public class GetUserInfoTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new GetUserInfoQuery();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized()
        {
            var query = new GetUserInfoQuery
            {
                UserName = "Valid"
            };

            var action = () => SendAsync(query);
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldReturnUserInfo()
        {
            //Arrange
            var adminId = await RunAsAdministratorAsync();
            var admin = await FindAsync<User>(adminId);
            await RunAsDefaultUserAsync();

            var query = new GetUserInfoQuery(){UserName = admin!.UserName!};

            //Act
            var result = await SendAsync(query);

            //Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(adminId);
            result.UserName.Should().Be(admin.UserName);
            result.FirstName.Should().Be(admin.FirstName);
            result.LastName.Should().Be(admin.LastName);
        }
    }
}