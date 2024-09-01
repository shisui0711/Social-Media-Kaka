using WebApi;
using Infrastructure;
using Application;
using Infrastructure.Data;
using Serilog;
using WebApi.Infrastructure;
using Serilog.Events;
using WebApi.Hubs;

var builder = WebApplication.CreateBuilder(args);
#if DEBUG
// builder.WebHost.UseUrls("https://0.0.0.0:8000");
#endif
builder.Services.AddSerilog((services, lc) => lc
    .ReadFrom.Configuration(builder.Configuration)
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft.EntityFrameworkCore.*", LogEventLevel.Warning)
    .ReadFrom.Services(services)
    .Enrich.FromLogContext()
    .WriteTo.Console());

// Add services to the container.

builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddWebServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    await app.Services.InitialiseDatabaseAsync();
}
else{
    app.UseHsts();
}

app.UseSerilogRequestLogging(options =>
{
    // Customize the message template
    options.MessageTemplate = "Handled {RequestPath}";

    // Emit debug-level events instead of the defaults
    options.GetLevel = (httpContext, elapsed, ex) => LogEventLevel.Information;

    // Attach additional properties to the request completion event
    options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
    {
        diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value);
        diagnosticContext.Set("RequestScheme", httpContext.Request.Scheme);
    };
});


app.UseOpenApi();
app.UseSwaggerUi(settings => {
    settings.Path = "/api";
    settings.DocumentPath = "/api/specification.json";
});

app.UseCors("CorsPolicy");
app.UseStaticFiles();
app.UseHttpsRedirection();

app.UseMiddleware<ExceptionMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapHub<ProjectHub>("/project-hub");

app.Map("/", () => Results.Redirect("/api"));

app.MapEndpoints();

app.Run();

public partial class Program { }