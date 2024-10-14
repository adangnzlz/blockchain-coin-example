App = {
    web3Provider: null,
    contracts: {},
    names: new Array(),
    minter: null,
    currentAccount: null,
    transaction: 0,
    flag: false,

    init: function () {
        return App.initWeb3()
    },

    initWeb3: async function () {
        // Detecta si MetaMask está disponible
        if (typeof window.ethereum !== 'undefined') {
            App.web3Provider = window.ethereum
            try {
                // Solicitar acceso a las cuentas
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                })
                App.currentAccount = accounts[0]
                console.log('Connected account:', App.currentAccount)
                $('#current_account').text(
                    'Current user account: ' + App.currentAccount
                )
                $('#curr_account').text(App.currentAccount)

                // Llenar los combos de direcciones
                App.populateAddress(accounts)
            } catch (error) {
                console.error('User denied account access', error)
            }
        } else {
            alert('Please install MetaMask!')
        }

        web3 = new Web3(App.web3Provider)
        return App.initContract()
    },

    initContract: function () {
        $.getJSON('Coin.json', function (data) {
            var voteArtifact = data
            App.contracts.vote = new web3.eth.Contract(
                voteArtifact.abi,
                '0xA22f36726c309C02518c6e4AA2A670719cB2300E'
            ) // Cambia por la dirección de tu contrato desplegado

            App.getMinter()
            return App.bindEvents()
        })
    },

    bindEvents: function () {
        $(document).on('click', '#create_money', function () {
            App.handleMint(
                $('#enter_create_address').val(),
                $('#create_amount').val()
            )
        })
        $(document).on('click', '#send_money', function () {
            App.handleTransfer(
                $('#enter_send_address').val(),
                $('#send_amount').val()
            )
        })
        $(document).on('click', '#balance', function () {
            App.handleBalance()
        })
    },

    populateAddress: function (accounts) {
        var createAddressSelect = $('#enter_create_address')
        var sendAddressSelect = $('#enter_send_address')

        // Limpiar los selectores antes de llenarlos
        createAddressSelect.empty()
        sendAddressSelect.empty()

        // Agregar cuentas a los selectores
        accounts.forEach(function (account) {
            var optionElement = `<option value="${account}">${account}</option>`
            createAddressSelect.append(optionElement)
            if (App.currentAccount !== account) {
                sendAddressSelect.append(optionElement)
            }
        })

        console.log('Create Address Options:', createAddressSelect.html())
        console.log('Send Address Options:', sendAddressSelect.html())
    },

    getMinter: function () {
        App.contracts.vote.methods
            .minter()
            .call()
            .then(function (result) {
                App.minter = result.toLowerCase() // Convertimos la dirección del minter a minúsculas
                $('#minter').text('Minter : ' + result)

                // Convertimos currentAccount a minúsculas también para compararlas
                if (App.minter !== App.currentAccount.toLowerCase()) {
                    $('#create_coin').css('display', 'none')
                    $('#send_coin').css('width', '50%')
                    $('#balance_coin').css('width', '50%')
                } else {
                    $('#create_coin').css('display', 'block')
                    $('#send_coin').css('width', '30%')
                    $('#balance_coin').css('width', '30%')
                }
            })
    },

    handleMint: function (addr, value) {
        if (App.currentAccount != App.minter) {
            alert('Not Authorized to create coins')
            return false
        }

        App.contracts.vote.methods
            .mint(addr, value)
            .send({from: App.currentAccount})
            .then(function (result) {
                if (result.status) {
                    alert(value + ' coins minted to ' + addr)
                } else {
                    alert('Creation failed')
                }
            })
            .catch(function (err) {
                console.log('Minting error:', err.message)
            })
    },

    handleTransfer: function (addr, value) {
        if (addr == '') {
            alert('Please select an address')
            return false
        }
        if (value == '') {
            alert('Please enter valid amount')
            return false
        }

        App.contracts.vote.methods
            .transfer(addr, value)
            .send({from: App.currentAccount})
            .then(function (result) {
                if (result.status) {
                    alert(value + ' coins transferred to ' + addr)
                } else {
                    alert('Transfer failed')
                }
            })
            .catch(function (err) {
                console.log('Transfer error:', err.message)
            })
    },

    handleBalance: function () {
        App.contracts.vote.methods
            .balances(App.currentAccount)
            .call()
            .then(function (result) {
                $('#display_balance').val(result)
            })
    },
}

$(function () {
    $(window).load(function () {
        App.init()
        console.log('starting app.js')
    })
})
