import { useState } from "react";
import "../css/style.css";
import Link from './Link'


const Compound = () => {
  

  return (
    <div>
       
      <div className="sectionMenu">
        <section className="menu">
        <Link href="/deposit" className="link-item">       
                <div className="btn-primary inline-page">
                    <div className="title">
                    
                        <p><i class="fas fa-university fa-1x"></i>Deposit Dai</p>
                        
                    </div>
                  
                </div>
                 </Link>
                 <Link href="/dai-balance" className="link-item">
                
                <div className="btn-primary">
                    <div className="title">
                    
                        <p><i class="fa fa-credit-card fa-1x"></i>Dai Balance</p>
                    </div>
                </div>
                </Link>
                <Link href="/send-to-compound" className="link-item">
                
                <div className="btn-primary">
                    <div className="title">
                    
                        <p><i class="fas fa-paper-plane fa-1x"></i>Send To Compound</p>
                    </div>
                </div>
                
                </Link>
                <Link href="/compound-balance" className="link-item">
                
                <div className="btn-primary">
                    <div className="title">
                    
                        <p><i class="fa fa-user-circle"></i>Compound Balance</p>
                    </div>
                </div>
                </Link>
                <Link href="/redeem-cdai" className="link-item">
                
                <div className="btn-primary">
                    <div className="title">
                   
                        <p><i class="fas fa-shopping-cart fa-1x"></i>Redeem cDai</p>
                    </div>
                </div>
                </Link>

                <footer class="footer">
            <div class="social">
            <a href="#"><i class="fab fa-facebook"></i></a>
            <a href="https://twitter.com/Atheal9k"><i class="fab fa-twitter"></i></a>
            <a href="https://www.youtube.com/channel/UCsIlKB0CTk89_6WwHv5eX7w"><i class="fab fa-youtube"></i></a>
            <a href="https://www.linkedin.com/in/victor-huang-80b933188/"><i class="fab fa-linkedin"></i></a>
        </div>
        <p>Copyright &copy; 2020 Compound Wallet</p>
    </footer>
    </section>

    
            </div>

            
    </div>
  );
};

export default Compound;
