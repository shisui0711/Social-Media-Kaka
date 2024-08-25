using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

using Application.Common.Interfaces;

namespace WebApi.Services
{
    public class CurrentUser : IUser
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUser(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string? Id => _httpContextAccessor.HttpContext?.User?.Claims.FirstOrDefault(c=>c.Type == ClaimTypes.NameIdentifier)?.Value;
    }
}