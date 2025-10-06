using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Safi.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddSupportLevelToTickets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SUPPORT_LEVEL",
                table: "TICKETS",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SUPPORT_LEVEL",
                table: "TICKETS");
        }
    }
}
