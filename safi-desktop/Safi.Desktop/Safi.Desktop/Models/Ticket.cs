using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.ApplicationModel.Resources.Management;

namespace Safi.Desktop.Models
{
    class Ticket
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status {  get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string? SupportLevel { get; set; }
        public string? AssignedToName { get; set; }
        public DateTime CreatedAt { get; set; }


    }
}
