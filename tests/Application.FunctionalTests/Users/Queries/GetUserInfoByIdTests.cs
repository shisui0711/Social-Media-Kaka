using Application.Users.Queries.GetUserInfoById;
using Domain.Entities;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Users.Queries
{
    public class GetUserInfoByIdTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new GetUserInfoByIdQuery();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized()
        {
            var query = new GetUserInfoByIdQuery
            {
                UserId = "Valid"
            };

            var action = () => SendAsync(query);
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldReturnUserInfo(){
            //Arrange
            var adminId = await RunAsAdministratorAsync();
            var admin = await FindAsync<User>(adminId);
            await RunAsDefaultUserAsync();

            var query = new GetUserInfoByIdQuery(){UserId = admin!.Id};

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