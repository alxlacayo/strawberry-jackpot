const config = {
    development: {
        // address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        // chainId: 31337,
        // networkId: "http://localhost:8545"
        address: "0xdd52510528c2BC06CeB9551FEcca0E87b3E54c30",
        chainId: 4,
        networkId: 4
    },
    test: {
        address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        chainId: 31337,
        networkId:  "http://localhost:8545"
    },
    production: {
        address: "0x9153cC02Cb1A6061e972110aD36De6B0FB79bbf2",
        chainId: 4,
        networkId: 4
    },
    abi: [
        "function MAX_SUPPLY() external view returns (uint256)",
        "function mintPrice() external view returns (uint256)",
        "function totalMinted() external view returns (uint256)",
        "function freeMintsAvailable() external view returns (uint256)",
        "function mint(uint256 amount) external payable",
        "function freeMint() external",
        "event Mint(uint256 remainingSupply)",
        "event FreeMint(uint256 totalMinted, uint256 freeMintsAvailable)"
    ]
}

const contractConfig = {
    ...config[process.env.NODE_ENV],
    abi: config.abi
};

export default contractConfig;
