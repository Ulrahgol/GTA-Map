using GTA_Map.Models;
using GTA_Map.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GTA_Map.Services
{
    public class ImageService : IImageService
    {
        private AMCDbContext _context;

        public ImageService(AMCDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Image>> GetByMarkerId(int Id)
        {
            return await _context.Images.Where(i => i.MarkerId == Id).ToListAsync();
        }

        public async Task<Image> GetImage(int id)
        {
            return await _context.Images.FindAsync(id);
        }

        public async Task<Image> AddImage(Image image)
        {
            Image newImage = _context.Images.Add(image).Entity;
            await _context.SaveChangesAsync();
            return newImage;
        }

        public async Task DeleteImage(int id)
        {
            Image image = _context.Images.Find(id);
            if (image == null)
            {
                return;
            }
            _context.Images.Remove(image);
            await _context.SaveChangesAsync();
        }
    }
}

