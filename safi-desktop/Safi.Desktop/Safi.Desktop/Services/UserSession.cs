using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Safi.Desktop.Models.Auth;

namespace Safi.Desktop.Services
{
    public class UserSession
    {

        public static UserInfo CurrentUser { get; private set; }

        public static void SetUser(UserInfo user)
        {
            CurrentUser = user;
        }

        public static void Clear()
        {
            CurrentUser = null;
        }

        public static bool IsLoggedIn => CurrentUser != null;

    }
}
