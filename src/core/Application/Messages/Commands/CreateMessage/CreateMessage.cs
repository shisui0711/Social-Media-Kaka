

using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Common.Security;
using Domain.Entities;

namespace Application.Messages.Commands.CreateMessage
{
    [Authorize]
    public record CreateMessageCommand : IRequest<MessageDto>
    {
        public string ConversationId { get; set; } = null!;
        public string ReceiverId { get; set; } = null!;
        public string SenderId { get; set; } = null!;
        public string Content { get; set; } = null!;
    }

    internal class CreateMessageCommandHandler : IRequestHandler<CreateMessageCommand, MessageDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CreateMessageCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<MessageDto> Handle(CreateMessageCommand request, CancellationToken cancellationToken)
        {
            var conversation = _context.Conversations.Find(request.ConversationId);
            Guard.Against.NotFound(request.ConversationId,conversation);

            var message = (await _context.Messages.AddAsync(new Message{
                Content = request.Content,
                SenderId = request.SenderId,
                ReceiverId = request.ReceiverId,
                ConversationId = request.ConversationId
            })).Entity;
            await _context.SaveChangesAsync(cancellationToken);

            return _mapper.Map<MessageDto>(message);
        }
    }
}