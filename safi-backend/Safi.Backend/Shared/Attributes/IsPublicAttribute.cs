using Microsoft.AspNetCore.Authorization;

namespace Safi.Backend.Shared.Attributes;

/// <summary>
/// Atributo que marca um endpoint como público, permitindo acesso sem autenticação
/// </summary>
public class IsPublicAttribute : Attribute
{
    /// <summary>
    /// Indica se o endpoint é público
    /// </summary>
    public bool IsPublic { get; } = true;
}

