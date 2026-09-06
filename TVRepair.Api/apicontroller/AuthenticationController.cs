using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using TVRepair.Api.model;
using TVRepair.Api.data;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Authorization;

namespace TVRepair.Api.apicontroller
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly TVRepairDBContext _dbContext;

        private readonly SignInManager<ApplicationUser> _signinManager;


        public AuthenticationController(UserManager<ApplicationUser> userManager, TVRepairDBContext dbcontext, SignInManager<ApplicationUser> signInManager)
        {
             _dbContext =  dbcontext;
             _userManager = userManager;
             _signinManager = signInManager;
        }



        [HttpPost("registercustomer")]
        public async Task<ActionResult> RegisterCustomer(CustRegisterRequest request)
        {
            
            if(request==null)
            return BadRequest();

            if(request.Name == null)
            return BadRequest("Name is empty");

            if(request.Password == null)
            return BadRequest("Password is empty");

            if(request.Password == null)
            return BadRequest("Customer Type is empty");

            try {

            var existingUser = await _userManager.FindByEmailAsync(request.Email);

            if (existingUser!=null)
            return BadRequest("User already existed");

            var usercreate = new ApplicationUser
            {
                UserName = request.Name,
                Email = request.Email,
                CustomerType = request.CustomerType
            };

            var createUserResult = await _userManager.CreateAsync(usercreate, request.Password);

            if (createUserResult.Succeeded)
            return Ok("User created");
            else return BadRequest("Failed to register user. Pls contact Admin");

            }

            catch (Exception ex)
            {
                return BadRequest(ex);
            }

        }

        [HttpPost("loginuser")]
        public async Task<ActionResult> GetLoginuser(CustLoginRequest request)
        {
            if(request==null)
            return BadRequest("Bad Request");

            try {
            var userresult = await _userManager.FindByEmailAsync(request.Email);

            if (userresult==null)
            return Unauthorized("Email no data");

            _signinManager.AuthenticationScheme = IdentityConstants.ApplicationScheme;

            var loginresult = await _signinManager.PasswordSignInAsync(
                userresult,request.Password,request.RememberMe,lockoutOnFailure : false
            );

            if (loginresult.Succeeded)
            return Ok(new
            {
                id = userresult.Id,
                email = userresult.Email,
                name = userresult.UserName,
                customertype = userresult?.CustomerType,
                area = userresult?.PreferredArea
            });

            else if(loginresult.IsNotAllowed)
            return Unauthorized("");

            else return BadRequest();

            }
            catch (Exception ex)
            {
                return Unauthorized();
            }
        }


        [Authorize]
        [HttpGet("GetCurrentUser")]
        public async Task<ActionResult> GetCurrentUser()
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
                return Unauthorized();

            return Ok(new
            {
                id = user.Id,
                email = user.Email,
                name = user.UserName,
                customertype = user.CustomerType,
                area = user.PreferredArea
            });
        }

        [HttpPost("logout")]
        public async Task<ActionResult> LogoutUser ()
        {
            try {
            await _signinManager.SignOutAsync();
            return Ok();
            }
            catch (Exception ex)
            {
                return Unauthorized();
            }

        }
    }
}