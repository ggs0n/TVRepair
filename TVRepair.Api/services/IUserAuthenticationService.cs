using System.Security.Claims;
using TVRepair.Api.data;

namespace TVRepair.Api.services
{
    public interface IUserAuthenticationService
    {
        Task<UserRegistrationResult> RegisterCustomerAsync(
            CustRegisterRequest request);

        Task<UserLoginResult> LoginAsync(CustLoginRequest request);

        Task<CurrentUserResponse?> GetCurrentUserAsync(
            ClaimsPrincipal principal);

        Task LogoutAsync();
    }
}

