using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Notifications.Queries.GetMyNotificationWithPagination
{
    public class GetMyNotifcationWithPaginationQueryValidator : AbstractValidator<GetMyNotifcationWithPaginationQuery>
    {
        public GetMyNotifcationWithPaginationQueryValidator()
        {
            RuleFor(x => x.PageNumber).GreaterThan(0).WithMessage("PageNumber at least greater than or equal to 1.");
            RuleFor(x => x.PageSize).GreaterThan(0).WithMessage("PageSize at least greater than or equal to 1.");
        }
    }
}