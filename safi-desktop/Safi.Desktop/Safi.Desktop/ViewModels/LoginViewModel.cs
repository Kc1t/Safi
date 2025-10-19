using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows.Input;
using Safi.Desktop.Models;
using Windows.System.UserProfile;

namespace Safi.Desktop.ViewModels
{
    public partial class LoginViewModel : BindableObject
    {
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
                var response = await client.PostAsJsonAsync("http://localhost:5080/api/Auth/login",
                    new { Email, Password });

                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var loginResponse = JsonSerializer.Deserialize<LoginResponse>(json, 
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                    Preferences.Set("auth_token", loginResponse.Token);
                    Preferences.Set("user_id", loginResponse.User.Id);
                    Preferences.Set("user_name", loginResponse.User.Name);
                    Preferences.Set("user_email", loginResponse.User.Email);

                    await Application.Current.MainPage.DisplayAlert("Sucesso", "Login efetuado com sucesso!", "OK");

                }
                else
                {
                    await Application.Current.MainPage.DisplayAlert("Erro", "Credenciais inválidas.", "OK");
                }
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
