using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Safi.Desktop.Models.Tickets
{
    public class TicketResponse
    {
        public List<Ticket> Tickets { get; set; } = new();
        public Pagination Pagination { get; set; } = new();
    }
}
