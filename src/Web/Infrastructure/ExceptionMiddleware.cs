
using Application.Common.Exceptions;
using Ardalis.GuardClauses;
using Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Infrastructure
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
                if (httpContext.Response.StatusCode == StatusCodes.Status403Forbidden)
                throw new ForbiddenAccessException();
                if (httpContext.Response.StatusCode == StatusCodes.Status401Unauthorized)
                throw new UnauthorizedAccessException();
            }
            catch (DomainException e){
                _logger.LogInformation(e.Message);
                httpContext.Response.StatusCode =
                StatusCodes.Status400BadRequest;
                await httpContext.Response.WriteAsJsonAsync(new { success = false, error = e.Message });
            }
            catch(BadHttpRequestException e){
                httpContext.Response.StatusCode =
                StatusCodes.Status400BadRequest;
                await httpContext.Response.WriteAsJsonAsync(new { success = false, error = e.Message });
            }
            catch (ArgumentNullException e)
            {
                _logger.LogError(
                e, "Exception occurred: {Message}", e.Message);
                httpContext.Response.StatusCode =
                StatusCodes.Status500InternalServerError;
                await httpContext.Response.WriteAsJsonAsync(new { success = false, error = "Internal Server Error" });
            }
            catch (ValidationException e)
            {

                httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;

                await httpContext.Response.WriteAsJsonAsync(new { success = false, error = e.Message });
            }
            catch (NotFoundException e)
            {
                httpContext.Response.StatusCode = StatusCodes.Status404NotFound;

                await httpContext.Response.WriteAsJsonAsync(new { success = false, error = e.Message });
            }
            catch (UnauthorizedAccessException)
            {
                httpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;

                await httpContext.Response.WriteAsJsonAsync(new { success = false, error = "Unauthorized"});
            }
            catch (ForbiddenAccessException e)
            {
                httpContext.Response.StatusCode = StatusCodes.Status403Forbidden;
                await httpContext.Response.WriteAsJsonAsync(new
                {
                    success = false,
                    error = e.Message
                });
            }
            catch (Exception e)
            {
                _logger.LogError(
                e, "Exception occurred: {Message}", e.Message);
                httpContext.Response.StatusCode =
                StatusCodes.Status500InternalServerError;
                await httpContext.Response.WriteAsJsonAsync(new { success = false, error = "Internal Server Error" });
                throw;
            }
        }
    }
}