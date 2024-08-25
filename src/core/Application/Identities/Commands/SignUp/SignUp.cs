

using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Errors;
using Domain.Exceptions;

namespace Application.Identities.Commands.SignUp
{
    public record SignUpCommand : IRequest
    {
        public string FirstName { set; get; } = null!;
        public string LastName { set; get; } = null!;
        public string Email { set; get; } = null!;
        public string Username { get; set; } = null!;
        public string Password { set; get; } = null!;
    }

    internal class SignUpCommandHandler : IRequestHandler<SignUpCommand>
    {
        private readonly IIdentityService _identityService;
        private readonly IMapper _mapper;

        public SignUpCommandHandler(IIdentityService identityService, IMapper mapper)
        {
            _identityService = identityService;
            _mapper = mapper;
        }

        public async Task Handle(SignUpCommand request, CancellationToken cancellationToken)
        {
            var isExist = await _identityService.FindByNameAsync(request.Username) != null;
            if(isExist) throw new DomainException(DomainErrors.User.UserNameAlreadyExists);
            isExist = await _identityService.FindByEmailAsync(request.Email) != null;
            if(isExist) throw new DomainException(DomainErrors.User.EmailAlreadyExists);
            User user = _mapper.Map<User>(request);
            var result = await _identityService.CreateUserAsync(user, request.Password);
            if (!result.Result.Succeeded) throw new DomainException(DomainErrors.User.InvalidUser);
        }
    }
}