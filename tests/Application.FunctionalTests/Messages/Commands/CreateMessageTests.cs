using Application.Conversations.Commands.EnsureCreatedConversation;
using Application.Messages.Commands.CreateMessage;
using Domain.Entities;
using static Application.FunctionalTests.Testing;


namespace Application.FunctionalTests.Messages.Commands
{
    public class CreateMessageTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new CreateMessageCommand();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized(){
            var command = new CreateMessageCommand
            {
                ConversationId = "Valid",
                Content = "Valid",
                ReceiverId = "Valid",
                SenderId = "Valid"
            };

            var action = () => SendAsync(command);
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldCreateMessage()
        {
            //Arrange
            var adminId = await RunAsAdministratorAsync();
            var userId = await RunAsDefaultUserAsync();
            var conversation = await SendAsync(new EnsureCreatedConversationCommand(){
                ReceiverId = adminId
            });
            var command = new CreateMessageCommand()
            {
                ConversationId = conversation.Id,
                Content = "Valid",
                ReceiverId = adminId,
                SenderId = userId
            };

            //Act
            var result = await SendAsync(command);

            //Assert
            var message = await FindAsync<Message>(result.Id);
            message.Should().NotBeNull();
            message!.Id.Should().NotBeEmpty();
            message.ConversationId.Should().Be(conversation.Id);
            message.Content.Should().Be(command.Content);
            message.SenderId.Should().Be(userId);
            message.ReceiverId.Should().Be(adminId);
        }
    }
}