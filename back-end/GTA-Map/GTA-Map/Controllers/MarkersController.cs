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
    public class MarkersController : ControllerBase
    {
        private readonly AMCDbContext _context;

        public MarkersController(AMCDbContext context)
        {
            _context = context;
        }

        // GET: api/Markers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Marker>>> GetMarker()
        {
            try
            {
                List<Marker> markers = await _context.Markers.Include(marker => marker.Color).ToListAsync();
                return markers;
            }
            catch(Exception ex)
            {
                throw;
            }
        }

        // GET: api/Markers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Marker>> GetMarker(int id)
        {
            try
            {
                var marker = await _context.Markers.FindAsync(id);

                if (marker == null)
                {
                    return NotFound();
                }

                return marker;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        // POST: api/Markers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Marker>> PostMarker([FromBody] Marker marker)
        {
            try
            {
                marker.Color = _context.Colors.Find(marker.Color.Id);
                _context.Markers.Add(marker);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetMarker", new { id = marker.Id }, marker);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        // POST: api/Markers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("{id}")]
        public async Task<ActionResult<Marker>> UpdateMarker([FromBody] Marker marker)
        {
            try
            {
                Marker updatedMarker = _context.Markers.Update(marker).Entity;
                await _context.SaveChangesAsync();

                return AcceptedAtAction("UpdateMarker", new { id = marker.Id }, updatedMarker);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        // DELETE: api/Markers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMarker(int id)
        {
            try
            {
                Marker marker = _context.Markers.Find(id);
                if (marker == null)
                {
                    return NotFound();
                }

                _context.Markers.Remove(marker);
                await _context.SaveChangesAsync();

                return AcceptedAtAction("DeleteMarker");
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
