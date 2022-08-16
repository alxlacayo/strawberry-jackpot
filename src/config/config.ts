import addresses from "./addresses.json";
import strawberryInterface from "./strawberryInterface.json";
import strawberryJackpotInterface from "./strawberryJackpotInterface.json";

const DEVELOPMENT_CHAIN_NAME = "mumbai";

const config = {
    development: {
        chainName: DEVELOPMENT_CHAIN_NAME,
        contracts: {
            strawberry: {
                address: addresses[DEVELOPMENT_CHAIN_NAME].strawberryAddress,
                interface: strawberryInterface
            },
            strawberryJackpot: {
                address: addresses[DEVELOPMENT_CHAIN_NAME].strawberryJackpotAddress,
                interface: strawberryJackpotInterface
            }
        }
    },
    test: {
        chainName: DEVELOPMENT_CHAIN_NAME,
        contracts: {
            strawberry: {
                address: addresses.localhost.strawberryAddress,
                interface: strawberryInterface
            },
            strawberryJackpot: {
                address: addresses.localhost.strawberryJackpotAddress,
                interface: strawberryJackpotInterface
            }
        },
    },
    production: {
        chainName: DEVELOPMENT_CHAIN_NAME,
        contracts: {
            strawberry: {
                address: addresses.localhost.strawberryAddress,
                interface: strawberryInterface
            },
            strawberryJackpot: {
                address: addresses.localhost.strawberryJackpotAddress,
                interface: strawberryJackpotInterface
            }
        },
    }
};

export default config[process.env.NODE_ENV];
