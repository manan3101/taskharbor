import PropTypes from 'prop-types';
import Web3 from 'web3';
import ABI from './ABI.json';
import { useNavigate } from 'react-router-dom';
const Wallet=({saveState})=>{
    const navigateTo=useNavigate();
    const connectWallet=async()=>{
        try{
            if(window.ethereum){
            const web3=new Web3(window.ethereum);
            const accounts=await window.ethereum.request({
                method:"eth_requestAccounts"
            })
            const contract_address="0x40c4613e9428996730Bf8FEB2D7DA8c69D52D539"; 
            const contract=new web3.eth.Contract(ABI,contract_address);
            saveState({web3:web3,contract:contract,account:accounts[0]});
            navigateTo("/view-all-tasks");
            }
            else{
                throw new Error;
            }
        }
        catch(error){
          console.error(error);
        }
    } 
    return (
        <>
          <div className="wallet_header ">
            <span>WELCOME TO</span> <p>TA$K_HARBOR 3.0</p>
          </div>
          <div className="connect_wallet_section todo_btn">
            <p> Please connect metamask wallet to access Account. </p>
            <button onClick={connectWallet}>Connect Wallet</button>
          </div>
        </>
      );
}
    Wallet.propTypes={
        saveState:PropTypes.func.isRequired,
    };

export default Wallet