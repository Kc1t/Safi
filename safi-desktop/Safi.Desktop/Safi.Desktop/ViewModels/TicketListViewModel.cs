using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Web;
using System.Windows.Input;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Maui.Animations;
using Safi.Desktop.Helpers;
using Safi.Desktop.Models.Tickets;
using Safi.Desktop.Services;
using Windows.Services.Maps;

namespace Safi.Desktop.ViewModels
{
    public partial class TicketListViewModel : ObservableObject
    {
        private readonly ApiService _apiService;

        private List<Ticket> _allTickets = new();
        public ObservableCollection<Ticket> Tickets { get; set; } = new();
        public ICommand RefreshCommand { get; }
        public IAsyncRelayCommand NextPageCommand { get; }
        public IAsyncRelayCommand PreviousPageCommand { get; }


        [ObservableProperty]
        private bool isRefreshing;

        [ObservableProperty]
        private int currentPage = 1;

        [ObservableProperty]
        private int totalPages = 1;

        private const int PageSize = 5;

        

        public TicketListViewModel()
        {
            _apiService = new ApiService();

            NextPageCommand = new AsyncRelayCommand(NextPageAsync);
            PreviousPageCommand = new AsyncRelayCommand(PreviousPageAsync);
            RefreshCommand = new AsyncRelayCommand(LoadTicketsAsync);

            _ = LoadTicketsAsync();
        }


        private readonly string[] _avatarPaths = new[]
        {
            "avatar1.png",
            "avatar2.png",
            "avatar3.png",
            "avatar4.png",
            "avatar5.png",
            "avatar6.png"
        };

        private async Task LoadTicketsAsync()
        {
            try
            {

                IsRefreshing = true;

                var response = await _apiService.GetAsync("Tickets");

                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<TicketResponse>(json, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });


                    var random = new Random();

                    foreach (var ticket in result?.Tickets ?? [])
                    {
                        var randomAvatar = _avatarPaths[random.Next(_avatarPaths.Length)];
                        ticket.AvatarPath = randomAvatar;

                        Tickets.Add(ticket);
                    }

                    _allTickets = result?.Tickets?.ToList() ?? new List<Ticket>();

                    TotalPages = (int)Math.Ceiling((double)_allTickets.Count / PageSize);

                    UpdateCurrentPageTickets();

                }
                else
                {
                    await Application.Current.MainPage.DisplayAlert("Erro", "Não foi possível carregar os tickets.", "OK");
                }

            }
            catch (Exception ex)
            {
                await Application.Current.MainPage.DisplayAlert("Erro", $"Falha ao carregar tickets: {ex.Message}", "OK");
            }
            finally
            {
                IsRefreshing = false;
            }
        }

        private void UpdateCurrentPageTickets()
        {
            Tickets.Clear();

            var startIndex = (CurrentPage - 1) * PageSize;
            var currentTickets = _allTickets.Skip(startIndex).Take(PageSize).ToList();

            foreach (var ticket in currentTickets)
            {
                Tickets.Add(ticket);
            }
        }

        private async Task NextPageAsync()
        {
            if (CurrentPage < TotalPages)
            {
                CurrentPage++;
                UpdateCurrentPageTickets();
            }
        }

        private async Task PreviousPageAsync()
        {
            if (CurrentPage > 1)
            {
                CurrentPage--;
                UpdateCurrentPageTickets();
            }
        }


    }
}
