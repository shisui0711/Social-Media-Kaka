

using System.Text;
using Application.Common.Interfaces;
using Ardalis.GuardClauses;
using Domain.Constants;
using Domain.Entities;
using Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using WebApi.Services;
using NSwag;
using NSwag.Generation.Processors.Security;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;

namespace WebApi
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddWebServices(this IServiceCollection services, IConfiguration configuration)
        {

            services.AddDatabaseDeveloperPageExceptionFilter();

            services.AddScoped<IUser, CurrentUser>();

            services.AddHttpContextAccessor();

            services.AddSignalR();

            services.AddHealthChecks().AddDbContextCheck<ApplicationDbContext>();

            services.Configure<ApiBehaviorOptions>(options =>
            options.SuppressModelStateInvalidFilter = true);

            services.AddEndpointsApiExplorer();

            services.AddOpenApiDocument((configure, sp) =>
            {
                configure.Title = "Kaka-SocialMedia API";

                // Add JWT
                configure.AddSecurity("JWT", Enumerable.Empty<string>(), new OpenApiSecurityScheme
                {
                    Type = OpenApiSecuritySchemeType.ApiKey,
                    Name = "Authorization",
                    In = OpenApiSecurityApiKeyLocation.Header,
                    Description = "Type into the textbox: Bearer {your JWT token}."
                });

                configure.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("JWT"));
            });

            services.AddControllers()
            .AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
            });

            services.AddCors(options =>
                options.AddPolicy("CorsPolicy", builder =>
                {
                    builder.WithOrigins(
                    "http://localhost:3000",
                    "https://localhost:3000",
                    "http://192.168.1.22:3000",
                    "https://192.168.1.22:3000"
                    )
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials();
                })
            );

            services.AddAuthentication(options =>
            {
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                var secret = configuration.GetValue<string>("Jwt:Key");
                Guard.Against.NullOrEmpty(secret, nameof(secret));
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = configuration.GetValue<string>("Jwt:Issuer"),
                    ValidAudience = configuration.GetValue<string>("Jwt:Audience"),
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
                    ValidateLifetime = true,
                    ValidateAudience = true,
                    ValidateIssuer = true,
                    ValidateIssuerSigningKey = true
                };
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];

                        // If the request is for our hub...
                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) &&
                            path.StartsWithSegments("/project-hub"))
                        {
                            // Read the token out of the query string
                            context.Token = accessToken;
                        }
                        //Console.WriteLine($"Token received: {context.Token}");
                        return Task.CompletedTask;
                    }
                };
            });

            services
            .AddIdentityCore<User>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddApiEndpoints();
            services.AddAuthorization(options =>
            {
                options.AddPolicy(Policies.CanPurge, policy => policy.RequireRole(Roles.Administrator));
                options.AddPolicy(Policies.AccessToken, policy => policy.RequireRole("Access").Combine(options.DefaultPolicy));
                options.AddPolicy(Policies.RefreshToken, policy => policy.RequireRole("Refresh"));
            });

            return services;
        }
    }
}