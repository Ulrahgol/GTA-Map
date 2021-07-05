using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GTA_Map.Models
{
    public class Account
    {
        public int Id { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string Salt { get; set; }
    }
}
