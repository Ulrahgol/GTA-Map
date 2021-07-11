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
    public class ColorController : ControllerBase
    {
        private readonly IColorService colorService;

        public ColorController(IColorService colorService)
        {
            this.colorService = colorService;
        }

        // GET: api/Markers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Color>>> GetColors()
        {
            try
            {
                return Ok(await colorService.GetAll());
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
                Color color = await colorService.GetColor(id);
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
                Color newColor = await colorService.AddColor(color);
                return CreatedAtAction("AddColor", new { id = newColor.Id }, newColor);
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
                await colorService.DeleteColor(id);
                return AcceptedAtAction("DeleteColor");
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
