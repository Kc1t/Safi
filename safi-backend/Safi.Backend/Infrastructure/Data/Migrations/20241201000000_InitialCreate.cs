using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Safi.Backend.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Criar tabela DEPARTMENTS
            migrationBuilder.CreateTable(
                name: "DEPARTMENTS",
                columns: table => new
                {
                    ID_DEPARTMENTS = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NAME = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DESCRIPTION = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IS_ACTIVE = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CREATED_AT = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "SYSDATETIME()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DEPARTMENTS", x => x.ID_DEPARTMENTS);
                });

            // Criar tabela ISSUE_TYPES
            migrationBuilder.CreateTable(
                name: "ISSUE_TYPES",
                columns: table => new
                {
                    ID_ISSUE_TYPES = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NAME = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DESCRIPTION = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IS_ACTIVE = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CREATED_AT = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "SYSDATETIME()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ISSUE_TYPES", x => x.ID_ISSUE_TYPES);
                });

            // Criar tabela USERS
            migrationBuilder.CreateTable(
                name: "USERS",
                columns: table => new
                {
                    ID_USERS = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NAME = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    EMAIL = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    ID_USER_TYPES = table.Column<int>(type: "int", nullable: false),
                    ID_ANALYST_LEVELS = table.Column<int>(type: "int", nullable: true),
                    ID_DEPARTMENTS = table.Column<int>(type: "int", nullable: true),
                    CREATED_AT = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "SYSDATETIME()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_USERS", x => x.ID_USERS);
                    table.ForeignKey(
                        name: "FK_USERS_DEPARTMENTS_ID_DEPARTMENTS",
                        column: x => x.ID_DEPARTMENTS,
                        principalTable: "DEPARTMENTS",
                        principalColumn: "ID_DEPARTMENTS",
                        onDelete: ReferentialAction.SetNull);
                });

            // Criar tabela TICKETS
            migrationBuilder.CreateTable(
                name: "TICKETS",
                columns: table => new
                {
                    ID_TICKETS = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TITLE = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    DETAILING = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    STATUS = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Open"),
                    PRIORITY = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false, defaultValue: "Medium"),
                    ID_ISSUE_TYPES = table.Column<int>(type: "int", nullable: false),
                    ID_USERS = table.Column<int>(type: "int", nullable: false),
                    ASSIGNED_TO = table.Column<int>(type: "int", nullable: true),
                    CREATED_AT = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "SYSDATETIME()"),
                    UPDATED_AT = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RESOLVED_AT = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TICKETS", x => x.ID_TICKETS);
                    table.ForeignKey(
                        name: "FK_TICKETS_ISSUE_TYPES_ID_ISSUE_TYPES",
                        column: x => x.ID_ISSUE_TYPES,
                        principalTable: "ISSUE_TYPES",
                        principalColumn: "ID_ISSUE_TYPES",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TICKETS_USERS_ASSIGNED_TO",
                        column: x => x.ASSIGNED_TO,
                        principalTable: "USERS",
                        principalColumn: "ID_USERS",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_TICKETS_USERS_ID_USERS",
                        column: x => x.ID_USERS,
                        principalTable: "USERS",
                        principalColumn: "ID_USERS",
                        onDelete: ReferentialAction.Restrict);
                });

            // Criar tabela TICKET_MESSAGES
            migrationBuilder.CreateTable(
                name: "TICKET_MESSAGES",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ID_TICKETS = table.Column<int>(type: "int", nullable: false),
                    ID_SENDER = table.Column<int>(type: "int", nullable: false),
                    MESSAGE = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CREATED_AT = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "SYSDATETIME()"),
                    IS_INTERNAL = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IS_AI_MESSAGE = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    MESSAGE_TYPE = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: "text")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TICKET_MESSAGES", x => x.ID);
                    table.ForeignKey(
                        name: "FK_TICKET_MESSAGES_TICKETS_ID_TICKETS",
                        column: x => x.ID_TICKETS,
                        principalTable: "TICKETS",
                        principalColumn: "ID_TICKETS",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TICKET_MESSAGES_USERS_ID_SENDER",
                        column: x => x.ID_SENDER,
                        principalTable: "USERS",
                        principalColumn: "ID_USERS",
                        onDelete: ReferentialAction.Restrict);
                });

            // Criar tabela TICKET_HISTORY
            migrationBuilder.CreateTable(
                name: "TICKET_HISTORY",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ID_TICKETS = table.Column<int>(type: "int", nullable: false),
                    CHANGED_BY = table.Column<int>(type: "int", nullable: false),
                    CHANGE_DESCRIPTION = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CHANGED_AT = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "SYSDATETIME()"),
                    CHANGE_TYPE = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: "general"),
                    OLD_VALUE = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    NEW_VALUE = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TICKET_HISTORY", x => x.ID);
                    table.ForeignKey(
                        name: "FK_TICKET_HISTORY_TICKETS_ID_TICKETS",
                        column: x => x.ID_TICKETS,
                        principalTable: "TICKETS",
                        principalColumn: "ID_TICKETS",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TICKET_HISTORY_USERS_CHANGED_BY",
                        column: x => x.CHANGED_BY,
                        principalTable: "USERS",
                        principalColumn: "ID_USERS",
                        onDelete: ReferentialAction.Restrict);
                });

            // Criar índices únicos
            migrationBuilder.CreateIndex(
                name: "IX_DEPARTMENTS_NAME",
                table: "DEPARTMENTS",
                column: "NAME",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ISSUE_TYPES_NAME",
                table: "ISSUE_TYPES",
                column: "NAME",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_USERS_EMAIL",
                table: "USERS",
                column: "EMAIL",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_USERS_ID_DEPARTMENTS",
                table: "USERS",
                column: "ID_DEPARTMENTS");

            migrationBuilder.CreateIndex(
                name: "IX_TICKETS_ASSIGNED_TO",
                table: "TICKETS",
                column: "ASSIGNED_TO");

            migrationBuilder.CreateIndex(
                name: "IX_TICKETS_ID_ISSUE_TYPES",
                table: "TICKETS",
                column: "ID_ISSUE_TYPES");

            migrationBuilder.CreateIndex(
                name: "IX_TICKETS_ID_USERS",
                table: "TICKETS",
                column: "ID_USERS");

            migrationBuilder.CreateIndex(
                name: "IX_TICKET_MESSAGES_ID_SENDER",
                table: "TICKET_MESSAGES",
                column: "ID_SENDER");

            migrationBuilder.CreateIndex(
                name: "IX_TICKET_MESSAGES_ID_TICKETS",
                table: "TICKET_MESSAGES",
                column: "ID_TICKETS");

            migrationBuilder.CreateIndex(
                name: "IX_TICKET_HISTORY_CHANGED_BY",
                table: "TICKET_HISTORY",
                column: "CHANGED_BY");

            migrationBuilder.CreateIndex(
                name: "IX_TICKET_HISTORY_ID_TICKETS",
                table: "TICKET_HISTORY",
                column: "ID_TICKETS");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TICKET_HISTORY");

            migrationBuilder.DropTable(
                name: "TICKET_MESSAGES");

            migrationBuilder.DropTable(
                name: "TICKETS");

            migrationBuilder.DropTable(
                name: "ISSUE_TYPES");

            migrationBuilder.DropTable(
                name: "USERS");

            migrationBuilder.DropTable(
                name: "DEPARTMENTS");
        }
    }
}
