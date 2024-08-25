# Step 1: Build the ASP.NET Core API and run tests
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the src and tests directories into the container
COPY src/ /src/
COPY tests/ /tests/

# Restore all projects
RUN dotnet restore "/src/Web/WebApi.csproj"
RUN dotnet restore "/tests/Architecture.Tests/Architecture.Tests.csproj"
RUN dotnet restore "/tests/Application.UnitTests/Application.UnitTests.csproj"
# RUN dotnet restore "tests/Application.FunctionalTests/Application.FunctionalTests.csproj"


# Run tests
WORKDIR /tests/Architecture.Tests
RUN dotnet test  --verbosity normal

WORKDIR /tests/Application.UnitTests
RUN dotnet test  --verbosity normal

# WORKDIR /src/tests/Application.FunctionalTests
# RUN dotnet test  --verbosity normal

# Build the ASP.NET Core API
WORKDIR /src/Web
RUN dotnet build "WebApi.csproj" -c Release -o /app/build

# Publish the ASP.NET Core API
RUN dotnet publish "WebApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Build the Next.js app
FROM node:20 AS build-nextjs
WORKDIR /app

# Copy the ClientApp code (Next.js app)
COPY src/Web/ClientApp/ ./ClientApp/

# Install dependencies and build the Next.js app
WORKDIR /app/ClientApp
RUN npm install
RUN npm run build

# Final image combining ClientApp and ASP.NET Core API
FROM base AS final
WORKDIR /app

# Install Node.js and npm
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Copy the published ASP.NET Core API
COPY --from=build /app/publish/ .

# Copy the Next.js app
COPY --from=build-nextjs /app/ClientApp/.next ./.next
COPY --from=build-nextjs /app/ClientApp/public ./public
COPY --from=build-nextjs /app/ClientApp/node_modules ./node_modules
COPY --from=build-nextjs /app/ClientApp/package.json ./package.json

# Copy start.sh
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Set environment variables for Next.js
ENV NODE_ENV production

# Expose ports for both the API and the Next.js app
EXPOSE 80 443 3000

# Start both ASP.NET Core API and ClientApp
CMD ["/start.sh"]
