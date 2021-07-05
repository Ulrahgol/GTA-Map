#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["GTA-Map/GTA-Map.csproj", "GTA-Map/"]
RUN dotnet restore "GTA-Map/GTA-Map.csproj"
COPY . .
WORKDIR "/src/GTA-Map"
RUN dotnet build "GTA-Map.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "GTA-Map.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GTA-Map.dll"]