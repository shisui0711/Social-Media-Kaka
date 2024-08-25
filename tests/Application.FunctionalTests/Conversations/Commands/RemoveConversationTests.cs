using Application.Conversations.Commands.EnsureCreatedConversation;
using Application.Conversations.Commands.RemoveConversation;
using Domain.Entities;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Conversations.Commands
{
    public class RemoveConversationTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new RemoveConversationCommand();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized()
        {
            var query = new RemoveConversationCommand
            {
                ConversationId = "Valid"
            };

            var action = () => SendAsync(query);
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldRemoveConversation()
        {
            // Arrange
            var adminId = await RunAsAdministratorAsync();
            await RunAsDefaultUserAsync();
            var conversation = await SendAsync(new EnsureCreatedConversationCommand(){
                ReceiverId = adminId
            });
            var command = new RemoveConversationCommand(){ConversationId = conversation.Id};

            // Act
            var removedConversation = await SendAsync(command);
            var conversationExists = await FindAsync<Conversation>(conversation.Id);

            // Assert
            conversationExists.Should().BeNull();
            removedConversation.Id.Should().Be(conversation.Id);
        }
    }
}