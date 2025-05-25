

using Application.Common.Interfaces;
using Application.Common.Security;
using Domain.Entities;

namespace Application.Statistics.CreateSearchLog
{
    [Authorize]
    public record CreateSearchLogCommand : IRequest
    {
        public string KeyWord { get; init; } = null!;
    }

    internal class CreateSearchLogCommandHandler(
        IApplicationDbContext context
    ) : IRequestHandler<CreateSearchLogCommand>
    {
        public async Task Handle(CreateSearchLogCommand request, CancellationToken cancellationToken)
        {
            var exist = await context.SearchLogs.FirstOrDefaultAsync(x => x.KeyWord == request.KeyWord,cancellationToken);

            if (exist != null)
            {
                exist.SearchCount++;
                context.SearchLogs.Update(exist);
            }
            else
            {
                await context.SearchLogs.AddAsync(new SearchLog { KeyWord = request.KeyWord, SearchCount = 1}, cancellationToken);
            }

            await context.SaveChangesAsync(cancellationToken);
        }
    }
}