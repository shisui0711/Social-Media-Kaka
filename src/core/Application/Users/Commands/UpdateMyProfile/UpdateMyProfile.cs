

using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Common.Security;
using Domain.Errors;
using Domain.Exceptions;

namespace Application.Users.Commands.UpdateMyProfile
{
    [Authorize]
    public record UpdateMyProfileCommand : IRequest<UserDto>
    {
        public string UserName { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string? Bio { get; set; }
    }

    internal class UpdateMyProfileCommandHandler : IRequestHandler<UpdateMyProfileCommand, UserDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IUser _currentUser;

        public UpdateMyProfileCommandHandler(IApplicationDbContext context, IMapper mapper, IUser currentUser)
        {
            _context = context;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        public async Task<UserDto> Handle(UpdateMyProfileCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FindAsync(_currentUser.Id);
            Guard.Against.NotFound(_currentUser.Id!,user);
            if (user.UserName != request.UserName && user.UsernameLastChange > DateTime.UtcNow.AddDays(-30))
                throw new DomainException(DomainErrors.User.UserNameChangeLimitExceeded);
            if (user.UserName != request.UserName)
            {
                var isExist = await _context.Users.FirstOrDefaultAsync(x => x.UserName == request.UserName);
                if (isExist != null) throw new DomainException(DomainErrors.User.UserNameAlreadyExists);
                user.UsernameLastChange = DateTime.UtcNow;
            }
            _mapper.Map(request, user);
            var newUser = _context.Users.Update(user).Entity;
            Guard.Against.NotFound(_currentUser.Id!, newUser);
            await _context.SaveChangesAsync(cancellationToken);
            return _mapper.Map<UserDto>(newUser);
        }
    }
}