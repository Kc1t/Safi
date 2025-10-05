using System.Linq.Expressions;

namespace Safi.Backend.Core.Interfaces;

/// <summary>
/// Interface base para repositórios genéricos
/// </summary>
/// <typeparam name="T">Tipo da entidade</typeparam>
public interface IRepository<T> where T : class
{
    /// <summary>
    /// Obtém uma entidade por ID
    /// </summary>
    /// <param name="id">ID da entidade</param>
    /// <returns>Entidade encontrada ou null</returns>
    Task<T?> GetByIdAsync(int id);

    /// <summary>
    /// Obtém todas as entidades
    /// </summary>
    /// <returns>Lista de entidades</returns>
    Task<IEnumerable<T>> GetAllAsync();

    /// <summary>
    /// Obtém entidades baseadas em uma condição
    /// </summary>
    /// <param name="predicate">Condição para filtrar</param>
    /// <returns>Lista de entidades que atendem à condição</returns>
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);

    /// <summary>
    /// Obtém a primeira entidade que atende à condição
    /// </summary>
    /// <param name="predicate">Condição para filtrar</param>
    /// <returns>Primeira entidade encontrada ou null</returns>
    Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate);

    /// <summary>
    /// Adiciona uma nova entidade
    /// </summary>
    /// <param name="entity">Entidade a ser adicionada</param>
    /// <returns>Entidade adicionada</returns>
    Task<T> AddAsync(T entity);

    /// <summary>
    /// Adiciona múltiplas entidades
    /// </summary>
    /// <param name="entities">Entidades a serem adicionadas</param>
    /// <returns>Entidades adicionadas</returns>
    Task<IEnumerable<T>> AddRangeAsync(IEnumerable<T> entities);

    /// <summary>
    /// Atualiza uma entidade existente
    /// </summary>
    /// <param name="entity">Entidade a ser atualizada</param>
    /// <returns>Entidade atualizada</returns>
    Task<T> UpdateAsync(T entity);

    /// <summary>
    /// Remove uma entidade
    /// </summary>
    /// <param name="entity">Entidade a ser removida</param>
    /// <returns>True se removida com sucesso</returns>
    Task<bool> RemoveAsync(T entity);

    /// <summary>
    /// Remove uma entidade por ID
    /// </summary>
    /// <param name="id">ID da entidade</param>
    /// <returns>True se removida com sucesso</returns>
    Task<bool> RemoveByIdAsync(int id);

    /// <summary>
    /// Verifica se existe uma entidade que atende à condição
    /// </summary>
    /// <param name="predicate">Condição para verificar</param>
    /// <returns>True se existe</returns>
    Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate);

    /// <summary>
    /// Conta o número de entidades que atendem à condição
    /// </summary>
    /// <param name="predicate">Condição para contar</param>
    /// <returns>Número de entidades</returns>
    Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null);
}
