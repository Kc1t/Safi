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

        public IAsyncRelayCommand RefreshCommand { get; }
        public IAsyncRelayCommand NextPageCommand { get; }
        public IAsyncRelayCommand PreviousPageCommand { get; }
        public IAsyncRelayCommand<int> ChangePageCommand { get; }

        [ObservableProperty]
        private bool isRefreshing;

        [ObservableProperty]
        private int currentPage = 1;

        [ObservableProperty]
        private int totalPages = 1;

        [ObservableProperty]
        private string paginationSummary = string.Empty;

        [ObservableProperty]
        private ObservableCollection<int> pageNumbers = new();

        private const int PageSize = 5;

        private readonly string[] _avatarPaths =
        {
            "avatar1.png",
            "avatar2.png",
            "avatar3.png",
            "avatar4.png",
            "avatar5.png",
            "avatar6.png"
        };

        public TicketListViewModel()
        {
            _apiService = new ApiService();

            RefreshCommand = new AsyncRelayCommand(LoadTicketsAsync);
            NextPageCommand = new AsyncRelayCommand(NextPageAsync);
            PreviousPageCommand = new AsyncRelayCommand(PreviousPageAsync);
            ChangePageCommand = new AsyncRelayCommand<int>(ChangePageAsync);

            _ = LoadTicketsAsync();
        }

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

                    _allTickets.Clear();
                    foreach (var ticket in result?.Tickets ?? [])
                    {
                        var randomAvatar = _avatarPaths[random.Next(_avatarPaths.Length)];
                        ticket.AvatarPath = randomAvatar;
                        _allTickets.Add(ticket);
                    }

                    TotalPages = (int)Math.Ceiling((double)_allTickets.Count / PageSize);
                    CurrentPage = 1;

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
                Tickets.Add(ticket);

            UpdatePaginationUI();
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

        private async Task ChangePageAsync(int page)
        {
            if (page >= 1 && page <= TotalPages)
            {
                CurrentPage = page;
                UpdateCurrentPageTickets();
            }
        }

        private void UpdatePaginationUI()
        {
            
            int start = (_allTickets.Count == 0) ? 0 : (CurrentPage - 1) * PageSize + 1;
            int end = Math.Min(CurrentPage * PageSize, _allTickets.Count);
            PaginationSummary = $"Mostrando {start} a {end} de {_allTickets.Count} chamados";

            var pages = new List<int>();
            int maxVisible = 4;

            if (TotalPages <= maxVisible)
            {
                for (int i = 1; i <= TotalPages; i++)
                    pages.Add(i);
            }
            else if (CurrentPage <= 2)
            {
                pages.AddRange(new[] { 1, 2, 3, 4 });
            }
            else if (CurrentPage >= TotalPages - 1)
            {
                pages.AddRange(Enumerable.Range(TotalPages - 3, 4));
            }
            else
            {
                pages.AddRange(new[] { CurrentPage - 1, CurrentPage, CurrentPage + 1, CurrentPage + 2 });
            }

            PageNumbers = new ObservableCollection<int>(pages);
        }
    }
}