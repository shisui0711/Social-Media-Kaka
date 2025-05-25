
using Application.Common.Interfaces;
using Application.Common.Mappings;
using Application.Common.Models;

namespace Application.Users.Queries.GetUsersWithPagination
{
    public record GetUsersWithPaginationQuery : IRequest<PaginatedList<UserDto>>
    {
        public int PageNumber { get; init; }
        public int PageSize { get; init; }
    }

    internal class GetUsersWithPaginationQueryHandler(
        IApplicationDbContext context,
        IMapper mapper
    ) : IRequestHandler<GetUsersWithPaginationQuery, PaginatedList<UserDto>>
    {
        public async Task<PaginatedList<UserDto>> Handle(GetUsersWithPaginationQuery request, CancellationToken cancellationToken)
        {
            return await context.Users.AsSplitQuery().ProjectTo<UserDto>(mapper.ConfigurationProvider)
                .PaginatedListAsync(request.PageNumber, request.PageSize);
        }
    }
}