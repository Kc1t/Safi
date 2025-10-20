using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.ApplicationModel.Resources.Management;

namespace Safi.Desktop.Models.Tickets
{
    public class TicketFilter
    {
        public string? Status { get; set; }
        public string? Priority { get; set; }
        public int? UserId { get; set; }
        public int? AssignedTo { get; set; }
        public int? IssueTypeId { get; set; }
        public string? SupportLevel { get; set; }
        public string? SearchTerm { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;


    }
}
