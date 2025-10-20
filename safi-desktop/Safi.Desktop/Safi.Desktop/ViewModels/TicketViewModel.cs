using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Maui.Animations;
using Safi.Desktop.Helpers;
using Safi.Desktop.Models;
using Safi.Desktop.Services;
using Windows.Services.Maps;

namespace Safi.Desktop.ViewModels
{
    public partial class TicketViewModel : ObservableObject
    {
        private readonly ApiService _apiServices;

        //[ObservableProperty]
        //private ObservableCollection<Ticket> tickets = new();

        [ObservableProperty]
        private bool isLoading;

        public TicketViewModel()
        {
            LoadTicketsCommand = new AsyncRelayCommand(LoadTicketAsync);
        }

        public IAsyncRelayCommand LoadTicketsCommand { get; }

        private async Task LoadTicketAsync()
        {
            isLoading = true;

            try
            {
                //var result = await _apiServices.GetAsync<List<Ticket>>("api/Tickets");
                //Tickets = new ObservableCollection<Ticket>(result);
            } 
            catch (Exception ex)
            {
                await Application.Current.MainPage.DisplayAlert("Erro", $"Falha ao carregar tickets: {ex.Message}", "OK");
            }
            finally
            {
                isLoading = false;
            }
        }

        



    }
}
