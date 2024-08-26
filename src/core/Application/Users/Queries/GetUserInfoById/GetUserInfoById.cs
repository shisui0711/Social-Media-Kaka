


using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Common.Security;

namespace Application.Users.Queries.GetUserInfoById
{
    [Authorize]
    public record GetUserInfoByIdQuery : IRequest<UserDto>
    {
        public string UserId { get; set; } = null!;
    }

    internal class GetUserInfoByIdQueryHandler : IRequestHandler<GetUserInfoByIdQuery, UserDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetUserInfoByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<UserDto> Handle(GetUserInfoByIdQuery request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.AsNoTracking()
            .Where(x => x.Id == request.UserId).AsSplitQuery()
            .ProjectTo<UserDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();
            Guard.Against.NotFound(request.UserId, user);
            return user;
        }
    }
}