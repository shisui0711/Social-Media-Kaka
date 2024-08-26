

using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Common.Security;

namespace Application.Users.Queries.GetMyInfo
{
    [Authorize]
    public record GetMyInfoQuery : IRequest<MyUserDto>;
    internal class GetMyInfoQueryHandler : IRequestHandler<GetMyInfoQuery, MyUserDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUser _currentUser;
        private readonly IMapper _mapper;

        public GetMyInfoQueryHandler(IApplicationDbContext context, IUser currentUser, IMapper mapper)
        {
            _context = context;
            _currentUser = currentUser;
            _mapper = mapper;
        }

        public async Task<MyUserDto> Handle(GetMyInfoQuery request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.Where(x=>x.Id == _currentUser.Id)
                    .AsSplitQuery().ProjectTo<MyUserDto>(_mapper.ConfigurationProvider)
                    .AsNoTracking()
                    .FirstOrDefaultAsync();
            return user!;
        }
    }
}