using Microsoft.AspNetCore.Mvc;
using AZimpleWeb.Models;
using System;
using System.Text.RegularExpressions;
using AZimpleWeb.Services;

namespace AZimpleWeb.Controllers
{
    [Produces("application/json")]
    public class AccountController : Controller
    {
        [HttpGet("api/[controller]/{username}")]
        public ActionResult Get(string username)
        {
            AuthService context = HttpContext.RequestServices.GetService(typeof(AuthService)) as AuthService;

            if (!username.Equals(""))
            {
                GameAccount account = context.GetGameAccountByName(username);

                if (account != null)
                    return new OkObjectResult(account);
            }

            return new NotFoundResult();
        }

        [HttpPost]
        public ActionResult Post([FromBody]GameAccount account)
        {
            AuthService context = HttpContext.RequestServices.GetService(typeof(AuthService)) as AuthService;
            var errors = "";

            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult("An error ocurred processing your request.");
            }

            // Username validations
            if (account.Username.Equals(""))
                errors += "Username can't be empty;";
            else if (account.Username.Length > 20)
                errors += "Username can't be longer than 20 characters;";
            else if (context.GetGameAccountByName(account.Username) != null)
                errors += "That username already exists;";

            // Password validations
            if (account.Password.Equals(""))
                errors += "Password can't be empty";
            else if (account.Password.Length < 6)
                errors += "Password can't be shorter than 6 characters";
            else if (account.Password.Length > 16)
                errors += "Password can't be longer than 16 characters";
            else if (!(new Regex("((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$").IsMatch(account.Password)))
                errors += "Password must contain lower and upper case letters, numbers and symbols.";

            // Email validations
            if (account.Email.Equals(""))
                errors += "Email can't be empty";
            else if (!(new Regex("^(([^<>()\\[\\]\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$").IsMatch(account.Email)))
                errors += "Email doesn't have a valid format";

            if (errors.Length == 0)
            {
                if (context.CreateAccount(account.Username, account.Password, account.Email))
                    return new AcceptedResult();
                else
                    errors = "Couldn't create you account";
            }
            
            return new BadRequestObjectResult(errors);
        }
    }
}