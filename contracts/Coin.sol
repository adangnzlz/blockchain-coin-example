// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Coin {
    // Dirección del emisor (minter) que puede crear nuevos tokens
    address public minter;

    // Mapa que rastrea los balances de cada dirección
    mapping(address => uint) public balances;

    // Eventos que se emiten cuando se transfieren o queman tokens
    event Sent(address from, address to, uint amount);
    event Burned(address from, uint amount);

    // Constructor que se ejecuta una vez al desplegar el contrato
    constructor() {
        minter = msg.sender; // El emisor será la cuenta que despliega el contrato
    }

    // Función para emitir (mint) tokens a una cuenta específica
    function mint(address receiver, uint amount) public {
        require(msg.sender == minter, "Only minter can mint tokens");
        balances[receiver] += amount;
    }

    // Función para transferir tokens a otra cuenta
    function transfer(address receiver, uint amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit Sent(msg.sender, receiver, amount); // Emitir evento de transferencia
    }

    // Función para quemar tokens, reduciendo el saldo del remitente
    function burn(uint amount) public {
        require(amount > 0, "Amount to burn must be greater than zero");
        require(balances[msg.sender] >= amount, "Insufficient balance to burn tokens");
        
        balances[msg.sender] -= amount;
        emit Burned(msg.sender, amount); // Emitir evento de quema
    }
}
