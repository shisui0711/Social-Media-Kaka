
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Infrastructure.Data.Interceptors
{
    public class AuditableEntityInterceptor : SaveChangesInterceptor
    {
        private readonly IUser _user;

        public AuditableEntityInterceptor(
            IUser user,
            TimeProvider dateTime)
        {
            _user = user;
        }

        public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
        {
            UpdateEntities(eventData.Context);

            return base.SavingChanges(eventData, result);
        }

        public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
        {
            UpdateEntities(eventData.Context);

            return base.SavingChangesAsync(eventData, result, cancellationToken);
        }

        public void UpdateEntities(DbContext? context)
        {
            if (context == null) return;


            foreach (var entry in context.ChangeTracker.Entries())
            {
                if (entry.Entity is BaseAuditableEntity entity)
                {
                    if (entry.State is EntityState.Added or EntityState.Modified || entry.HasChangedOwnedEntities())
                    {
                        if (entry.State == EntityState.Added)
                        {
                            entity.CreatedBy = _user.Id;
                            if (entity.Created == default)
                                entity.Created = DateTime.UtcNow;
                        }
                        entity.LastModifiedBy = _user.Id;
                        if (entity.LastModified == default)
                            entity.LastModified = DateTime.UtcNow;
                    }
                }
                if (entry.Entity is IdentityUser identityUser)
                {
                    if (entry.State is EntityState.Added or EntityState.Modified || entry.HasChangedOwnedEntities())
                    {
                        var _entity = identityUser as User;
                        if (_entity != null)
                        {
                            if (entry.State == EntityState.Added)
                            {
                                _entity.CreatedBy = _user.Id;
                                if (_entity.Created == default)
                                _entity.Created = DateTime.UtcNow;
                            }
                            _entity.LastModifiedBy = _user.Id;
                            if (_entity.LastModified == default)
                            _entity.LastModified = DateTime.UtcNow;
                        }

                    }
                }
            }
        }
    }

    public static class Extensions
    {
        public static bool HasChangedOwnedEntities(this EntityEntry entry) =>
            entry.References.Any(r =>
                r.TargetEntry != null &&
                r.TargetEntry.Metadata.IsOwned() &&
                (r.TargetEntry.State == EntityState.Added || r.TargetEntry.State == EntityState.Modified));
    }
}