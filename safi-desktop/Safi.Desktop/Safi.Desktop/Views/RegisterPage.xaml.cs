using Safi.Desktop.ViewModels;

namespace Safi.Desktop.Views;

public partial class RegisterPage : ContentPage
{
	public RegisterPage()
	{ 
		InitializeComponent();
        BindingContext = new RegisterViewModel();
    }
}