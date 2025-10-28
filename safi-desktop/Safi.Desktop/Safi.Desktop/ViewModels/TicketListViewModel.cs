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
        public ObservableCollection<Ticket> Tickets { get; set; } = new();
        public ICommand RefreshCommand { get; }
        public IAsyncRelayCommand NextPageCommand { get; }
        public IAsyncRelayCommand PreviousPageCommand { get; }


        private bool _isRefreshing;
        public bool IsRefreshing
        {
            get => _isRefreshing;
            set => SetProperty(ref _isRefreshing, value);
        }

        private Pagination _pagination = new();
        public Pagination Pagination
        {
            get => _pagination;
            set => SetProperty(ref _pagination, value);
        }

        public TicketFilter Filter { get; set; } = new TicketFilter();

        public TicketListViewModel()
        {
            _apiService = new ApiService();


            RefreshCommand = new Command(async () => await LoadTicketsAsync());
            NextPageCommand = new AsyncRelayCommand(async () => await LoadTicketsAsync(Pagination.CurrentPage + 1));
            PreviousPageCommand = new AsyncRelayCommand(async () => await LoadTicketsAsync(Pagination.CurrentPage - 1));



            _ = LoadTicketsAsync(1);
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

        private async Task LoadTicketsAsync(int page = 1)
        {
            try
            {

                IsRefreshing = true;

                var url = $"Tickets?page={page}&pageSize=5";
                var response = await _apiService.GetAsync(url);

                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<TicketResponse>(json, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    Tickets.Clear();

                    var random = new Random();

                    foreach (var ticket in result?.Tickets ?? [])
                    {
                        var randomAvatar = _avatarPaths[random.Next(_avatarPaths.Length)];
                        ticket.AvatarPath = randomAvatar;

                        Tickets.Add(ticket);
                    }
                        
                    Pagination = result?.Pagination ?? new Pagination();

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
        

        

    }
}
