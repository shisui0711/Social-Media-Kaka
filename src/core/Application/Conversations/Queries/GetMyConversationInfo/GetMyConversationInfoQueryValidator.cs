

namespace Application.Conversations.Queries.GetMyConversationInfo
{
    public class GetMyConversationInfoQueryValidator : AbstractValidator<GetMyConversationInfoQuery>
    {
        public GetMyConversationInfoQueryValidator()
        {
            RuleFor(x=>x.ConversationId).NotEmpty().WithMessage("ConversationId is required");
        }
    }
}