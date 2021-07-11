using GTA_Map.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GTA_Map.Services.Interfaces
{
    public interface IColorService
    {
        Task<IEnumerable<Color>> GetAll();
        Task<Color> GetColor(int id);
        Task<Color> AddColor(Color color);
        Task<Color> UpdateColor(Color color);
        Task DeleteColor(int id);
    }
}
