using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace Safi.Desktop.ViewModels
{
    public partial class RegisterViewModel : BindableObject
    {

        private string _name;
        public string Name
        {
            get => _name;
            set { _name = value; OnPropertyChanged(); }
        }

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

        private string _confirmPassword;
        public string ConfirmPassword
        {
            get => _confirmPassword;
            set { _confirmPassword = value; OnPropertyChanged(); }
        }

        public ICommand RegisterCommand { get; }
        public ICommand GoBackCommand { get; }

        public RegisterViewModel()
        {
            RegisterCommand = new Command(async () => await RegisterAsync());
            GoBackCommand = new Command(async () => await Application.Current.MainPage.Navigation.PopAsync());
        }

        public async Task RegisterAsync()
        {
            if (string.IsNullOrWhiteSpace(Name) ||
                string.IsNullOrWhiteSpace(Email) ||
                string.IsNullOrWhiteSpace(Password) ||
                string.IsNullOrWhiteSpace(ConfirmPassword))
            {
                await Application.Current.MainPage.DisplayAlert("Erro", "Preencha todos os campos.", "OK");
                return;
            }

            if (Password != ConfirmPassword)
            {
                await Application.Current.MainPage.DisplayAlert("Erro", "As senhas não conferem.", "OK");
                return;
            }

            try
            {
                using var client = new HttpClient();
                var response = await client.PostAsJsonAsync("http://localhost:5080/api/Auth/register", new
                {
                    name = Name,
                    email = Email,
                    password = Password,
                    confirmPassword = ConfirmPassword
                });

                if (response.IsSuccessStatusCode)
                {
                    await Application.Current.MainPage.DisplayAlert("Sucesso", "Cadastro realizado!", "Ok");
                    await Application.Current.MainPage.Navigation.PopAsync();
                }
                else
                {
                    var msg = await response.Content.ReadAsStringAsync();
                    await Application.Current.MainPage.DisplayAlert("Erro", $"Falha no registro: {msg}", "OK");
                }
            }
            catch (Exception ex)
            {
                await Application.Current.MainPage.DisplayAlert("Erro", ex.Message, "OK");
            }

        }
    }
}
