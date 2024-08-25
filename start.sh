#!/bin/bash

# Start the ASP.NET Core API
dotnet WebApi.dll &

# Start the Next.js app
npm start --prefix . &

# Wait for all background processes to finish
wait