using GTA_Map.Models;
using GTA_Map.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GTA_Map.Services
{
    public class ColorService : IColorService
    {
        private AMCDbContext _context;

        public ColorService(AMCDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Color>> GetAll()
        {
            return await _context.Colors.ToListAsync();
        }

        public async Task<Color> GetColor(int id)
        {
            return await _context.Colors.FindAsync(id);
        }

        public async Task<Color> AddColor(Color color)
        {
            Color newColor = _context.Colors.Add(color).Entity;
            await _context.SaveChangesAsync();
            return newColor;
        }

        public async Task<Color> UpdateColor(Color color)
        {
            Color updatedColor = _context.Colors.Update(color).Entity;
            await _context.SaveChangesAsync();
            return updatedColor;
        }

        public async Task DeleteColor(int id)
        {
            Color color = _context.Colors.Find(id);
            if (color == null)
            {
                return;
            }

            List<Marker> markers = _context.Markers.Where(x => x.ColorId == id).ToList();
            Color standardColor = _context.Colors.Find(1);
            foreach (Marker marker in markers)
            {
                marker.ColorId = standardColor.Id;
                marker.Color = standardColor;
                _context.Markers.Update(marker);
            }

            _context.Colors.Remove(color);
            await _context.SaveChangesAsync();
        }
    }
}
