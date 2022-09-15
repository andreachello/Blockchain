// SPDX-License-Identifier: MIT
// An example of a consumer contract that relies on a subscription for funding.
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract CountSVG is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    
    uint256 count = 0;
    
    constructor() ERC721("Counting SVG", "cSVG") {
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        updateURI();
    }

    function updateURI() internal {
        string memory finalSVG = buildSVG();
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Counting SVG",',
                        '"description": "An Automated Counting SVG",',
                        '"image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(finalSVG)),
                        '"}'
                    )
                )
            )
        );
        string memory finalTokenURI = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
        _setTokenURI(0, finalTokenURI);
    }

    function buildSVG() internal view returns (string memory) {
        string
            memory headSVG = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' width='500' height='500' preserveAspectRatio='none' viewBox='0 0 500 500'> <g clip-path='url(&quot;#SvgjsClipPath1094&quot;)' fill='none'> <rect width='500' height='500' x='0' y='0' fill='#32325d'></rect> <circle r='23.56' cx='117.85' cy='66.24' fill='url(#SvgjsLinearGradient1095)'></circle> <circle r='23.145' cx='233.4' cy='16.22' fill='url(#SvgjsLinearGradient1096)'></circle> <circle r='16.155' cx='57.91' cy='279.29' fill='url(#SvgjsLinearGradient1097)'></circle> <circle r='29.12' cx='175.64' cy='2.15' fill='url(#SvgjsLinearGradient1098)'></circle> <circle r='33.07' cx='423.83' cy='387.89' fill='url(#SvgjsLinearGradient1099)'></circle> <circle r='33.35' cx='296.87' cy='307.98' fill='url(#SvgjsLinearGradient1100)'></circle> <circle r='31.39' cx='273.7' cy='61.31' fill='url(#SvgjsLinearGradient1101)'></circle> <circle r='48.695' cx='108.9' cy='421.22' fill='url(#SvgjsLinearGradient1102)'></circle> </g> <defs> <clipPath id='SvgjsClipPath1094'> <rect width='500' height='500' x='0' y='0'></rect> </clipPath> <linearGradient x1='70.72999999999999' y1='66.24' x2='164.96999999999997' y2='66.24' gradientUnits='userSpaceOnUse' id='SvgjsLinearGradient1095'> <stop stop-color='#e298de' offset='0.1'></stop> <stop stop-color='#484687' offset='0.9'></stop> </linearGradient> <linearGradient x1='187.11' y1='16.22' x2='279.69' y2='16.22' gradientUnits='userSpaceOnUse' id='SvgjsLinearGradient1096'> <stop stop-color='#32325d' offset='0.1'></stop> <stop stop-color='#424488' offset='0.9'></stop> </linearGradient> <linearGradient x1='25.599999999999994' y1='279.29' x2='90.22' y2='279.29' gradientUnits='userSpaceOnUse' id='SvgjsLinearGradient1097'> <stop stop-color='#32325d' offset='0.1'></stop> <stop stop-color='#424488' offset='0.9'></stop> </linearGradient> <linearGradient x1='117.39999999999998' y1='2.1499999999999986' x2='233.88' y2='2.1499999999999986' gradientUnits='userSpaceOnUse' id='SvgjsLinearGradient1098'> <stop stop-color='#e298de' offset='0.1'></stop> <stop stop-color='#484687' offset='0.9'></stop> </linearGradient> <linearGradient x1='357.69' y1='387.89' x2='489.97' y2='387.89' gradientUnits='userSpaceOnUse' id='SvgjsLinearGradient1099'> <stop stop-color='#32325d' offset='0.1'></stop> <stop stop-color='#424488' offset='0.9'></stop> </linearGradient> <linearGradient x1='230.17000000000002' y1='307.98' x2='363.57000000000005' y2='307.98' gradientUnits='userSpaceOnUse' id='SvgjsLinearGradient1100'> <stop stop-color='#84b6e0' offset='0.1'></stop> <stop stop-color='#464a8f' offset='0.9'></stop> </linearGradient> <linearGradient x1='210.92' y1='61.31' x2='336.48' y2='61.31' gradientUnits='userSpaceOnUse' id='SvgjsLinearGradient1101'> <stop stop-color='#32325d' offset='0.1'></stop> <stop stop-color='#424488' offset='0.9'></stop> </linearGradient> <linearGradient x1='11.510000000000005' y1='421.22' x2='206.29000000000002' y2='421.22' gradientUnits='userSpaceOnUse' id='SvgjsLinearGradient1102'> <stop stop-color='#84b6e0' offset='0.1'></stop> <stop stop-color='#464a8f' offset='0.9'></stop> </linearGradient> </defs>";

        // tail is separated so we can update the body
        string memory tailSVG = "</svg>";
        // update the body 
        string memory bodySVG = string(
            abi.encodePacked(
                "<text x='50%' y='50%' fill='white' font-size='128' dominant-baseline='middle' text-anchor='middle'>",
                Strings.toString(count),
                "</text>"
            )
        );
        string memory _finalSVG = string(
            abi.encodePacked(headSVG, bodySVG, tailSVG)
        );
        return _finalSVG;
    }

    function addToCount() public {
        count = count + 1;
        updateURI();
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
