

namespace Application.Messages.Queries.GetMyMessagesWithPagination
{
    public class GetMyMessagesWithPaginationCommandValidator : AbstractValidator<GetMyMessagesWithPaginationQuery>
    {
        public GetMyMessagesWithPaginationCommandValidator()
        {
            RuleFor(x=>x.ConversationId).NotEmpty().WithMessage("ConversationId is required");
            RuleFor(x => x.PageNumber).GreaterThan(0).WithMessage("PageNumber at least greater than or equal to 1.");
            RuleFor(x => x.PageSize).GreaterThan(0).WithMessage("PageSize at least greater than or equal to 1.");
        }
    }
}