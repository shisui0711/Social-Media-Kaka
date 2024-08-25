

using Domain.Exceptions;
using Microsoft.Extensions.Logging;

namespace Application.Common.Behaviours
{
    public class DomainExceptionBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
    {
        private readonly ILogger<TRequest> _logger;

        public DomainExceptionBehaviour(ILogger<TRequest> logger)
        {
            _logger = logger;
        }

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            try
            {
                return await next();
            }
            catch (DomainException)
            {
                var requestName = typeof(TRequest).Name;

                _logger.LogInformation("Request: Domain Exception for Request {Name} {@Request}", requestName, request);

                throw;
            }
        }
    }
}