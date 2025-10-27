using System.Threading.Tasks;
using Safi.Desktop.Helpers;

namespace Safi.Desktop.Views.Components;

public partial class UserTopBar : ContentView
{
    public event EventHandler LogoutClicked;



    public UserTopBar()
	{
		InitializeComponent();
	}

	public void SetUserInfo(string name, string email)
	{
		UserNameLabel.Text = name;
		PopupUserName.Text = name;
		PopupUserEmail.Text = email;

	}


	private void OnAvatarClicked(object sender, EventArgs e)
	{
		PopupMenu.IsVisible = !PopupMenu.IsVisible;
	}

    private async void OnLogoutClicked(object sender, EventArgs e)
    {
		try
		{
			PopupMenu.IsVisible = false;

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