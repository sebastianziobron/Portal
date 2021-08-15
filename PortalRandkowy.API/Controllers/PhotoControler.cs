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
              //"ddond06i0",
             // "162988476747673",
             // "DZxvIRBZV6gtxC7SfKK_auq1LxI" 
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

               return CreatedAtRoute(routeName: "XXX", routeValues: new {@id = photo.Id}, null);
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

    }
}