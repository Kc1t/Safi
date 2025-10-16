using Safi.Desktop.ViewModels;

namespace Safi.Desktop.Views;

public partial class LoginPage : ContentPage
{
	public LoginPage()
	{
		InitializeComponent();
		BindingContext = new LoginViewModel();
	}
}