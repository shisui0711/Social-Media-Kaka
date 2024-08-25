using Application.Conversations.Commands.EnsureCreatedConversation;
using Domain.Entities;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Conversations.Commands
{
    public class EnsureCreatedConversationTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new EnsureCreatedConversationCommand();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized()
        {
            var query = new EnsureCreatedConversationCommand
            {
                ReceiverId = "Valid"
            };

            var action = () => SendAsync(query);
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task EnsureCreatedConversation_ShouldReturnConversation()
        {
            var adminId = await RunAsAdministratorAsync();
            var userId = await RunAsDefaultUserAsync();
            // Arrange
            var command = new EnsureCreatedConversationCommand
            {
                ReceiverId = adminId
            };

            // Act
            var result = await SendAsync(command);

            // Assert
            var conversation = await FindIncludeAsync<Conversation,ICollection<ConversationMember>>(x=>x.Id == result.Id, x=>x.ConversationMembers);
            conversation.Should().NotBeNull();
            conversation!.CreatedBy.Should().Be(userId);
            conversation.ConversationMembers.Should().HaveCount(2);
            conversation.ConversationMembers.Should().Contain(x => x.UserId == userId);
            conversation.ConversationMembers.Should().Contain(x => x.UserId == adminId);
        }
    }
}