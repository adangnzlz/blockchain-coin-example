// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Migrations {
    address public owner;
    uint public last_completed_migration;

    // Modificador para restringir funciones solo al owner
    modifier restricted() {
        require(msg.sender == owner, "Esta func es solo para el owner.");
        _;
    }

    // Constructor para definir el owner
    constructor() {
        owner = msg.sender;
    }

    // Función para establecer la última migración completada
    function setCompleted(uint completed) public restricted {
        last_completed_migration = completed;
    }

    // Función para actualizar el contrato de migración
    function upgrade(address new_address) public restricted {
        Migrations upgraded = Migrations(new_address);
        upgraded.setCompleted(last_completed_migration);
    }
}
