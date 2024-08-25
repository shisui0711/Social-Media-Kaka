using Application.Users.Commands.AddFriend;
using Domain.Entities;
using static Application.FunctionalTests.Testing;
namespace Application.FunctionalTests.Users.Commands
{
    public class AddFriendTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new AddFriendCommand();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized(){
            var command = new AddFriendCommand
            {
                UserId = "Valid"
            };

            var action = () => SendAsync(command);
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShoudAddFriend()
        {
            //Arrange
            var adminId = await RunAsAdministratorAsync();
            var userId = await RunAsDefaultUserAsync();

            var command = new AddFriendCommand(){UserId = adminId};

            //Act
            await SendAsync(command);

            //Assert
            var user = await FindIncludeAsync<User,ICollection<FriendRelation>>(x=>x.Id == userId,x=>x.FriendRelationSenders);
            user.Should().NotBeNull();
            user!.FriendRelationSenders.FirstOrDefault(x=>x.ReceiverId == adminId).Should().NotBeNull();
            user.FriendRelationSenders.FirstOrDefault(x=>x.ReceiverId == adminId)!.Accepted.Should().BeFalse();
        }

        [Test]
        public async Task ShouldAcceptIfAlreadyExistAddFriend()
        {
            //Arrange
            var adminId = await RunAsAdministratorAsync();
            var userId = await RunAsDefaultUserAsync();
            await SendAsync(new AddFriendCommand(){UserId = adminId});
            await RunAsAdministratorAsync();
            var command = new AddFriendCommand(){UserId = userId};

            //Act
            await SendAsync(command);

            //Assert
            var user = await FindIncludeAsync<User,ICollection<FriendRelation>>(x=>x.Id == adminId,x=>x.FriendRelationReceivers);
            user.Should().NotBeNull();
            user!.FriendRelationReceivers.FirstOrDefault(x=>x.ReceiverId == adminId).Should().NotBeNull();
            user.FriendRelationReceivers.FirstOrDefault(x=>x.ReceiverId == adminId)!.Accepted.Should().BeTrue();
        }
    }
}