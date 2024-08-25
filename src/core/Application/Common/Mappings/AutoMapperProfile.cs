
using Application.Common.Models;
using Application.Identities.Commands.SignUp;
using Application.Users.Commands.UpdateMyProfile;
using Domain.Entities;
using AutoMapper.Configuration;
#if NET8_0_OR_GREATER
using System.Runtime.CompilerServices;
#else
using System.Reflection;
#endif

namespace Application.Common.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<SignUpCommand, User>()
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Username))
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"))
                .ForAllOtherMembers(opt => opt.Ignore());

            CreateMap<UpdateMyProfileCommand, User>()
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserName))
                .ForMember(dest => dest.Bio, opt => opt.MapFrom(src => src.Bio))
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"))
                .ForAllOtherMembers(opt => opt.Ignore());

            // CreateMap<GoogleSignUpRequest, User>();
            CreateMap<User, MyUserDto>();
            CreateMap<User, UserDto>();
            CreateMap<Post, PostDto>();
            CreateMap<Notification, NotificationDto>();
            CreateMap<Like, LikeDto>();
            CreateMap<CommentLike, CommentLikeDto>();
            CreateMap<Follow, FollowDto>();
            CreateMap<Bookmark, BookmarkDto>();
            CreateMap<Comment, CommentDto>();
            CreateMap<Message, MessageDto>();
            CreateMap<Conversation, ConversationDto>();
            CreateMap<ConversationMember, ConversationMemberDto>();
            CreateMap<PostMedia, PostMediaDto>();
        }
    }
    public static class AutoMapperExtensions
    {
#if NET8_0_OR_GREATER
        [UnsafeAccessor(UnsafeAccessorKind.Method, Name = "get_TypeMapActions")]
        private static extern List<Action<TypeMap>> GetTypeMapActions(TypeMapConfiguration typeMapConfiguration);
#else
    private static readonly PropertyInfo TypeMapActionsProperty = typeof(TypeMapConfiguration).GetProperty("TypeMapActions", BindingFlags.NonPublic | BindingFlags.Instance)!;
#endif

        public static void ForAllOtherMembers<TSource, TDestination>(this IMappingExpression<TSource, TDestination> expression, Action<IMemberConfigurationExpression<TSource, TDestination, object>> memberOptions)
        {
            var typeMapConfiguration = (TypeMapConfiguration)expression;

#if NET8_0_OR_GREATER
            var typeMapActions = GetTypeMapActions(typeMapConfiguration);
#else
        var typeMapActions = (List<Action<TypeMap>>)TypeMapActionsProperty.GetValue(typeMapConfiguration)!;
#endif

            typeMapActions.Add(typeMap =>
            {
                var destinationTypeDetails = typeMap.DestinationTypeDetails;

                foreach (var accessor in destinationTypeDetails.WriteAccessors.Where(m => typeMapConfiguration.GetDestinationMemberConfiguration(m) == null))
                {
                    expression.ForMember(accessor.Name, memberOptions);
                }
            });
        }
    }
}