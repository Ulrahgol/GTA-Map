using GTA_Map.Models;
using GTA_Map.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GTA_Map.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : Controller
    {
        private readonly IImageService imageService;

        public ImageController(IImageService imageService)
        {
            this.imageService = imageService;
        }

        // GET: api/Markers/5
        [HttpGet("{id}")]
        public async Task<IEnumerable<Image>> GetImagesByMarkerId(int id)
        {
            try
            {
                return await imageService.GetByMarkerId(id);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        // POST: api/Markers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Image>> AddImage([FromBody] Image image)
        {
            try
            {
                Image newImage = await imageService.AddImage(image);
                return CreatedAtAction("AddImage", new { id = newImage.Id }, newImage);
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        // DELETE: api/Markers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteImage(int id)
        {
            try
            {
                await imageService.DeleteImage(id);
                return AcceptedAtAction("DeleteImage");
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
