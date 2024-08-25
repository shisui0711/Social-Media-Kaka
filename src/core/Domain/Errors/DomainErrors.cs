

using Domain.Common;

namespace Domain.Errors
{
    public static class DomainErrors
    {
        public static class User
        {
            public static readonly Error UserNameChangeLimitExceeded =
            new Error("UserNameChangeReachLimit", "User name change limit has been reached");
            public static readonly Error UserNameAlreadyExists =
            new Error("UserNameAlreadyExists", "User name already exists");
            public static readonly Error EmailAlreadyExists =
            new Error("EmailAlreadyExists", "Email already exists");
            public static readonly Error InvalidUser =
            new Error("InvalidUser", "Invalid user");
        }
    }
}