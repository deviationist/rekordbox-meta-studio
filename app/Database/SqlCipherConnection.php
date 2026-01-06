<?php declare(strict_types=1);

namespace App\Database;

use Illuminate\Database\SQLiteConnection;
use PDO;

class SqlCipherConnection extends SQLiteConnection
{
    protected $sqlCipherConfigured = false;

    public function __construct($pdo, $database = '', $tablePrefix = '', array $config = [])
    {
        if (isset($config['pragma']['key']) && $pdo instanceof PDO) {
            $this->configureSqlCipher($pdo, $config);
        }

        parent::__construct($pdo, $database, $tablePrefix, $config);
    }

    public function getPdo()
    {
        $pdo = parent::getPdo();

        if (!$this->sqlCipherConfigured && isset($this->config['pragma']['key'])) {
            $this->configureSqlCipher($pdo, $this->config);
        }

        return $pdo;
    }

    protected function configureSqlCipher($pdo, $config)
    {
        $key = $config['pragma']['key'];
        $pdo->exec('PRAGMA key = "' . $key . '"');

        // Set cipher compatibility if specified
        if (isset($config['pragma']['cipher_compatibility'])) {
            $compatibility = $config['pragma']['cipher_compatibility'];
            $pdo->exec("PRAGMA cipher_compatibility = {$compatibility}");
        }

        $this->sqlCipherConfigured = true;
    }
}
