using GTA_Map.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace GTA_Map.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AMCDbContext _context;
        public AccountController(AMCDbContext context)
        {
            _context = context;
        }

        // POST: api/Account
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public ActionResult Login([FromBody] Account account)
        {
            Account acc = new Account();
            try
            {
                acc = _context.Accounts.Where(a => a.username == account.username).SingleOrDefault();

                byte[] salt = Convert.FromBase64String(acc.Salt);
                //string savedSaltHash = Encoding.ASCII.GetString(salt);

                string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: account.password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));

                if (hashed != acc.password)
                {
                    return Unauthorized();
                }
            }
            catch (Exception error)
            {
                return Unauthorized();
            }

            return AcceptedAtAction("Login", acc);
        }
    }
}
