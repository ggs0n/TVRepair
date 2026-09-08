using TVRepair.Api.data;

namespace TVRepair.Api.services
{
    public enum UserRegistrationStatus
    {
        Success,
        UserAlreadyExists,
        Failed
    }

    public sealed record UserRegistrationResult(
        UserRegistrationStatus Status);

    public enum UserLoginStatus
    {
        Success,
        UserNotFound,
        NotAllowed,
        Failed
    }

    public sealed record UserLoginResult(
        UserLoginStatus Status,
        CurrentUserResponse? User = null);
}

