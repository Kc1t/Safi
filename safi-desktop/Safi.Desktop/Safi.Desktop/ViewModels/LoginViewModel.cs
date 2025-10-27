using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows.Input;
using Safi.Desktop.Helpers;
using Safi.Desktop.Models.Auth;
using Safi.Desktop.Services;
using Windows.System.UserProfile;

namespace Safi.Desktop.ViewModels
{
    public partial class LoginViewModel : BindableObject
    {
        private readonly ApiService _apiService;

        private string _email;
        public string Email
        {
            get => _email;
            set { _email = value; OnPropertyChanged(); }
        }

        private string _password;
        public string Password
        {
            get => _password;
            set { _password = value; OnPropertyChanged(); }
        }
  

        public ICommand LoginCommand { get; }
        public ICommand RegisterCommand { get; }

        public LoginViewModel()
        {
            _apiService = new ApiService();
            LoginCommand = new Command(async () => await LoginIn());
            RegisterCommand = new Command(async () => await Registration());
        }

        private async Task LoginIn()
        {
            if (string.IsNullOrWhiteSpace(Email) || string.IsNullOrWhiteSpace(Password))
            {
                await Application.Current.MainPage.DisplayAlert("Erro", "Preencha todos os campos.", "OK");
                return;
            }

            try
            {
                using var client = new HttpClient();
                var response = await _apiService.PostAsync("Auth/login", new { Email, Password });

                var json = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    await Application.Current.MainPage.DisplayAlert("Erro", "Falha ao conectar ao servidor.", "OK");
                    return;
                }

                var loginResponse = JsonSerializer.Deserialize<LoginResponse>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (loginResponse == null || loginResponse.User == null)
                {
                    await Application.Current.MainPage.DisplayAlert("Erro", "Credenciais inválidas.", "OK");
                    return;
                }

                AppConfigHelper.SaveToken(loginResponse.Token);
                UserSession.SetUser(loginResponse.User);

                await Application.Current.MainPage.DisplayAlert("Sucesso", "Login efetuado com sucesso!", "OK");

                await Shell.Current.GoToAsync("//TicketsPage");

            } 
            catch (Exception ex)
            {
                await Application.Current.MainPage.DisplayAlert("Erro", ex.Message, "OK");
            }
        }

        private async Task Registration()
        {
            await Application.Current.MainPage.Navigation.PushAsync(new Views.RegisterPage());
        }
    }
}
