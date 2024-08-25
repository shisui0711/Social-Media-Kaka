

using System.Reflection;
using System.Runtime.CompilerServices;
using Application.Common.Interfaces;
using Application.Common.Models;
using AutoMapper;
using Domain.Entities;

namespace Application.UnitTests.Common.Mappings
{
    public class MappingTests
{
    private readonly IConfigurationProvider _configuration;
    private readonly IMapper _mapper;

    public MappingTests()
    {
        _configuration = new MapperConfiguration(config =>
            config.AddMaps(Assembly.GetAssembly(typeof(IApplicationDbContext))));

        _mapper = _configuration.CreateMapper();
    }

    [Test]
    public void ShouldHaveValidConfiguration()
    {
        _configuration.AssertConfigurationIsValid();
    }

    [Test]
    [TestCase(typeof(Post), typeof(PostDto))]
    [TestCase(typeof(Comment), typeof(CommentDto))]
    [TestCase(typeof(Message), typeof(MessageDto))]
    [TestCase(typeof(Conversation), typeof(ConversationDto))]
    [TestCase(typeof(ConversationMember), typeof(ConversationMemberDto))]
    [TestCase(typeof(Like), typeof(LikeDto))]
    [TestCase(typeof(Follow), typeof(FollowDto))]
    [TestCase(typeof(CommentLike), typeof(CommentLikeDto))]
    [TestCase(typeof(Bookmark), typeof(BookmarkDto))]
    [TestCase(typeof(Notification), typeof(NotificationDto))]
    [TestCase(typeof(PostMedia), typeof(PostMediaDto))]
    [TestCase(typeof(User), typeof(UserDto))]
    [TestCase(typeof(User), typeof(MyUserDto))]
    // [TestCase(typeof(FriendRelation), typeof(FriendRelationDto))]
    public void ShouldSupportMappingFromSourceToDestination(Type source, Type destination)
    {
        var instance = GetInstanceOf(source);

        _mapper.Map(instance, source, destination);
    }

    private object GetInstanceOf(Type type)
    {
        if (type.GetConstructor(Type.EmptyTypes) != null)
            return Activator.CreateInstance(type)!;

        // Type without parameterless constructor
        return RuntimeHelpers.GetUninitializedObject(type);
    }
}
}