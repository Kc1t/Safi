using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Safi.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddTicketChatHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "CREATED_AT",
                table: "USERS",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSDATETIME()");

            migrationBuilder.AlterColumn<string>(
                name: "STATUS",
                table: "TICKETS",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "PRIORITY",
                table: "TICKETS",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CREATED_AT",
                table: "TICKETS",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSDATETIME()");

            migrationBuilder.AlterColumn<string>(
                name: "MESSAGE_TYPE",
                table: "TICKET_MESSAGES",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldDefaultValue: "text");

            migrationBuilder.AlterColumn<bool>(
                name: "IS_INTERNAL",
                table: "TICKET_MESSAGES",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "IS_AI_MESSAGE",
                table: "TICKET_MESSAGES",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CREATED_AT",
                table: "TICKET_MESSAGES",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSDATETIME()");

            migrationBuilder.AlterColumn<string>(
                name: "CHANGE_TYPE",
                table: "TICKET_HISTORY",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldDefaultValue: "general");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CHANGED_AT",
                table: "TICKET_HISTORY",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSDATETIME()");

            migrationBuilder.AlterColumn<bool>(
                name: "IS_ACTIVE",
                table: "ISSUE_TYPES",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CREATED_AT",
                table: "ISSUE_TYPES",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSDATETIME()");

            migrationBuilder.AlterColumn<bool>(
                name: "IS_ACTIVE",
                table: "DEPARTMENTS",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CREATED_AT",
                table: "DEPARTMENTS",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSDATETIME()");

            migrationBuilder.CreateTable(
                name: "TICKET_CHAT_HISTORY",
                columns: table => new
                {
                    ID_CHAT_HISTORY = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ID_TICKETS = table.Column<int>(type: "int", nullable: false),
                    ID_USERS = table.Column<int>(type: "int", nullable: false),
                    MESSAGE = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    MESSAGE_TYPE = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CREATED_AT = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IS_INTERNAL = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TICKET_CHAT_HISTORY", x => x.ID_CHAT_HISTORY);
                    table.ForeignKey(
                        name: "FK_TICKET_CHAT_HISTORY_TICKETS_ID_TICKETS",
                        column: x => x.ID_TICKETS,
                        principalTable: "TICKETS",
                        principalColumn: "ID_TICKETS",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TICKET_CHAT_HISTORY_USERS_ID_USERS",
                        column: x => x.ID_USERS,
                        principalTable: "USERS",
                        principalColumn: "ID_USERS",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TICKET_CHAT_HISTORY_ID_TICKETS",
                table: "TICKET_CHAT_HISTORY",
                column: "ID_TICKETS");

            migrationBuilder.CreateIndex(
                name: "IX_TICKET_CHAT_HISTORY_ID_USERS",
                table: "TICKET_CHAT_HISTORY",
                column: "ID_USERS");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TICKET_CHAT_HISTORY");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CREATED_AT",
                table: "USERS",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<int>(
                name: "STATUS",
                table: "TICKETS",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "PRIORITY",
                table: "TICKETS",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CREATED_AT",
                table: "TICKETS",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<string>(
                name: "MESSAGE_TYPE",
                table: "TICKET_MESSAGES",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "text",
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<bool>(
                name: "IS_INTERNAL",
                table: "TICKET_MESSAGES",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "IS_AI_MESSAGE",
                table: "TICKET_MESSAGES",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CREATED_AT",
                table: "TICKET_MESSAGES",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<string>(
                name: "CHANGE_TYPE",
                table: "TICKET_HISTORY",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "general",
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CHANGED_AT",
                table: "TICKET_HISTORY",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<bool>(
                name: "IS_ACTIVE",
                table: "ISSUE_TYPES",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CREATED_AT",
                table: "ISSUE_TYPES",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<bool>(
                name: "IS_ACTIVE",
                table: "DEPARTMENTS",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CREATED_AT",
                table: "DEPARTMENTS",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");
        }
    }
}
