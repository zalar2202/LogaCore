const net = require('net');

const host = 'localhost';
const port = 5432;
const timeout = 10000; // 10 seconds

const checkConnection = () => {
    const client = new net.Socket();

    console.log(`Checking database health at ${host}:${port}...`);

    client.setTimeout(2000);

    client.connect(port, host, () => {
        console.log('✅ Database is reachable!');
        client.destroy();
        process.exit(0);
    });

    client.on('error', (err) => {
        console.error(`❌ Connection failed: ${err.message}`);
        client.destroy();
        process.exit(1);
    });

    client.on('timeout', () => {
        console.error('❌ Connection timed out');
        client.destroy();
        process.exit(1);
    });
};

checkConnection();
