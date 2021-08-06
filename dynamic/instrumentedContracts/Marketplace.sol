pragma solidity >0.7.0 <0.8.0;

contract Marketplace {
function c_0x8974721b(bytes32 c__0x8974721b) public pure {}

    address public seller;
    address public buyer;
    mapping (address => uint) public balances;

    event ListItem(address seller, uint price);
    event PurchasedItem(address seller, address buyer, uint price);

    enum StateType {
          ItemAvailable,
          ItemPurchased
    }

    StateType public State;

    constructor() public {c_0x8974721b(0x9c7ed075192a7159ad3bee3f2cf017696ef3d0b6b957a8e7ef0ad3f8899c3b21); /* function */ 

c_0x8974721b(0x03d5a700b83f4105f30ae17fff48ed94402748ba2665950af0220b860e28797c); /* line */ 
        c_0x8974721b(0xdcf2088d87ed7c3999b9a1387d7a7abb96f87bfc9dee4f9dfb7fed92affbd4b1); /* statement */ 
seller = msg.sender;
c_0x8974721b(0x2814cde87b19369ef4c189af7b864005022ae26ae4db5894c058be8d07c33f8b); /* line */ 
        c_0x8974721b(0x83d4ea8ce2dbf4ead416a361b8a1810d1eb8d6d2543f14329e764f1bc780bda8); /* statement */ 
State = StateType.ItemAvailable;
    }
    
    function setInitialBalance(address partecipant, uint amount) public {c_0x8974721b(0xd6e8edd594ecaa7517a5c91e069621c3baccb829a22d27f79690a6faedb40470); /* function */ 
 //no need to be payable
c_0x8974721b(0x0f7cfd61f9caf4b50db3daf3b867f80bf64de9694db2ec25153a4858771e0998); /* line */ 
        c_0x8974721b(0x92526b4f92415b1509e116d2b8b0d67191047d8906dbb9dea6b4127e86e0c2ed); /* requirePre */ 
c_0x8974721b(0x3a78f30ce289b8daff1c5a90f7e9ebf2a20ddadc3af5709a3829f5a7d1167a19); /* statement */ 
require(msg.sender == partecipant, "You cannot update someone else's balance lmao");c_0x8974721b(0xe7bdee6ae2c589392a40b6c4cd6413771db779cbddc7affe520a2721cb01eec9); /* requirePost */ 

c_0x8974721b(0x89a16db19e86e3aa85822032cb69e8ff090ccf216c01cfc1678a34740bda4052); /* line */ 
        c_0x8974721b(0x3065e86bb60e2a0a23c2b32f5f3db50ff75ad8db328df473b9b4de1a110f774d); /* requirePre */ 
c_0x8974721b(0x62fe7368547eb78e97576c06d9ba149fc2ef9073061945f8828d148999ee44d2); /* statement */ 
require(balances[partecipant] == 0,"You have enough money yet");c_0x8974721b(0x2e5ac3c1e1d2b372defab290dab66230af11d99f4cf9a5b74698e0dab2569296); /* requirePost */ 

c_0x8974721b(0x3d41d53e59ec9331a87162218550dc6da0997ccea18be8bd6d02fb3c592f1292); /* line */ 
        c_0x8974721b(0xf2a045e89cd87af22758c3952df6d28d4a6c1794429c77fd262bb73aaf72f29d); /* statement */ 
balances[partecipant] = amount;
    }

    function buy(address seller, address buyer, uint price) public payable {c_0x8974721b(0x59ab84a3c2d3daa5f456fc11a925a051e725a314359e752516534224d0e5c5d4); /* function */ 

c_0x8974721b(0x8253b9fe540a285f25b981c1ce492312e0664895f74f772365c196651e0430de); /* line */ 
        c_0x8974721b(0x797aac9c96b2670727074cfce4c10890ef570ff7373842b921af7345bb54d5ac); /* requirePre */ 
c_0x8974721b(0x9a3d321b1daad0eeb7e7532b3b05a3f54e0471af6ca8ffa86e08953c80c5ba78); /* statement */ 
require(price <= balances[buyer], "Insufficient balance");c_0x8974721b(0x3e2184656ee61171276528ba17835fb2f985efcda8580f01e644a8ff33f0f242); /* requirePost */ 

c_0x8974721b(0x8abb78ae8d28b752bc9142672fc89eda315174ce617f4634f3d7055aee1f58be); /* line */ 
        c_0x8974721b(0x026f95312ff57c745b368563aef07ffcd08fac760c19df797146bca87686b75a); /* statement */ 
State = StateType.ItemPurchased;
c_0x8974721b(0xaca1ef7951b0531d1ccfa8b30efe754156a7aeea31b0add786856ef2fb9b5557); /* line */ 
        c_0x8974721b(0xb295fa17a4ae8856acf4aae776e1e6c91cd098c59bef18de65b187e44d62ad30); /* statement */ 
balances[buyer] -= price;
c_0x8974721b(0x80e55155c28ae0b45f6c7dc50a675fbaad1fbed70a3bf2d20c83558accfb3ec5); /* line */ 
        c_0x8974721b(0xd13e81d2da4a058569aa97112f232a5d0ce8352a060738ccbd1848ad0e5dd03d); /* statement */ 
balances[seller] += price;

c_0x8974721b(0xe4fcbf37625af56596804b295f07d0982bbc027c2fa837c944149ba4237d82e9); /* line */ 
        c_0x8974721b(0xa65224c6688c9a50c2dbcce7a63d8d1d595b0ae930e73487659ac4a25be5a8f3); /* statement */ 
emit PurchasedItem(seller, buyer, msg.value);
    }

     function divide(int n, int d) public {c_0x8974721b(0x16a2f387979a512c28e0276360edb7fa15629978b493ad3b723ac28da2302d4d); /* function */ 
 
c_0x8974721b(0x29c543c2b297a6923be980af26a080e44cc86db9c01ddb71f3086df1f7711139); /* line */ 
        c_0x8974721b(0xe0e1dd54d398e731daa79b944e9b395a0118ee132e54a41ee8736afcc9bb37ad); /* statement */ 
if(d == 0){c_0x8974721b(0x48b814549d01a38175c098ba56adbdd1a0775b3b69e1a55da429449c6168d93a); /* branch */ 

c_0x8974721b(0x7c33fdad934d237cf82ad7e15876ecb43a747e0a503f81bbd3b3e1c84f9631e9); /* line */ 
            c_0x8974721b(0x88dc7265342b3e225534dc98dca0010fbdaecb15b533ecc3de2a20f2f51f9daa); /* statement */ 
return 0;
        }
        else {c_0x8974721b(0xe3495d4221d27d9215fa2cad793adcdc397010a60422a3bd13465cd1c3a3ad0a); /* statement */ 
c_0x8974721b(0xbe6d53dd5eceda824f8bb0ee8a2b19d8cf9052ccbd977ff86085b8d2d6845ad5); /* branch */ 
if(d > 0)
        {c_0x8974721b(0x2b16e198e1b55ac7cf03e86bd1b67b534ab655f4cbd0833c017babb042ef3759); /* branch */ 

c_0x8974721b(0x28c58e08e19e092346e9f32e52cb388c637eef45b37b898b27480dfe6db0dd8a); /* line */ 
            c_0x8974721b(0xad1c919d9c759079d70fc7612d099a06e2daefa9b7b0dab9e5a9c7e2de56c90b); /* statement */ 
return n;
        }else { c_0x8974721b(0xb5f8b928d522b93ce140494b8903522c9b1869c21edece6cda3ce315d47a801b); /* branch */ 
}}
     }
}