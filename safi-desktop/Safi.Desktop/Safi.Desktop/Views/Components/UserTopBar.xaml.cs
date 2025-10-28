using System.Threading.Tasks;
using Safi.Desktop.Helpers;

namespace Safi.Desktop.Views.Components;

public partial class UserTopBar : ContentView
{
    private bool _isPopupVisible = false;

    public UserTopBar()
    {
        InitializeComponent();
        var tapOutside = new TapGestureRecognizer();
        tapOutside.Tapped += (s, e) => HidePopup();
        this.GestureRecognizers.Add(tapOutside);
    }

    private void OnArrowButtonClicked(object sender, EventArgs e)
    {
        _isPopupVisible = !_isPopupVisible;
        PopupFrame.IsVisible = _isPopupVisible;
    }

    private void HidePopup()
    {
        if (_isPopupVisible)
        {
            PopupFrame.IsVisible = false;
            _isPopupVisible = false;
        }
    }

    private async void OnLogoutClicked(object sender, EventArgs e)
    {
        bool confirm = await Application.Current.MainPage.DisplayAlert("Sair", "Deseja realmente sair?", "Sim", "Cancelar");
        if (confirm)
        {
            try
            {
                AppConfigHelper.SaveToken(null);
                await Application.Current.MainPage.DisplayAlert("Logout", "Sessão encerrada com sucesso!", "OK");
                Application.Current.MainPage = new AppShell();
                await Shell.Current.GoToAsync("//Login");
            }
            catch (Exception ex)
            {
                await Application.Current.MainPage.DisplayAlert("Erro", $"Erro ao sair: {ex.Message}", "OK");
            }
        }
    }

    public void SetUserInfo(string nome, string email)
    {
        UserNameLabel.Text = nome;
        PopupUserName.Text = nome;
        PopupUserEmail.Text = email;
    }
}