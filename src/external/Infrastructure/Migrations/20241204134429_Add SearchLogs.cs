using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSearchLogs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConversationId",
                table: "users");

            migrationBuilder.DropColumn(
                name: "isGroup",
                table: "conversations");

            migrationBuilder.CreateTable(
                name: "search_logs",
                columns: table => new
                {
                    keyword = table.Column<string>(type: "text", nullable: false),
                    search_count = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("search_logs_pkey", x => x.keyword);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "search_logs");

            migrationBuilder.AddColumn<string>(
                name: "ConversationId",
                table: "users",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "isGroup",
                table: "conversations",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
