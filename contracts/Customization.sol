// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Customization {


    struct Assets{
    address ca0;
    address ca1;
    uint tokenId0;
    uint tokenId1;
    }

    mapping(address => Assets) public userAssets;

    function setAssets(address _ca0, uint _tokenId0, address _ca1,  uint _tokenId1) external{
        if(_ca0 == address(0)){
            userAssets[msg.sender].ca0 = address(0);
        }
        else{
            require(IERC721(_ca0).ownerOf(_tokenId0) == msg.sender, "You are not owner of NFTs");
            userAssets[msg.sender].ca0 = _ca0;
            userAssets[msg.sender].tokenId0 = _tokenId0;

        }

        if(_ca1 == address(0)){
            userAssets[msg.sender].ca1 = address(0);
        }

        else{
            require(IERC721(_ca1).ownerOf(_tokenId1) == msg.sender, "You are not owner of NFTs");
            userAssets[msg.sender].ca1 = _ca1;
            userAssets[msg.sender].tokenId1 = _tokenId1;

        }

    }

}
