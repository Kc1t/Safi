using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Safi.Desktop.Models.Tickets
{
    public class Ticket
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Status { get; set; }
        public string? Priority { get; set; }
        public string? UserName { get; set; }
        public string? UserEmail { get; set; }
        public string? UserDepartment { get; set; }
        public string? AssignedTo { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string AvatarPath { get; set; }
        
    }
}
