using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Conversations.Queries.GetMyConversationsWithPagination
{
    public class GetMyConversationsWithPaginationQueryValidator : AbstractValidator<GetMyConversationsWithPaginationQuery>
    {
        public GetMyConversationsWithPaginationQueryValidator()
        {
            RuleFor(x => x.PageNumber).GreaterThan(0).WithMessage("PageNumber at least greater than or equal to 1.");
            RuleFor(x => x.PageSize).GreaterThan(0).WithMessage("PageSize at least greater than or equal to 1.");
        }
    }
}