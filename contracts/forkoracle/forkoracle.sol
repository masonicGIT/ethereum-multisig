contract ForkOracle {
    bool public onETH = false;
    bool public onETC = false;

    // blockhash has to be within the last 256
    function update() {
        if (block.blockhash(2120630) == '0xf39e8ad5987e8b1e691563206b75b291abac9b373be71f140915d28744261cca') {
            onETH = true;
        }
        onETC = !onETH;
    }
    function() {
        throw;
    }
}