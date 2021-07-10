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
            List<Color> colors = await _context.Colors.ToListAsync();
            return colors;
        }

        // GET: api/Markers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Color>> GetColorById(int id)
        {
            Color color = await _context.Colors.FindAsync(id);

            if (color == null)
            {
                return NotFound();
            }

            return color;
        }

        // POST: api/Markers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Color>> AddColor([FromBody] Color color)
        {
            _context.Colors.Add(color);
            await _context.SaveChangesAsync();

            return CreatedAtAction("AddColor", new { id = color.Id }, color);
        }


        // DELETE: api/Markers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteColor(int id)
        {
            Color color = _context.Colors.Find(id);
            if (color == null)
            {
                return NotFound();
            }

            _context.Colors.Remove(color);
            await _context.SaveChangesAsync();

            return AcceptedAtAction("DeleteMarker");
        }
    }
}
