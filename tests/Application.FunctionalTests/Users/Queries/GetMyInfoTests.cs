using Application.Users.Queries.GetMyInfo;
using Domain.Entities;
using static Application.FunctionalTests.Testing;


namespace Application.FunctionalTests.Users.Queries
{
    public class GetMyInfoTests : BaseTestFixture
    {

        [Test]
        public async Task ShoudRequireAuthorized()
        {
            var action = () => SendAsync(new GetMyInfoQuery());
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShoudReturnMyInfo(){
            // Arrange
            var userId = await RunAsDefaultUserAsync();
            var user = await FindAsync<User>(userId);

            // Act
            var result = await SendAsync(new GetMyInfoQuery());

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(user!.Id);
            result.UserName.Should().Be(user.UserName);
            result.FirstName.Should().Be(user.FirstName);
            result.LastName.Should().Be(user.LastName);
            result.Email.Should().Be(user.Email);
        }
    }
}