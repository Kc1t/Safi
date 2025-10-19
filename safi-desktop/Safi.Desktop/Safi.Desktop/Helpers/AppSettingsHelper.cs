using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Safi.Desktop.Helpers
{
    public static class AppSettingsHelper
    {
        private static AppSettings? _cachedSettings;

        public static AppSettings GetSettings()
        {
            if (_cachedSettings != null) return _cachedSettings;

            var filePath = Path.Combine(FileSystem.AppDataDirectory, "appsettings.json");

            if (!File.Exists(filePath))
                filePath = Path.Combine(AppContext.BaseDirectory, "appsettings.json");

            if (!File.Exists(filePath))
                throw new FileNotFoundException("Arquivo appsettings.json não encontrado.");

            var json = File.ReadAllText(filePath);
            _cachedSettings = JsonSerializer.Deserialize<AppSettings>(json)
                ?? new AppSettings();

            return _cachedSettings;
        }

    }
}
