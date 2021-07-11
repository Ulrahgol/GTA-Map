using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GTA_Map.Models;

namespace GTA_Map.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ColorController : ControllerBase
    {
        private readonly AMCDbContext _context;

        public ColorController(AMCDbContext context)
        {
            _context = context;
        }

        // GET: api/Markers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Color>>> GetColors()
        {
            try
            {
                List<Color> colors = await _context.Colors.OrderBy(x => x.Id).ToListAsync();
                return colors;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        // GET: api/Markers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Color>> GetColorById(int id)
        {
            try
            {
                Color color = await _context.Colors.FindAsync(id);

                if (color == null)
                {
                    return NotFound();
                }

                return color;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        // POST: api/Markers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Color>> AddColor([FromBody] Color color)
        {
            try
            {
                _context.Colors.Add(color);
                await _context.SaveChangesAsync();

                return CreatedAtAction("AddColor", new { id = color.Id }, color);
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        // DELETE: api/Markers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteColor(int id)
        {
            try
            {
                Color color = _context.Colors.Find(id);
                if (color == null)
                {
                    return NotFound();
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

                return AcceptedAtAction("DeleteColor");
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
