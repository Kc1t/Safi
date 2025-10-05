using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Safi.Backend.Core.Entities;
using Safi.Backend.Infrastructure.Data.Context;

#nullable disable

namespace Safi.Backend.Infrastructure.Data.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Safi.Backend.Core.Entities.Department", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("ID_DEPARTMENTS");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasColumnName("CREATED_AT")
                        .HasDefaultValueSql("SYSDATETIME()");

                    b.Property<string>("Description")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)")
                        .HasColumnName("DESCRIPTION");

                    b.Property<bool>("IsActive")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bit")
                        .HasColumnName("IS_ACTIVE")
                        .HasDefaultValue(true);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)")
                        .HasColumnName("NAME");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("DEPARTMENTS");
                });

            modelBuilder.Entity("Safi.Backend.Core.Entities.IssueType", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("ID_ISSUE_TYPES");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasColumnName("CREATED_AT")
                        .HasDefaultValueSql("SYSDATETIME()");

                    b.Property<string>("Description")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)")
                        .HasColumnName("DESCRIPTION");

                    b.Property<bool>("IsActive")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bit")
                        .HasColumnName("IS_ACTIVE")
                        .HasDefaultValue(true);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)")
                        .HasColumnName("NAME");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("ISSUE_TYPES");
                });

            modelBuilder.Entity("Safi.Backend.Core.Entities.Ticket", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("ID_TICKETS");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int?>("AssignedToId")
                        .HasColumnType("int")
                        .HasColumnName("ASSIGNED_TO");

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasColumnName("CREATED_AT")
                        .HasDefaultValueSql("SYSDATETIME()");

                    b.Property<string>("Detailing")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("DETAILING");

                    b.Property<int>("IssueTypeId")
                        .HasColumnType("int")
                        .HasColumnName("ID_ISSUE_TYPES");

                    b.Property<int>("Priority")
                        .HasColumnType("int")
                        .HasColumnName("PRIORITY");

                    b.Property<DateTime?>("ResolvedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("RESOLVED_AT");

                    b.Property<int>("Status")
                        .HasColumnType("int")
                        .HasColumnName("STATUS");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)")
                        .HasColumnName("TITLE");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("UPDATED_AT");

                    b.Property<int>("UserId")
                        .HasColumnType("int")
                        .HasColumnName("ID_USERS");

                    b.HasKey("Id");

                    b.HasIndex("AssignedToId");

                    b.HasIndex("IssueTypeId");

                    b.HasIndex("UserId");

                    b.ToTable("TICKETS");
                });

            modelBuilder.Entity("Safi.Backend.Core.Entities.TicketHistory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("ID");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("ChangedById")
                        .HasColumnType("int")
                        .HasColumnName("CHANGED_BY");

                    b.Property<DateTime>("ChangedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasColumnName("CHANGED_AT")
                        .HasDefaultValueSql("SYSDATETIME()");

                    b.Property<string>("ChangeDescription")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("CHANGE_DESCRIPTION");

                    b.Property<string>("ChangeType")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)")
                        .HasColumnName("CHANGE_TYPE")
                        .HasDefaultValue("general");

                    b.Property<int>("TicketId")
                        .HasColumnType("int")
                        .HasColumnName("ID_TICKETS");

                    b.Property<string>("NewValue")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)")
                        .HasColumnName("NEW_VALUE");

                    b.Property<string>("OldValue")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)")
                        .HasColumnName("OLD_VALUE");

                    b.HasKey("Id");

                    b.HasIndex("ChangedById");

                    b.HasIndex("TicketId");

                    b.ToTable("TICKET_HISTORY");
                });

            modelBuilder.Entity("Safi.Backend.Core.Entities.TicketMessage", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("ID");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasColumnName("CREATED_AT")
                        .HasDefaultValueSql("SYSDATETIME()");

                    b.Property<bool>("IsAiMessage")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bit")
                        .HasColumnName("IS_AI_MESSAGE")
                        .HasDefaultValue(false);

                    b.Property<bool>("IsInternal")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bit")
                        .HasColumnName("IS_INTERNAL")
                        .HasDefaultValue(false);

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("MESSAGE");

                    b.Property<string>("MessageType")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)")
                        .HasColumnName("MESSAGE_TYPE")
                        .HasDefaultValue("text");

                    b.Property<int>("SenderId")
                        .HasColumnType("int")
                        .HasColumnName("ID_SENDER");

                    b.Property<int>("TicketId")
                        .HasColumnType("int")
                        .HasColumnName("ID_TICKETS");

                    b.HasKey("Id");

                    b.HasIndex("SenderId");

                    b.HasIndex("TicketId");

                    b.ToTable("TICKET_MESSAGES");
                });

            modelBuilder.Entity("Safi.Backend.Core.Entities.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("ID_USERS");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int?>("AnalystLevel")
                        .HasColumnType("int")
                        .HasColumnName("ID_ANALYST_LEVELS");

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasColumnName("CREATED_AT")
                        .HasDefaultValueSql("SYSDATETIME()");

                    b.Property<int?>("DepartmentId")
                        .HasColumnType("int")
                        .HasColumnName("ID_DEPARTMENTS");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(150)
                        .HasColumnType("nvarchar(150)")
                        .HasColumnName("EMAIL");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)")
                        .HasColumnName("NAME");

                    b.Property<int>("UserType")
                        .HasColumnType("int")
                        .HasColumnName("ID_USER_TYPES");

                    b.HasKey("Id");

                    b.HasIndex("DepartmentId");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.ToTable("USERS");
                });

            modelBuilder.Entity("Safi.Backend.Core.Entities.Ticket", b =>
                {
                    b.HasOne("Safi.Backend.Core.Entities.User", "AssignedTo")
                        .WithMany("AssignedTickets")
                        .HasForeignKey("AssignedToId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("Safi.Backend.Core.Entities.IssueType", "IssueType")
                        .WithMany("Tickets")
                        .HasForeignKey("IssueTypeId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Safi.Backend.Core.Entities.User", "User")
                        .WithMany("CreatedTickets")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("AssignedTo");

                    b.Navigation("IssueType");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Safi.Backend.Core.Entities.TicketHistory", b =>
                {
                    b.HasOne("Safi.Backend.Core.Entities.User", "ChangedBy")
                        .WithMany("HistoryEntries")
                        .HasForeignKey("ChangedById")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Safi.Backend.Core.Entities.Ticket", "Ticket")
                        .WithMany("History")
                        .HasForeignKey("TicketId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ChangedBy");

                    b.Navigation("Ticket");
                });

            modelBuilder.Entity("Safi.Backend.Core.Entities.TicketMessage", b =>
                {
                    b.HasOne("Safi.Backend.Core.Entities.User", "Sender")
                        .WithMany("Messages")
                        .HasForeignKey("SenderId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Safi.Backend.Core.Entities.Ticket", "Ticket")
                        .WithMany("Messages")
                        .HasForeignKey("TicketId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Sender");

                    b.Navigation("Ticket");
                });

            modelBuilder.Entity("Safi.Backend.Core.Entities.User", b =>
                {
                    b.HasOne("Safi.Backend.Core.Entities.Department", "Department")
                        .WithMany("Users")
                        .HasForeignKey("DepartmentId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.Navigation("Department");
                });

            modelBuilder.Entity("Safi.Backend.Core.Entities.Department", b =>
                {
                    b.Navigation("Users");
                });

            modelBuilder.Entity("Safi.Backend.Core.Entities.IssueType", b =>
                {
                    b.Navigation("Tickets");
                });

            modelBuilder.Entity("Safi.Backend.Core.Entities.Ticket", b =>
                {
                    b.Navigation("History");

                    b.Navigation("Messages");
                });

            modelBuilder.Entity("Safi.Backend.Core.Entities.User", b =>
                {
                    b.Navigation("AssignedTickets");

                    b.Navigation("CreatedTickets");

                    b.Navigation("HistoryEntries");

                    b.Navigation("Messages");
                });
#pragma warning restore 612, 618
        }
    }
}
