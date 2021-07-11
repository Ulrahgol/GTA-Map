using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using GTA_Map.Models;
using GTA_Map.Services.Interfaces;

namespace GTA_Map.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MarkersController : ControllerBase
    {
        private readonly IMarkerService markerService;

        public MarkersController(IMarkerService markerService)
        {
            this.markerService = markerService;
        }

        // GET: api/Markers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Marker>>> GetMarker()
        {
            try
            {
                return Ok(await markerService.GetAll()); 
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
                Marker marker = await markerService.GetMarker(id);
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
        public async Task<ActionResult<Marker>> AddMarker([FromBody] Marker marker)
        {
            try
            {
                Marker newMarker = await markerService.AddMarker(marker);
                return CreatedAtAction("AddMarker", new { id = newMarker.Id }, newMarker);
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
                Marker updatedMarker = await markerService.UpdateMarker(marker);
                return AcceptedAtAction("UpdateMarker", new { id = updatedMarker.Id }, updatedMarker);
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
                await markerService.DeleteMarker(id);
                return AcceptedAtAction("DeleteMarker");
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
