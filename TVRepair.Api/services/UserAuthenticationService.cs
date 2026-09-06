using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using TVRepair.Api.data;
using TVRepair.Api.model;

namespace TVRepair.Api.services
{
    public class UserAuthenticationService : IUserAuthenticationService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public UserAuthenticationService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<UserRegistrationResult> RegisterCustomerAsync(
            CustRegisterRequest request)
        {
            var existingUser =
                await _userManager.FindByEmailAsync(request.Email);

            if (existingUser != null)
            {
                return new UserRegistrationResult(
                    UserRegistrationStatus.UserAlreadyExists);
            }

            var user = new ApplicationUser
            {
                UserName = request.Name,
                Email = request.Email,
                CustomerType = request.CustomerType
            };

            var result = await _userManager.CreateAsync(
                user,
                request.Password);

            return new UserRegistrationResult(
                result.Succeeded
                    ? UserRegistrationStatus.Success
                    : UserRegistrationStatus.Failed);
        }

        public async Task<UserLoginResult> LoginAsync(
            CustLoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null)
            {
                return new UserLoginResult(UserLoginStatus.UserNotFound);
            }

            _signInManager.AuthenticationScheme =
                IdentityConstants.ApplicationScheme;

            var result = await _signInManager.PasswordSignInAsync(
                user,
                request.Password,
                request.RememberMe,
                lockoutOnFailure: false);

            if (result.Succeeded)
            {
                return new UserLoginResult(
                    UserLoginStatus.Success,
                    MapUser(user));
            }

            if (result.IsNotAllowed)
            {
                return new UserLoginResult(UserLoginStatus.NotAllowed);
            }

            return new UserLoginResult(UserLoginStatus.Failed);
        }

        public async Task<CurrentUserResponse?> GetCurrentUserAsync(
            ClaimsPrincipal principal)
        {
            var user = await _userManager.GetUserAsync(principal);

            return user == null ? null : MapUser(user);
        }

        public async Task LogoutAsync()
        {
            await _signInManager.SignOutAsync();
        }

        private static CurrentUserResponse MapUser(ApplicationUser user)
        {
            return new CurrentUserResponse
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                Name = user.UserName ?? string.Empty,
                CustomerType = user.CustomerType,
                Area = user.PreferredArea
            };
        }
    }
}
