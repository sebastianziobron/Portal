using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using PortalRandkowy.API.Data;
using PortalRandkowy.API.Dtos;
using PortalRandkowy.API.Helpers;
using PortalRandkowy.API.Models;

namespace PortalRandkowy.API.Controllers
{
    [Authorize]
    [Route ("users/{userId}/photos")]
    [ApiController]
    public class PhotoControler : ControllerBase
    {
        private readonly IUserRepository _repository;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _caludinaryConfig;
        private readonly Cloudinary _cloudinary;
        public PhotoControler(IUserRepository repository, IMapper mapper, IOptions<CloudinarySettings> caludinaryConfig){
           _repository = repository;
           _mapper = mapper;
           _caludinaryConfig = caludinaryConfig;

           Account account = new Account(
             _caludinaryConfig.Value.CloudName,
               _caludinaryConfig.Value.ApiKey,
               _caludinaryConfig.Value.ApiSecret
           );
           _cloudinary = new Cloudinary(account);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, [FromForm]PhotoForCreationDto photoForCreationDto)
        {
             if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                return Unauthorized();
                }

            var userFromRepo = await _repository.GetUser(userId);
            var file = photoForCreationDto.File;
            var uploadResalt = new ImageUploadResult();

            if(file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {

                    var uploadParams = new ImageUploadParams() {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };

                    uploadResalt = _cloudinary.Upload(uploadParams);
                }
            }

            photoForCreationDto.Url = uploadResalt.Url.ToString();
            photoForCreationDto.PublicId = uploadResalt.PublicId;

            var photo = _mapper.Map<Photo>(photoForCreationDto);

            if(!userFromRepo.Photos.Any(p => p.IsMain))
                photo.IsMain = true;
            
            userFromRepo.Photos.Add(photo);

            if(await _repository.SaveAll()){

                var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);

              return CreatedAtAction("XXX", new {@id = photo.Id}, photoToReturn);
            }
            return BadRequest("Nie mozna dodać zdjęcia");
        } 

        [HttpGet("{id}", Name = "XXX")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await _repository.GetPhoto(id);
            var photoForReturn = _mapper.Map<PhotoForReturnDto>(photoFromRepo);

            return Ok(photoForReturn);
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _repository.GetUser(userId);
            if (!user.Photos.Any(p => p.Id == id))
                return Unauthorized();

            var photoFromRepo = await _repository.GetPhoto(id);

            if (photoFromRepo.IsMain)
                return BadRequest("To jest już główne zdjęcie");

            var currentMainPhoto = await _repository.GetMainPhotoForUser(userId);

            currentMainPhoto.IsMain = false;
            photoFromRepo.IsMain = true;

            if (await _repository.SaveAll())
                return NoContent();

            return BadRequest("Nie moża ustawić zdjęcia jko głownego");


        }

    }
}