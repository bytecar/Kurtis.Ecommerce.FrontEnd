# Enhanced Logging System

This project includes a comprehensive logging system for API requests, responses, authentication events, and errors.

## Features

- 🎨 **Color-coded console output** for better readability
- 🔍 **Detailed request/response logging** with headers, body, and query parameters
- 🔐 **Sensitive data sanitization** (passwords, tokens, credit cards)
- ⚡ **Performance monitoring** with slow request detection
- 🎫 **Request ID tracking** for correlation across logs
- 📊 **Configurable verbosity levels** (minimal, moderate, detailed)
- 🔒 **Authentication event logging** for security monitoring
- 🐛 **Enhanced error logging** with stack traces and context

## Configuration

### Environment Variables

Control logging behavior with these environment variables:

```bash
# Log verbosity: minimal, moderate, or detailed
LOG_VERBOSITY=detailed

# Disable request body logging
LOG_BODIES=false

# Disable header logging
LOG_HEADERS=false

# Slow request threshold in milliseconds
SLOW_REQUEST_THRESHOLD=1000
```

### Verbosity Levels

#### `minimal`
- Only errors and critical information
- No request/response bodies
- No headers
- Production default

#### `moderate`
- Errors, warnings, and basic request info
- Request method, path, status, duration
- Query parameters
- Production-safe

#### `detailed` (Default in Development)
- Everything including request/response bodies
- Full headers (sanitized)
- Stack traces
- Request context on errors

## Usage

### Basic Request/Response Logging

The request logger middleware is automatically applied to all routes:

```typescript
// Automatically logs:
// → 10:30:45.123 [abc123] GET     /api/products
//   Query: { category: "kurtis", page: "1" }
//   Body: { ... }
// ← 10:30:45.234 [abc123] 200 111ms
//   Response: { data: [...] }
```

### Authentication Logging

Use the auth logger for authentication events:

```typescript
import { authLogger } from './lib/auth-logger';

// Login attempt
authLogger.loginAttempt({
  username: 'user@example.com',
  ipAddress: req.ip,
});

// Login success
authLogger.loginSuccess({
  userId: user.id,
  username: user.username,
  ipAddress: req.ip,
});

// Login failure
authLogger.loginFailure({
  username: 'user@example.com',
  ipAddress: req.ip,
  reason: 'Invalid password',
});

// Token operations
authLogger.tokenGenerated({ userId: user.id });
authLogger.tokenValidated({ userId: user.id });
authLogger.tokenExpired({ userId: user.id });

// Permission checks
authLogger.permissionDenied({
  userId: user.id,
  resource: '/api/admin/users',
  action: 'DELETE',
});
```

### Manual Logging

Use the `log` function for custom logging:

```typescript
import { log } from './lib/request-logger';

// Info level (default)
log('Server started successfully', 'info', 'server');

// Debug level
log('Cache hit for product 123', 'debug', 'cache');

// Warning level
log('Rate limit approaching for user 456', 'warn', 'rate-limiter');

// Error level
log('Database connection failed', 'error', 'database');
```

## Log Format

### Request Log
```
→ 10:30:45.123 [abc123] GET     /api/products?category=kurtis
  Query: { "category": "kurtis", "page": "1" }
  Headers: { "content-type": "application/json", ... }
  Body: { "filter": { "price": { "max": 5000 } } }
```

### Response Log
```
← 10:30:45.234 [abc123] 200 111ms
  Response: { "data": [...], "total": 42 }
```

### Error Log
```
✖ 10:30:45.456 [abc123] ERROR
  Message: Cannot read property 'id' of undefined
  Path: GET /api/products/undefined
  Status: 500
  Stack:
    at ProductController.getById (product.controller.ts:45)
    at Router.handle (express/lib/router/index.js:281)
  Request Context:
    Method: GET
    Path: /api/products/undefined
    Query: {}
```

### Authentication Log
```
✅ 10:30:45.678 [auth] Login Success - User ID: 123 - IP: 192.168.1.1
🚫 10:30:46.789 [auth] Permission Denied - User ID: 456 - IP: 192.168.1.2
```

## Sensitive Data Sanitization

The following data is automatically sanitized in logs:

### Field Names
- `password`
- `token`, `accessToken`, `refreshToken`
- `authorization`
- `cookie`
- `secret`, `apiKey`, `api_key`
- `creditCard`, `cvv`, `ssn`

### Patterns
- Credit card numbers (e.g., `4111-1111-1111-1111` → `***REDACTED***`)
- Email addresses (optional, configurable)

Example:
```typescript
// Request body:
{ username: "user@example.com", password: "secret123" }

// Logged as:
{ username: "user@example.com", password: "***REDACTED***" }
```

## Performance Impact

- **Minimal verbosity**: ~1-2ms overhead per request
- **Moderate verbosity**: ~2-5ms overhead per request
- **Detailed verbosity**: ~5-10ms overhead per request

Slow requests (exceeding threshold) are highlighted:
```
← 10:30:45.234 [abc123] 200 1234ms
  ⚠ SLOW REQUEST
```

## Request ID Tracking

Each request gets a unique ID for correlation:

```
→ 10:30:45.123 [abc123] GET /api/products
← 10:30:45.234 [abc123] 200 111ms
```

Access the request ID in your code:
```typescript
const requestId = (req as any).requestId;
```

## Best Practices

1. **Use appropriate log levels**
   - `debug`: Detailed debugging information
   - `info`: General informational messages
   - `warn`: Warning messages for potentially harmful situations
   - `error`: Error messages for failures

2. **Use auth logger for security events**
   - Always log login attempts (success and failure)
   - Log permission denials
   - Log token operations

3. **Configure for environment**
   - Use `detailed` in development
   - Use `moderate` or `minimal` in production
   - Disable body logging in production if handling sensitive data

4. **Monitor slow requests**
   - Adjust `SLOW_REQUEST_THRESHOLD` based on your requirements
   - Investigate requests that consistently exceed the threshold

## Troubleshooting

### Logs are too verbose
Set `LOG_VERBOSITY=moderate` or `LOG_VERBOSITY=minimal`

### Sensitive data appearing in logs
Add field names to `sensitiveFields` in `logger-config.ts`

### Performance issues
- Disable body logging: `LOG_BODIES=false`
- Disable header logging: `LOG_HEADERS=false`
- Use `LOG_VERBOSITY=minimal`

### Colors not showing
Ensure your terminal supports ANSI color codes. Colors are automatically disabled in production.
