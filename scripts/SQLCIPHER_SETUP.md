# SQLCipher Setup Guide for macOS

This guide explains how to set up SQLCipher support for PHP on macOS (Apple Silicon).

## Prerequisites

- macOS with Apple Silicon (M1/M2/M3/M4)
- Homebrew installed
- PHP 8.5+ installed via Homebrew
- Xcode Command Line Tools installed

## Overview

This project requires SQLCipher to work with encrypted Rekordbox database files. Since PHP's built-in SQLite doesn't support encryption, we need to replace Homebrew's SQLite library with SQLCipher.

## Step 1: Install SQLCipher

```bash
brew install sqlcipher pkg-config
```

Verify installation:
```bash
sqlcipher --version
# Should show: 3.46.1 2024-08-13 ... (SQLCipher 4.6.1 community)
```

## Step 2: Check Current Setup

Check what PHP is using:
```bash
# Check PHP's SQLite library
otool -L $(which php) | grep sqlite
# Should show: /opt/homebrew/opt/sqlite/lib/libsqlite3.dylib

# Check current SQLite version in PHP
php --ri pdo_sqlite
# Should show: SQLite Library => 3.51.1 (or similar)
```

## Step 3: Create SQLCipher Symlink

The simplest approach is to replace Homebrew's SQLite library with a symlink to SQLCipher:

```bash
# Backup the original SQLite library
sudo cp /opt/homebrew/opt/sqlite/lib/libsqlite3.dylib \
       /opt/homebrew/opt/sqlite/lib/libsqlite3.dylib.backup

# Remove the original and create symlink to SQLCipher
sudo rm /opt/homebrew/opt/sqlite/lib/libsqlite3.dylib
sudo ln -s /opt/homebrew/opt/sqlcipher/lib/libsqlcipher.0.dylib \
           /opt/homebrew/opt/sqlite/lib/libsqlite3.dylib
```

Verify the symlink:
```bash
ls -la /opt/homebrew/opt/sqlite/lib/libsqlite3.dylib
# Should show symlink pointing to sqlcipher
```

## Step 4: Test SQLCipher

Create a test script:
```bash
cat > /tmp/test_sqlcipher.php << 'PHPEOF'
<?php
try {
    @unlink('/tmp/test_cipher.db');
    
    $db = new PDO('sqlite:/tmp/test_cipher.db');
    
    // Set encryption key - only works with SQLCipher
    $db->exec("PRAGMA key = 'test123'");
    
    // Create and query
    $db->exec("CREATE TABLE test (id INTEGER PRIMARY KEY, value TEXT)");
    $db->exec("INSERT INTO test (value) VALUES ('encrypted data')");
    
    $result = $db->query("SELECT * FROM test")->fetchAll();
    
    echo "✓ SQLCipher is working!\n";
    print_r($result);
    
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}
PHPEOF

php /tmp/test_sqlcipher.php
```

If you see "✓ SQLCipher is working!", the setup is complete!

## Step 5: Project Setup (Optional)

This project includes composer scripts to manage the SQLCipher symlink:

```bash
# Link SQLCipher (same as manual step above)
composer sqlcipher:link

# Check current status
composer sqlcipher:check

# Unlink and restore original SQLite
composer sqlcipher:unlink
```

## Troubleshooting

### Issue: "file is not a database" error

This means PHP is still using standard SQLite. Verify:

1. Check if symlink exists:
   ```bash
   ls -la /opt/homebrew/opt/sqlite/lib/libsqlite3.dylib
   ```

2. Verify PHP is loading it:
   ```bash
   otool -L $(which php) | grep sqlite
   ```

3. Restart your terminal/PHP-FPM after creating the symlink

### Issue: Symlink disappears after `brew upgrade`

When you upgrade the `sqlite` package, Homebrew may replace the symlink with the original library. Simply run the symlink command again:

```bash
composer sqlcipher:link
# or manually:
sudo rm /opt/homebrew/opt/sqlite/lib/libsqlite3.dylib
sudo ln -s /opt/homebrew/opt/sqlcipher/lib/libsqlcipher.0.dylib \
           /opt/homebrew/opt/sqlite/lib/libsqlite3.dylib
```

### Issue: System Integrity Protection (SIP) blocking changes

If you get permission errors even with sudo, check SIP status:
```bash
csrutil status
```

If SIP is enabled and blocking changes to `/usr/lib`, that's fine - we're modifying `/opt/homebrew` which is not protected.

### Issue: "Module pdo_sqlite is already loaded" warning

This is harmless and can be ignored. It occurs because PHP has pdo_sqlite compiled in, but our symlink approach doesn't require loading an additional extension.

## Alternative Approach: DYLD_INSERT_LIBRARIES (Not Recommended)

On older macOS versions or Intel Macs, you might try using `DYLD_INSERT_LIBRARIES`:

```bash
DYLD_INSERT_LIBRARIES=/opt/homebrew/opt/sqlcipher/lib/libsqlcipher.0.dylib php script.php
```

However, this doesn't work reliably on Apple Silicon with SIP enabled, which is why the symlink approach is preferred.

## Why This Works

PHP links against `/opt/homebrew/opt/sqlite/lib/libsqlite3.dylib` at compile time. By replacing this file with a symlink to SQLCipher (which is binary-compatible with SQLite), PHP transparently uses SQLCipher instead.

SQLCipher is a drop-in replacement for SQLite - it has the same API but adds encryption support via `PRAGMA key`.

## Notes

- SQLCipher and SQLite share the same compatibility version (9.0.0), making them binary-compatible
- The symlink approach affects all PHP SQLite operations system-wide
- If you need standard SQLite for other projects, use `composer sqlcipher:unlink` to restore it
- This setup persists across reboots but not across `brew upgrade sqlite`
