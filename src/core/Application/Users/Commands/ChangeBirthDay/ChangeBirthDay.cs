


using Application.Common.Interfaces;
using Application.Common.Security;

namespace Application.Users.Commands.ChangeBirthDay
{
    [Authorize]
    public record ChangeBirthDayCommand : IRequest<bool>
    {
        public DateTime BirhtDay { get; set; }
    }

    internal class ChangeBirthDayCommandHandler : IRequestHandler<ChangeBirthDayCommand, bool>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUser _currentUser;

        public ChangeBirthDayCommandHandler(IApplicationDbContext context, IUser currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<bool> Handle(ChangeBirthDayCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FindAsync(_currentUser.Id);
            Guard.Against.NotFound(_currentUser.Id!,user);
            if(user.BirthDayLastChange >= DateTime.Now.AddDays(-30)) return false;
            user.BirthDay = request.BirhtDay;
            user.BirthDayLastChange = DateTime.Now;
            _context.Users.Update(user);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}