using Safi.Desktop.Models.Tickets;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;

namespace Safi.Desktop.Services
{
    public class TicketService
    {

        private readonly HttpClient _httpClient;

        public TicketService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<TicketResponse> GetTicketsAsync(int page = 1, int pageSize = 10)
        {
            string url = $"http://localhost:5080/api/tickets?page={page}&pageSize={pageSize}";
            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Erro ao buscar tickets: {response.StatusCode}");
            }

            var result = await response.Content.ReadFromJsonAsync<TicketResponse>();
            return result ?? new TicketResponse { Tickets = new List<Ticket>(), Pagination = new Pagination() };

        }

    }
}
