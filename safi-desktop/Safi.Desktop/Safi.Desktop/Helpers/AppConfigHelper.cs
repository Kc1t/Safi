using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Windows.Security.Cryptography.Core;

namespace Safi.Desktop.Helpers
{
    public static class AppConfigHelper
    {
        private static string? _baseUrl;
        private static string? _token;

        public static string GetBaseUrl()
        {
            if (!string.IsNullOrEmpty(_baseUrl)) return _baseUrl;

            var filePath = Path.Combine(AppContext.BaseDirectory, "appsettings.json");
            if (!File.Exists(filePath)) throw new FileNotFoundException("Arquivo appsettings.json não encontrado.");

            var json = File.ReadAllText(filePath);
            var config = JsonSerializer.Deserialize<Dictionary<string, string>>(json);

            _baseUrl = config?["BaseUrl"] ?? throw new Exception("BaseUrl não encontrado.");
            return _baseUrl;
        }

        public static void SaveToken(string token) => _token = token;

        public static string? GetToken() => _token;

    }
}
