using Application.Identities.Queries;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Identities.Queries
{
    public class GetRefreshTokenTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldReturnToken()
        {
            // Arrange
            await RunAsDefaultUserAsync();
            var query = new GetRefreshTokenQuery();

            // Act
            var result = await SendAsync(query);

            // Assert
            result.Should().NotBeNull();
            result.Token.Should().NotBeNullOrEmpty();
            result.RefreshToken.Should().NotBeNullOrEmpty();
        }
    }
}