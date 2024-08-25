using Application.Users.Commands.AddFriend;
using Application.Users.Commands.UnFriend;
using Domain.Entities;
using static Application.FunctionalTests.Testing;

namespace Application.FunctionalTests.Users.Commands
{
    public class UnFriendTests : BaseTestFixture
    {
        [Test]
        public async Task ShouldRequireMinimumFields()
        {
            await RunAsDefaultUserAsync();
            var command = new UnFriendCommand();

            await FluentActions.Invoking(() =>
                SendAsync(command)).Should().ThrowAsync<ValidationException>();
        }

        [Test]
        public async Task ShoudRequireAuthorized(){
            var command = new UnFriendCommand
            {
                UserId = "Valid"
            };

            var action = () => SendAsync(command);
            await action.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task ShoudCancelAddFriend()
        {
            //Arrange
            var adminId = await RunAsAdministratorAsync();
            var userId = await RunAsDefaultUserAsync();
            await SendAsync(new AddFriendCommand(){UserId = adminId});
            var command = new UnFriendCommand(){UserId = adminId};

            //Act
            await SendAsync(command);

            //Assert
            var user = await FindIncludeAsync<User,ICollection<FriendRelation>>(x=>x.Id == userId,x=>x.FriendRelationSenders);
            user.Should().NotBeNull();
            user!.FriendRelationSenders.Should().NotContain(x=>x.ReceiverId == adminId);
        }

        [Test]
        public async Task ShoudRejectAddFriend()
        {
            //Arrange
            var adminId = await RunAsAdministratorAsync();
            var userId = await RunAsDefaultUserAsync();
            await SendAsync(new AddFriendCommand(){UserId = adminId});
            await RunAsAdministratorAsync();
            var command = new UnFriendCommand(){UserId = userId};

            //Act
            await SendAsync(command);

            //Assert
            var user = await FindIncludeAsync<User,ICollection<FriendRelation>>(x=>x.Id == userId,x=>x.FriendRelationSenders);
            user.Should().NotBeNull();
            user!.FriendRelationSenders.Should().NotContain(x=>x.ReceiverId == adminId);
        }

        [Test]
        public async Task ShouldUnFriend()
        {
             //Arrange
            var adminId = await RunAsAdministratorAsync();
            var userId = await RunAsDefaultUserAsync();
            await SendAsync(new AddFriendCommand(){UserId = adminId});
            await RunAsAdministratorAsync();
            await SendAsync(new AddFriendCommand(){UserId = userId});
            var command = new UnFriendCommand(){UserId = userId};

            //Act
            await SendAsync(command);
             //Assert
            var user = await FindIncludeAsync<User,ICollection<FriendRelation>>(x=>x.Id == userId,x=>x.FriendRelationSenders);
            user.Should().NotBeNull();
            user!.FriendRelationSenders.Should().NotContain(x=>x.ReceiverId == adminId);
        }
    }
}