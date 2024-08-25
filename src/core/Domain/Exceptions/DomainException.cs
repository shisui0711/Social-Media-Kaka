
using Domain.Common;

namespace Domain.Exceptions
{
    public class DomainException : Exception
    {
        public DomainException(Error error)
            : base(error.Message)
        {
            this.Error = error;
        }
        public Error Error { get; }

    }
}