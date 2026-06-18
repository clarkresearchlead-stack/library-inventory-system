using System.Text;
using System.Text.Json;

namespace LibraryInventory.Api.Middleware;

/// <summary>
/// Normalizes incoming JSON property names to snake_case so clients can send
/// camelCase or PascalCase while the API contract remains snake_case.
/// </summary>
public class JsonSnakeCaseNormalizationMiddleware
{
    private static readonly HashSet<string> JsonBodyMethods =
        new(StringComparer.OrdinalIgnoreCase) { "POST", "PUT", "PATCH" };

    private readonly RequestDelegate _next;

    public JsonSnakeCaseNormalizationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (ShouldNormalize(context))
        {
            context.Request.EnableBuffering();
            using var reader = new StreamReader(context.Request.Body, Encoding.UTF8, leaveOpen: true);
            var body = await reader.ReadToEndAsync();
            context.Request.Body.Position = 0;

            if (!string.IsNullOrWhiteSpace(body))
            {
                using var document = JsonDocument.Parse(body);
                var normalized = NormalizeElement(document.RootElement);
                var bytes = JsonSerializer.SerializeToUtf8Bytes(normalized);
                context.Request.Body = new MemoryStream(bytes);
                context.Request.ContentLength = bytes.Length;
            }
        }

        await _next(context);
    }

    private static bool ShouldNormalize(HttpContext context)
    {
        if (!JsonBodyMethods.Contains(context.Request.Method))
            return false;

        return context.Request.ContentType?.Contains("application/json", StringComparison.OrdinalIgnoreCase) == true;
    }

    private static JsonElement NormalizeElement(JsonElement element)
    {
        return element.ValueKind switch
        {
            JsonValueKind.Object => NormalizeObject(element),
            JsonValueKind.Array => NormalizeArray(element),
            _ => element.Clone()
        };
    }

    private static JsonElement NormalizeObject(JsonElement element)
    {
        var normalized = new Dictionary<string, JsonElement>(StringComparer.Ordinal);

        foreach (var property in element.EnumerateObject())
        {
            var key = ToSnakeCase(property.Name);
            normalized[key] = NormalizeElement(property.Value);
        }

        return JsonSerializer.SerializeToElement(normalized);
    }

    private static JsonElement NormalizeArray(JsonElement element)
    {
        var items = element.EnumerateArray()
            .Select(NormalizeElement)
            .ToArray();

        return JsonSerializer.SerializeToElement(items);
    }

    private static string ToSnakeCase(string name)
    {
        if (string.IsNullOrEmpty(name))
            return name;

        var builder = new StringBuilder(name.Length + 4);

        for (var i = 0; i < name.Length; i++)
        {
            var current = name[i];
            if (char.IsUpper(current))
            {
                if (i > 0)
                    builder.Append('_');

                builder.Append(char.ToLowerInvariant(current));
            }
            else
            {
                builder.Append(current);
            }
        }

        return builder.ToString();
    }
}
