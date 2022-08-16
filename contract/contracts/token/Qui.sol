//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Qui is ERC20, Ownable, ERC20Burnable {

    address public treasury;
    bytes32 public merkleRoot;
    uint32 public airdropPhase;
    uint256 public tax;
    
    event TreasuryAddressUpdated(address newTreasury);
    event MerkleRootUpdated();
    event TaxUpdated(uint256 taxAmount);

    constructor(uint256 _tax, bytes32 _merkleRoot) ERC20("Quinoa Token", "QUI") {
        tax = _tax;
        merkleRoot = _merkleRoot;
        airdropPhase = 0;
        _mint(msg.sender, 100);
        
    }

     /**
    merkle leaf consists :
    address, airdrop phase(int), token amount, isClaimed(0 or 1)
    when client claims, make new leaf with isClaimed value = 1, 
    then calculate new merkleRoot and send it as airdrop function arguments
    **/
    function airDrop(
        bytes32 _newMerkleRoot,
        bytes32[] calldata _merkleProof, 
        address claiming, 
        uint256 amount)public {

        uint8 isClaimed = 0;
        bytes32 leaf = keccak256(abi.encodePacked(claiming, airdropPhase, amount, isClaimed ));
        require(MerkleProof.verify(_merkleProof, merkleRoot, leaf), "Qui: Invalid Merkle Proof!");
        
        updateMerkleRoot(_newMerkleRoot);
        _mint(claiming, amount);
    }

    function updateAirdropPhase(bytes32 newRoot, uint32 newAirdropPhase) public onlyOwner {
        airdropPhase = newAirdropPhase;
        merkleRoot = newRoot;
    }

    function updateMerkleRoot(bytes32 newRoot) internal {
        merkleRoot = newRoot;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    function changeOwner(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }

    function setTreasuryAddress(address _treasury) external onlyOwner{
        require(_treasury != address(0), "Qui: TreasuryAddress is Zero address");
        treasury = _treasury;
        emit TreasuryAddressUpdated(_treasury);
    }

    function setTax(uint256 _tax) external onlyOwner{
        tax = _tax;
        emit TaxUpdated(tax);
    }

    function transfer( address sender,
        address recipient,
        uint256 amount
    ) external{
        _transfer(sender, recipient, amount);
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual override{   
        if (sender == treasury || recipient == treasury)
            super._transfer(sender, recipient, amount);
        else{
            uint256 taxAmount= (amount*tax)/1000;
            // treasury 에 tax 보내기
            super._transfer(sender,treasury,taxAmount);
            // tax를 제외한 amount 만큼 보내기 
            super._transfer(sender,recipient,(amount - taxAmount));
        } 
    }
    
    function burnQui(address owner, address spender, uint256 amount) external{
        _spendAllowance(owner, spender, amount);
        _burn(owner, amount);
    }

    function getBalance(address addr) public view returns(uint256) {
        return this.balanceOf(addr);
    }

}