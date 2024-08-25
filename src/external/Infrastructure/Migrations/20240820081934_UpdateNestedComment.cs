using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateNestedComment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CommentId",
                table: "notifications",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ParentId",
                table: "comments",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "comment_likes",
                columns: table => new
                {
                    userId = table.Column<string>(type: "text", nullable: false),
                    commentId = table.Column<string>(type: "text", nullable: false),
                    Id = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_comment_likes", x => new { x.commentId, x.userId });
                    table.ForeignKey(
                        name: "likes _commentId_fkey",
                        column: x => x.commentId,
                        principalTable: "comments",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "likes _userId_fkey",
                        column: x => x.userId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_notifications_CommentId",
                table: "notifications",
                column: "CommentId");

            migrationBuilder.CreateIndex(
                name: "IX_comments_ParentId",
                table: "comments",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "likes _userId_commentId_key",
                table: "comment_likes",
                columns: new[] { "userId", "commentId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_comments_comments_ParentId",
                table: "comments",
                column: "ParentId",
                principalTable: "comments",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "notifications_commentId_fkey",
                table: "notifications",
                column: "CommentId",
                principalTable: "comments",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_comments_comments_ParentId",
                table: "comments");

            migrationBuilder.DropForeignKey(
                name: "notifications_commentId_fkey",
                table: "notifications");

            migrationBuilder.DropTable(
                name: "comment_likes");

            migrationBuilder.DropIndex(
                name: "IX_notifications_CommentId",
                table: "notifications");

            migrationBuilder.DropIndex(
                name: "IX_comments_ParentId",
                table: "comments");

            migrationBuilder.DropColumn(
                name: "CommentId",
                table: "notifications");

            migrationBuilder.DropColumn(
                name: "ParentId",
                table: "comments");
        }
    }
}
