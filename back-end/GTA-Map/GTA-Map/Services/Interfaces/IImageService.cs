using GTA_Map.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace GTA_Map.Services.Interfaces
{
    public interface IImageService
    {
        Task<IEnumerable<Image>> GetByMarkerId(int Id);
        Task<Image> GetImage(int id);
        Task<Image> AddImage(Image image);
        Task DeleteImage(int id);
    }
}
