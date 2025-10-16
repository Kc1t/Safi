using Safi.Desktop.ViewModels;
using Windows.Security.ExchangeActiveSyncProvisioning;

namespace Safi.Desktop.Views;

public partial class LoginPage : ContentPage
{
	public LoginPage()
	{
		InitializeComponent();
		BindingContext = new LoginViewModel();

	}
}