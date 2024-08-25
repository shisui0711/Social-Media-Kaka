using Application.Conversations.Commands.EnsureCreatedConversation;
using Application.Conversations.Queries.GetMyConversationInfo;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Conversations.Queries
{
    public class GetMyConversationInfoTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new GetMyConversationInfoQuery();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized()
        {
            var query = new GetMyConversationInfoQuery
            {
                ConversationId = "Valid"
            };

            var action = () => SendAsync(query);
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldReturnConversationInfo()
        {
            //Arrange
            var adminId = await RunAsAdministratorAsync();
            var userId = await RunAsDefaultUserAsync();
            var conversation = await SendAsync(new EnsureCreatedConversationCommand(){
                ReceiverId = adminId
            });

            var query = new GetMyConversationInfoQuery(){ConversationId = conversation.Id};

            //Act
            var result = await SendAsync(query);

            //Assert
            result.Id.Should().Be(conversation.Id);
            result.ConversationMembers.Should().Contain(x=>x.UserId == userId);
            result.ConversationMembers.Should().Contain(x=>x.UserId == adminId);
        }
    }
}