using System;
using System.Collections.Generic;

namespace PortalRandkowy.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }

        // Podstawowe Informacje

        public string Gender {get; set;}
        public DateTime DateOfBirth {get; set;}
        public string ZodiacSign {get; set;}
        public DateTime Created {get; set;}
        public DateTime LastActive {get; set;}
        public string City {get; set;}
        public string Country {get; set;}


        // Dodatkowe informacje
        // Zakładka info

        public string Growth {get; set;}
        public string EyeColor {get; set;}
        public string HairColor {get; set;}
        public string MartialStatus {get; set;}
        public string Education {get; set;}
        public string Profession {get; set;}
        public string Children {get; set;}
        public string Languages {get; set;}

        // Zakładka o mnie

        public string Motto {get; set;}
        public string Description { get; set; }
        public string Personality {get; set;}
        public string LookingFor {get; set;}

        // Zakładka Pasje-Zaintersesowania

        public string Interests { get; set;}
        public string FreeTime {get; set;}
        public string Sport {get; set;}
        public string Movies {get; set;}
        public string Music {get; set;}
        
        // Zakładka Preferencje

        public string ILike {get; set;}
        public string IdoNotLike {get; set;}
        public string MakeMeLaugh {get; set;}
        public string ItFeelIsBestIn {get; set;}
        public string FriendsMouldDescribeMe {get; set;}

        // Zakładka zdjęcia

        public ICollection<Photo> Photos {get; set;}       
    }
}