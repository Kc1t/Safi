using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace Safi.Desktop.ViewModels
{
    public class LoginViewModel : BindableObject
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
            //implementar tela de registro
            await Application.Current.MainPage.DisplayAlert("Registrar", "", "OK");
        }

    }
}
