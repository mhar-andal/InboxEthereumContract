const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { interface, bytecode } = require('../compile');

const provider = ganache.provider();
const web3 = new Web3(provider);

let accounts;
let inbox;

beforeEach(async () => {
  // get a list of all accounts
  accounts = await web3.eth.getAccounts();
  // use one account to deploy the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface)) // teaches web3 about what methods an Inbox contract has
    .deploy({ data: bytecode, arguments: ['Hi there!'] }) // Tells web3 that we want to deploy a new copy of this contract | arguments hits contract constructor
    .send({ from: accounts[0], gas: '1000000' }); // Instructs web3 to send out a transaction that creates this contract

  inbox.setProvider(provider);
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });

  it('has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, 'Hi there!');
  });

  it('can change the message', async () => {
    await inbox.methods.setMessage('bye').send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, 'bye');
  });
});
