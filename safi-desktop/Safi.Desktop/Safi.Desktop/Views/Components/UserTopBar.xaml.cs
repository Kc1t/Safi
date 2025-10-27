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
		UserEmailLabel.Text = email;
		PopupUserName.Text = name;
		PopupUserEmail.Text = email;

	}


	private void onAvatarClicked(object sender, EventArgs e)
	{
		PopupMenu.IsVisible = !PopupMenu.IsVisible;
	}

    private void OnLogoutClicked(object sender, EventArgs e)
    {
        PopupMenu.IsVisible = false;
        LogoutClicked?.Invoke(this, EventArgs.Empty);
    }

}