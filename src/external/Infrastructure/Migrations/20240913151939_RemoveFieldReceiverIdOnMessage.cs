using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveFieldReceiverIdOnMessage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "conversationMember_conversationId_fkey",
                table: "conversationMember");

            migrationBuilder.DropForeignKey(
                name: "conversationMember_userId_fkey",
                table: "conversationMember");

            migrationBuilder.RenameTable(
                name: "conversationMember",
                newName: "conversation_members");

            migrationBuilder.RenameIndex(
                name: "IX_conversationMember_userId",
                table: "conversation_members",
                newName: "IX_conversation_members_userId");

            migrationBuilder.RenameIndex(
                name: "IX_conversationMember_conversationId",
                table: "conversation_members",
                newName: "IX_conversation_members_conversationId");

            migrationBuilder.AddForeignKey(
                name: "conversation_members_conversationId_fkey",
                table: "conversation_members",
                column: "conversationId",
                principalTable: "conversations",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "conversation_members_userId_fkey",
                table: "conversation_members",
                column: "userId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "conversation_members_conversationId_fkey",
                table: "conversation_members");

            migrationBuilder.DropForeignKey(
                name: "conversation_members_userId_fkey",
                table: "conversation_members");

            migrationBuilder.RenameTable(
                name: "conversation_members",
                newName: "conversationMember");

            migrationBuilder.RenameIndex(
                name: "IX_conversation_members_userId",
                table: "conversationMember",
                newName: "IX_conversationMember_userId");

            migrationBuilder.RenameIndex(
                name: "IX_conversation_members_conversationId",
                table: "conversationMember",
                newName: "IX_conversationMember_conversationId");

            migrationBuilder.AddForeignKey(
                name: "conversationMember_conversationId_fkey",
                table: "conversationMember",
                column: "conversationId",
                principalTable: "conversations",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "conversationMember_userId_fkey",
                table: "conversationMember",
                column: "userId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
