using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PortalRandkowy.API.Data;
using PortalRandkowy.API.Models;

namespace PortalRandkowy.API.Controllers
{   
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class ValueController : ControllerBase
    {
        private readonly DataContext _context;
        public ValueController(DataContext context)
        {
            _context = context;
        }
        [AllowAnonymous]
        [HttpGet]
        public IActionResult GetAll()
        {
            var values = _context.Values.ToList();
            return Ok(values);
        }
        [AllowAnonymous]
        [HttpGet("{id}")]
        public IActionResult GetValue(int id)
        {
            var value = _context.Values.FirstOrDefault(x => x.Id == id);
            return Ok(value);
        }

        [HttpPost]
        public IActionResult AddValues([FromBody] Value value)
        {
            _context.Values.Add(value);
            _context.SaveChanges();
            return Ok(value);
        }

        [HttpPut("{id}")]
        public IActionResult EditValues(int id, [FromBody] Value value)
        {
            var data = _context.Values.Find(id);
            data.Name = value.Name;
            _context.Values.Update(data);
            _context.SaveChanges();
            return Ok(data);
        }

        [HttpDelete]
        public IActionResult DeleteValues(int id)
        {
            var data = _context.Values.Find(id);
            _context.Values.Remove(data);
            _context.SaveChanges();
            return Ok(data);
        }
    }
}