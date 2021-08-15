using Microsoft.EntityFrameworkCore.Migrations;

namespace PortalRandkowy.API.Migrations
{
    public partial class FixModelUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MakeMeLaugh",
                table: "Users",
                newName: "MakesMeLaugh");

            migrationBuilder.RenameColumn(
                name: "ItFeelIsBestIn",
                table: "Users",
                newName: "ItFeelsBestIn");

            migrationBuilder.RenameColumn(
                name: "FriendsMouldDescribeMe",
                table: "Users",
                newName: "FriendeWouldDescribeMe");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MakesMeLaugh",
                table: "Users",
                newName: "MakeMeLaugh");

            migrationBuilder.RenameColumn(
                name: "ItFeelsBestIn",
                table: "Users",
                newName: "ItFeelIsBestIn");

            migrationBuilder.RenameColumn(
                name: "FriendeWouldDescribeMe",
                table: "Users",
                newName: "FriendsMouldDescribeMe");
        }
    }
}
