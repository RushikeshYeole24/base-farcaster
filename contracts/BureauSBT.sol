// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BureauSBT
 * @dev ERC-5192 Soulbound Token for Bureau of Magical Things game
 * Non-transferable tokens representing mission completions
 */
contract BureauSBT is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    
    struct MissionRecord {
        string missionType; // containment, investigation, interception
        string outcome; // clean, partial, failed
        int8 alignmentChange;
        uint8 energyUsed;
        string incidentId;
        uint256 timestamp;
        uint8 energySnapshot;
        uint8 controlSnapshot;
        int8 alignmentSnapshot;
    }
    
    mapping(uint256 => MissionRecord) public missionRecords;
    mapping(uint256 => bool) public locked; // ERC-5192: all tokens are locked (non-transferable)
    
    event Locked(uint256 tokenId);
    event Unlocked(uint256 tokenId);
    
    constructor() ERC721("Bureau Mission Record", "BMR") Ownable(msg.sender) {}
    
    /**
     * @dev Mint a new SBT for a completed mission
     */
    function mintMissionRecord(
        address player,
        string memory missionType,
        string memory outcome,
        int8 alignmentChange,
        uint8 energyUsed,
        string memory incidentId,
        uint8 energySnapshot,
        uint8 controlSnapshot,
        int8 alignmentSnapshot
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter++;
        
        _safeMint(player, tokenId);
        
        missionRecords[tokenId] = MissionRecord({
            missionType: missionType,
            outcome: outcome,
            alignmentChange: alignmentChange,
            energyUsed: energyUsed,
            incidentId: incidentId,
            timestamp: block.timestamp,
            energySnapshot: energySnapshot,
            controlSnapshot: controlSnapshot,
            alignmentSnapshot: alignmentSnapshot
        });
        
        locked[tokenId] = true;
        emit Locked(tokenId);
        
        return tokenId;
    }
    
    /**
     * @dev ERC-5192: Check if token is locked (always true for SBTs)
     */
    function locked(uint256 tokenId) external view returns (bool) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return true;
    }
    
    /**
     * @dev Get mission record details
     */
    function getMissionRecord(uint256 tokenId) external view returns (MissionRecord memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return missionRecords[tokenId];
    }
    
    /**
     * @dev Get all token IDs owned by an address
     */
    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokens = new uint256[](balance);
        uint256 index = 0;
        
        for (uint256 i = 0; i < _tokenIdCounter; i++) {
            if (_ownerOf(i) == owner) {
                tokens[index] = i;
                index++;
            }
        }
        
        return tokens;
    }
    
    /**
     * @dev Override transfer functions to make tokens non-transferable
     */
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from == address(0)) but block transfers
        if (from != address(0) && to != address(0)) {
            revert("SBT: Token is non-transferable");
        }
        
        return super._update(to, tokenId, auth);
    }
}
