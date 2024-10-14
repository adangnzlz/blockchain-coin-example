module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    networks: {
        development: {
            host: 'localhost',
            port: 7545,
            network_id: '*', // Match any network id
        },
    },
    compilers: {
        solc: {
            version: '0.8.0', // Asegúrate de usar una versión de Solidity 0.8.x
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200,
                },
            },
        },
    },
}
