

using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Common.Security;

namespace Application.Posts.Queries.GetPostInfo
{
    [Authorize]
    public record GetPostInfoQuery : IRequest<PostDto>
    {
        public string PostId { get; set; } = null!;
    }

    internal class GetPostInfoQueryHandler : IRequestHandler<GetPostInfoQuery, PostDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetPostInfoQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PostDto> Handle(GetPostInfoQuery request, CancellationToken cancellationToken)
        {
            var post = await _context.Posts.Where(x => x.Id == request.PostId).AsSplitQuery()
            .ProjectTo<PostDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();
            Guard.Against.NotFound(request.PostId,post);
            return _mapper.Map<PostDto>(post);
        }
    }
}