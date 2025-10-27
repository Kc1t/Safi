using Safi.Desktop.Services;

namespace Safi.Desktop.Views;

public partial class TicketsPage : ContentPage
{

    private string name;
    private string email;

    public string Name
    {
        get => name;
        set
        {
            name = value;
            TopBar?.SetUserInfo(name, email);
        }
    }

    public string Email
    {
        get => email;
        set
        {
            email = value;
            TopBar?.SetUserInfo(name, email);
        }
    }

    public TicketsPage()
	{
		InitializeComponent();
	}

    protected override void OnAppearing()
    {
        base.OnAppearing();

        if (UserSession.IsLoggedIn)
        {
            var user = UserSession.CurrentUser;
            TopBar.SetUserInfo(user.Name, user.Email);
        }
    }
}