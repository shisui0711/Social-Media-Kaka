using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAnyLastChangeOnUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "BirthDayLastChange",
                table: "users",
                type: "timestamp(3) without time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EmailLastChange",
                table: "users",
                type: "timestamp(3) without time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BirthDayLastChange",
                table: "users");

            migrationBuilder.DropColumn(
                name: "EmailLastChange",
                table: "users");
        }
    }
}
