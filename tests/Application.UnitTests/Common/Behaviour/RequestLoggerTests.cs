
using Application.Common.Behaviours;
using Application.Common.Interfaces;
using Application.Posts.Commands.CreatePost;
using Microsoft.Extensions.Logging;
using Moq;

namespace Application.UnitTests.Common.Behaviour
{

    public class RequestLoggerTests
    {
        private Mock<ILogger<CreatePostCommand>> _logger = null!;
        private Mock<IUser> _user = null!;
        private Mock<IIdentityService> _identityService = null!;

        [SetUp]
        public void Setup()
        {
            _logger = new Mock<ILogger<CreatePostCommand>>();
            _user = new Mock<IUser>();
            _identityService = new Mock<IIdentityService>();
        }

        [Test]
        public async Task ShouldCallGetUserNameAsyncOnceIfAuthenticated()
        {
            _user.Setup(x => x.Id).Returns(Guid.NewGuid().ToString());

            var requestLogger = new LoggingBehaviour<CreatePostCommand>(_logger.Object, _user.Object, _identityService.Object);

            await requestLogger.Process(new CreatePostCommand { Content = "Hello World" }, new CancellationToken());

            _identityService.Verify(i => i.GetUserNameAsync(It.IsAny<string>()), Times.Once);
        }

        [Test]
        public async Task ShouldNotCallGetUserNameAsyncOnceIfUnauthenticated()
        {
            var requestLogger = new LoggingBehaviour<CreatePostCommand>(_logger.Object, _user.Object, _identityService.Object);

            await requestLogger.Process(new CreatePostCommand { Content = "Hello World" }, new CancellationToken());

            _identityService.Verify(i => i.GetUserNameAsync(It.IsAny<string>()), Times.Never);
        }
    }
}