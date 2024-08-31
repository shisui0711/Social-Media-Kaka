
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Ardalis.GuardClauses;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Infrastructure.Data.Interceptors;
using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Data;
using Infrastructure.Identity;
using Infrastructure.Configurations;
using Infrastructure.Services;



namespace Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            Guard.Against.Null(connectionString, message: "Connection string 'DefaultConnection' not found.");

            services.Configure<JwtConfiguration>(configuration.GetSection("Jwt"));
            services.Configure<GoogleAuthConfiguration>(configuration.GetSection("Authentication:Google"));
            services.Configure<FacebookAuthConfiguration>(configuration.GetSection("Authentication:Facebook"));
            services.Configure<ClientAppConfiguarion>(configuration.GetSection("ClientApp"));

            services.AddHttpClient("Facebook", config => {
                var baseUrl = configuration.GetValue<string>("Authentication:Facebook:BaseUrl");
                Guard.Against.NullOrEmpty(baseUrl, message: "Facebook base url is not configured");
                config.BaseAddress = new Uri(baseUrl);
            });

            services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();

            services.AddDbContext<ApplicationDbContext>((sp, options) =>
            {
                options.AddInterceptors(sp.GetServices<ISaveChangesInterceptor>());
                options.UseNpgsql(connectionString);
            });

            services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

            services.AddScoped<ApplicationDbContextInitialiser>();

            services.AddSingleton(TimeProvider.System);
            services.AddTransient<IIdentityService, IdentityService>();
            services.AddScoped<IJwtService, JwtService>();
            services.AddScoped<IGoogleAuthService, GoogleAuthService>();
            services.AddScoped<IFacebookAuthService, FacebookAuthService>();


            return services;
        }
    }
}