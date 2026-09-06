using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TVRepair.Api.data;
using TVRepair.Api.services;

namespace TVRepair.Api.apicontroller
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IUserAuthenticationService _authenticationService;

        public AuthenticationController(
            IUserAuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;
        }

        [HttpPost("registercustomer")]
        public async Task<ActionResult> RegisterCustomer(
            [FromBody] CustRegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest("Name is empty");
            }

            if (string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest("Email is empty");
            }

            if (string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest("Password is empty");
            }

            if (string.IsNullOrWhiteSpace(request.CustomerType))
            {
                return BadRequest("Customer Type is empty");
            }

            var result = await _authenticationService
                .RegisterCustomerAsync(request);

            return result.Status switch
            {
                UserRegistrationStatus.Success =>
                    Ok("User created"),

                UserRegistrationStatus.UserAlreadyExists =>
                    BadRequest("User already existed"),

                _ => BadRequest(
                    "Failed to register user. Pls contact Admin")
            };
        }

        [HttpPost("loginuser")]
        public async Task<ActionResult> GetLoginUser(
            [FromBody] CustLoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest("Email and password are required");
            }

            var result = await _authenticationService.LoginAsync(request);

            return result.Status switch
            {
                UserLoginStatus.Success => Ok(result.User),
                UserLoginStatus.UserNotFound =>
                    Unauthorized("Email no data"),
                UserLoginStatus.NotAllowed => Unauthorized(),
                _ => BadRequest()
            };
        }

        [Authorize]
        [HttpGet("GetCurrentUser")]
        public async Task<ActionResult> GetCurrentUser()
        {
            var user = await _authenticationService
                .GetCurrentUserAsync(User);

            return user == null ? Unauthorized() : Ok(user);
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<ActionResult> LogoutUser()
        {
            await _authenticationService.LogoutAsync();
            return Ok();
        }
    }
}
