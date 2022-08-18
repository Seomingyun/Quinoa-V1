//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";


contract Qui is ERC20, Ownable, ERC20Burnable {

    address public treasury;
    bytes32 private _merkleRoot;
    uint256 private _taxPercent;
    uint256 private _airdropPhase;
    uint256 private _mintPhase;

    mapping(uint256 => mapping(address => bool)) private _WhilelistClaimedByPhase;
    
    event TreasuryAddressUpdated(address newTreasury);
    event MerkleRootUpdated(bytes32 merkleRoot);
    event TaxUpdated(uint256 taxAmount);
    event MintPhaseUpdated(uint256 phase, uint256 mintedAmount); 

    constructor(uint256 _taxPercent_, bytes32 _merkleRoot_) ERC20("Quinoa Token", "QUI") {
        _airdropPhase = 1;
        _mintPhase = 0;
        _taxPercent = _taxPercent_;
        _merkleRoot = _merkleRoot_;
        
    }

     /**
    merkle leaf consists :
    address, token amount, isClaimed(0 or 1)
    when client claims, verify proof and send it as airdrop function arguments
    **/
    function updateMintPhase(uint256 amount) public onlyOwner {
        _mintPhase += 1;
        _mint(address(this), amount);
        _approve(address(this), owner(), this.balanceOf(address(this)));
        emit MintPhaseUpdated(_mintPhase, amount);
    }

    function getAirdropPhase() external view returns(uint256) {
        return _airdropPhase;
    }

    function airDrop(
        bytes32[] calldata _merkleProof, 
        address claimer, 
        uint256 amount)public {

        bytes32 leaf = keccak256(abi.encodePacked(claimer, amount ));
        require(MerkleProof.verify(_merkleProof, _merkleRoot, leaf), "Qui: Invalid Merkle Proof!");
        require(!_WhilelistClaimedByPhase[_airdropPhase][msg.sender], "Address already claimed!");

        _WhilelistClaimedByPhase[_airdropPhase][msg.sender] = true;
        _mint(claimer, amount);
    }

    /* update whitelist in new phase */
    function updateMerkleRoot(bytes32 newRoot) internal {
        _airdropPhase +=1;
        _merkleRoot = newRoot;
        emit MerkleRootUpdated(_merkleRoot);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    function changeOwner(address newOwner) public onlyOwner {
        _approve(address(this), owner(), 0);
        _transferOwnership(newOwner);
        _approve(address(this), newOwner, this.balanceOf(address(this)));
    }

    function setTreasuryAddress(address _treasury) external onlyOwner{
        require(_treasury != address(0), "Qui: TreasuryAddress is Zero address");
        treasury = _treasury;
        emit TreasuryAddressUpdated(_treasury);
    }

    function setTax(uint256 newTaxPercent) external onlyOwner{
        _taxPercent = newTaxPercent;
        emit TaxUpdated(_taxPercent);
    }

    function transfer( 
        address sender,
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
        if (sender == treasury || recipient == treasury || sender == address(this))
            super._transfer(sender, recipient, amount);
        else{
            uint256 taxAmount= (amount*_taxPercent)/100;
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

    function getTaxPercent()public view returns(uint256) {
        return _taxPercent;
    }

}