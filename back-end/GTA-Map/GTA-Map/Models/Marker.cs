using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GTA_Map.Models
{
    public class Marker
    {
        public int Id { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Name { get; set; }
        public string Notes { get; set; }
    }
}
