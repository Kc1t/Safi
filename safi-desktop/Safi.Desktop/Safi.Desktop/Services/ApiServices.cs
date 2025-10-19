using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Safi.Desktop.Helpers;
using Safi.Desktop.WinUI;

namespace Safi.Desktop.Services
{
    class ApiServices
    {
        private static HttpClient _client;

        public ApiServices(string? token = null)
        {
            var settings = AppSettingsHelper.GetSettings();
            _client = new HttpClient
            {
                BaseAddress = new Uri(settings.BaseUrl)
            };

            if (!string.IsNullOrEmpty(token))
                _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }

        public async Task<T?> GetAsync<T>(string endpoint)
        {
            var response = await _client.GetAsync(endpoint);
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<T>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

        public async Task<T> PostAsync<T>(string endpoint, object data)
        {
            var json = JsonSerializer.Serialize(data);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _client.PostAsync(endpoint, content);
            response.EnsureSuccessStatusCode();
            var result = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<T>(result, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

    }
}
