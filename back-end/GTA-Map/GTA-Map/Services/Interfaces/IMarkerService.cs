using GTA_Map.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GTA_Map.Services.Interfaces
{
    public interface IMarkerService
    {
        Task<IEnumerable<Marker>> GetAll();
        Task<Marker> GetMarker(int id);
        Task<Marker> AddMarker(Marker marker);
        Task<Marker> UpdateMarker(Marker marker);
        Task DeleteMarker(int id);
    }
}
