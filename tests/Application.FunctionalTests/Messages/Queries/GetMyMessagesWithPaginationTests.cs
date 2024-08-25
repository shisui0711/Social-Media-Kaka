using Application.Conversations.Commands.EnsureCreatedConversation;
using Application.Messages.Queries.GetMyMessagesWithPagination;
using static Application.FunctionalTests.Testing;
using ValidationException = Application.Common.Exceptions.ValidationException;
using Bogus;
using Application.Messages.Commands.CreateMessage;

namespace Application.FunctionalTests.Messages.Queries
{
    public class GetMyMessagesWithPaginationTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldValidationFields()
        {
            await RunAsDefaultUserAsync();
            var command = new GetMyMessagesWithPaginationQuery(){
                PageSize = 0,
                PageNumber = 0
            };

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized(){
            var action = () => SendAsync(new GetMyMessagesWithPaginationQuery(){ PageNumber = 1, PageSize = 10 });
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShouldReturnMessages()
        {
            //Arrange
            var adminId = await RunAsAdministratorAsync();
            var userId = await RunAsDefaultUserAsync();
            var conversation = await SendAsync(new EnsureCreatedConversationCommand(){
                ReceiverId = adminId
            });
            Faker<CreateMessageCommand> faker = new Faker<CreateMessageCommand>();
            faker.RuleFor(x=>x.ConversationId, f=>conversation.Id);
            faker.RuleFor(x=>x.Content, f=>f.Lorem.Sentence());
            faker.RuleFor(x=>x.SenderId, f=>userId);
            faker.RuleFor(x=>x.ReceiverId, f=>adminId);

            var commands = faker.Generate(20);
            foreach(var command in commands){
                await SendAsync(command);
            }
            var query = new GetMyMessagesWithPaginationQuery(){
                PageNumber = 1,
                PageSize = 10,
                ConversationId = conversation.Id
            };

            //Act
            var result = await SendAsync(query);

            //Assert
            result.Should().NotBeNull();
            result.PageNumber.Should().Be(1);
            result.TotalPages.Should().Be(2);
            result.TotalCount.Should().Be(20);
            result.HasNextPage.Should().BeTrue();
            result.HasPreviousPage.Should().BeFalse();
            result.Items.Count.Should().Be(10);
        }
    }
}