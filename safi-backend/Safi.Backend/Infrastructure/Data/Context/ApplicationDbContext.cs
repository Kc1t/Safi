using Microsoft.EntityFrameworkCore;
using Safi.Backend.Core.Entities;
using Safi.Backend.Core.Enums;

namespace Safi.Backend.Infrastructure.Data.Context;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    // DbSets das entidades
    public DbSet<User> Users { get; set; }
    public DbSet<Ticket> Tickets { get; set; }
    public DbSet<TicketMessage> TicketMessages { get; set; }
    public DbSet<TicketHistory> TicketHistory { get; set; }
    public DbSet<TicketChatHistory> TicketChatHistory { get; set; }
    public DbSet<IssueType> IssueTypes { get; set; }
    public DbSet<Department> Departments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configurações das entidades
        ConfigureUser(modelBuilder);
        ConfigureTicket(modelBuilder);
        ConfigureTicketMessage(modelBuilder);
        ConfigureTicketHistory(modelBuilder);
        ConfigureIssueType(modelBuilder);
        ConfigureDepartment(modelBuilder);
    }

    private void ConfigureUser(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(150);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.Email).IsUnique();
            
            // Relacionamentos
            entity.HasOne(e => e.Department)
                  .WithMany(d => d.Users)
                  .HasForeignKey(e => e.DepartmentId)
                  .OnDelete(DeleteBehavior.SetNull);
        });
    }

    private void ConfigureTicket(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Ticket>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Status).HasConversion<string>();
            entity.Property(e => e.Priority).HasConversion<string>();
            
            // Relacionamentos
            entity.HasOne(e => e.IssueType)
                  .WithMany(it => it.Tickets)
                  .HasForeignKey(e => e.IssueTypeId)
                  .OnDelete(DeleteBehavior.Restrict);
                  
            entity.HasOne(e => e.User)
                  .WithMany(u => u.CreatedTickets)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Restrict);
                  
            entity.HasOne(e => e.AssignedTo)
                  .WithMany(u => u.AssignedTickets)
                  .HasForeignKey(e => e.AssignedToId)
                  .OnDelete(DeleteBehavior.SetNull);
        });
    }

    private void ConfigureTicketMessage(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TicketMessage>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Message).IsRequired();
            entity.Property(e => e.MessageType).HasMaxLength(50);
            
            // Relacionamentos
            entity.HasOne(e => e.Ticket)
                  .WithMany(t => t.Messages)
                  .HasForeignKey(e => e.TicketId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne(e => e.Sender)
                  .WithMany(u => u.Messages)
                  .HasForeignKey(e => e.SenderId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private void ConfigureTicketHistory(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TicketHistory>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ChangeDescription).IsRequired();
            entity.Property(e => e.ChangeType).HasMaxLength(50);
            entity.Property(e => e.OldValue).HasMaxLength(500);
            entity.Property(e => e.NewValue).HasMaxLength(500);
            
            // Relacionamentos
            entity.HasOne(e => e.Ticket)
                  .WithMany(t => t.History)
                  .HasForeignKey(e => e.TicketId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne(e => e.ChangedBy)
                  .WithMany(u => u.HistoryEntries)
                  .HasForeignKey(e => e.ChangedById)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private void ConfigureIssueType(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<IssueType>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.HasIndex(e => e.Name).IsUnique();
        });
    }

    private void ConfigureDepartment(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Department>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.HasIndex(e => e.Name).IsUnique();
        });
    }
}
