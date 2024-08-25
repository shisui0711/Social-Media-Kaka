
using System.Runtime.CompilerServices;

namespace Application.Common.Extensions
{
    public static class GuardExtention
    {
        public static void NullAndThrowUnauthorized(this IGuardClause guardClause,string? input,
        [CallerArgumentExpression("input")] string? parameterName = null)
        {
            if(input == null) throw new UnauthorizedAccessException("You aren't authenticated");
        }
    }
}