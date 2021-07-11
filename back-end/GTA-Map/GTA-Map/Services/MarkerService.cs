using GTA_Map.Models;
using GTA_Map.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GTA_Map.Services
{
    public class MarkerService : IMarkerService
    {
        private AMCDbContext _context;

        public MarkerService(AMCDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Marker>> GetAll()
        {
            return await _context.Markers.Include(marker => marker.Color).ToListAsync();
        }

        public async Task<Marker> GetMarker(int id)
        {
            return await _context.Markers.FindAsync(id);
        }

        public async Task<Marker> AddMarker(Marker marker)
        {
            marker.Color = _context.Colors.Find(marker.Color.Id);
            marker.ColorId = marker.Color.Id;
            Marker newMarker = _context.Markers.Add(marker).Entity;
            await _context.SaveChangesAsync();
            return newMarker;
        }

        public async Task<Marker> UpdateMarker(Marker marker)
        {
            Color color = _context.Colors.Find(marker.ColorId);
            marker.Color = color;
            marker.ColorId = color.Id;
            Marker updatedMarker = _context.Markers.Update(marker).Entity;

            await _context.SaveChangesAsync();
            return updatedMarker;
        }

        public async Task DeleteMarker(int id)
        {
            Marker marker = _context.Markers.Find(id);

            if (marker == null)
            {
                return;
            }
            _context.Markers.Remove(marker);
            await _context.SaveChangesAsync();
        }
    }

}
