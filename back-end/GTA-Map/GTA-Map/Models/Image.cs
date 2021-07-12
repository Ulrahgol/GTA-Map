using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GTA_Map.Models
{
    public class Image
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public int MarkerId { get; set; }

        public Marker marker { get; set; }
    }
}
