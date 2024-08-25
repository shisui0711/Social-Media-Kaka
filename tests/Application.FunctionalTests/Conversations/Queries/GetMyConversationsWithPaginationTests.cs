
using Application.Conversations.Commands.EnsureCreatedConversation;
using Application.Conversations.Queries.GetMyConversationsWithPagination;
using Application.Messages.Commands.CreateMessage;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Conversations.Queries
{
    public class GetMyConversationsWithPaginationTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldValidationFields()
        {
            await RunAsDefaultUserAsync();
            var command = new GetMyConversationsWithPaginationQuery(){
                PageSize = 0,
                PageNumber = 0
            };

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized(){
            var action = () => SendAsync(new GetMyConversationsWithPaginationQuery(){ PageNumber = 1, PageSize = 10 });
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldReturnConversations()
        {
            //Arrange
            var adminId = await RunAsAdministratorAsync();
            var userId = await RunAsDefaultUserAsync();
            var conversation = await SendAsync(new EnsureCreatedConversationCommand(){
                ReceiverId = adminId
            });
            await SendAsync(new CreateMessageCommand(){
                ConversationId = conversation.Id,
                Content = "Hello world",
                ReceiverId = adminId,
                SenderId = userId
            });
            var query = new GetMyConversationsWithPaginationQuery(){PageNumber = 1, PageSize = 10};

            //Act
            var result = await SendAsync(query);

            //Assert
            result.Should().NotBeNull();
            result.Items.Should().NotBeNull();
            result.Items.Should().HaveCount(1);
            result.Items.Should().Contain(c => c.Id == conversation.Id);
        }

    }
}