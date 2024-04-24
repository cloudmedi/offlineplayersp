
import { useEffect, useState, } from "react";
import "./playlist.css"
import Player from "../player/player"
import Countdown from "react-countdown";
import axios from "axios";
import _ from "lodash";
function Playlist(props) {


    const [selectedPlaylist, setSelectedPlaylist] = useState([]);
    const [click,setClick]=useState(0)

    const [time, setTime] = useState(new Date());

    useEffect(() => {
      const timer = setInterval(() => {
        setTime(new Date());
      }, 1000);
  
      return () => {
        clearInterval(timer);
      };
    }, []);
    const user=props?.data?.user?.user
   
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const handlePlaylistClick = (playlist) => {
        setSelectedPlaylist(playlist);
        setClick(prevClick => prevClick + 1);
        // Burada seçilen playlisti savedPlaylists array'ine ekleyebilirsiniz.
        
    };

    var tarih = new Date(props.data.user.expires_at);
   
    var zamanDamgasi = tarih.getTime();
    if (Date.now() + (Number(zamanDamgasi) - Date.now()) === 0) {
        logOut()
    }
    function logOut() {
        window.electron.ipcRenderer.send("log-out", "log-out");
        window.location.reload()
    }
   
    

    
    useEffect(() => {
      
            // Kullanıcı yöneticiyse ve manager_id 951 ise
            if (props?.user?.userinfo?.manager_id !== null && props?.user?.userinfo?.manager_id === 951) {

                const playlists = props.data.allPlaylists; // Tüm çalma listeleri
    
                const selectedPlaylist = playlists.map(playlist => {
                    // Saat 8 ile 11 arası ve "Hareketli" çalma listesi ise
                    if (hours >= 8 && hours < 11 && playlist.playlistName === "Slow") {
                        setSelectedPlaylist(playlist)
                    }
                    // Saat 11 ile 00:00 arası ve "Slow" çalma listesi ise
                    else if ((hours >= 11 ) && playlist.playlistName === "Hareketli") {
                        setSelectedPlaylist(playlist)
                    }
                    // Diğer durumlarda null döndür
                    return null;
                }).filter(playlist => playlist !== null); // null olmayanları filtrele
    
              
            }
       // Her dakikada bir kontrol etmek için 60000 milisaniye (1 dakika)
    
       
    }, [props?.user?.userinfo,hours]); // props.data.allPlaylists bağımlılığını ekledik
    
    



    return (
        <>
            <div style={{ width: window.innerWidth, marginBottom: "150px" }} className="">
                <nav class="navbar">
                    <div class="navbar-content">
                        <div class="navbar-logo">
                            <img src={props?.data.user?.user?.artwork_url} alt="Logo" />
                            <span>{props?.data?.user?.user?.name}</span>
                        </div>
                        {/* <div style={{ display: "flex", flexDirection: "column" }} className="navbar-info">
                            <span>Lisans Bitiş Süresi</span>
                            <span><Countdown date={Date.now() + (Number(zamanDamgasi) - Date.now())} /></span>
                        </div> */}
                        <div class="navbar-links">
                            <a href="#" onClick={() => logOut()}>Çıkış Yap</a>
                        </div>
                    </div>
                </nav>
                <div class="playlist-container">
                    {props?.data?.allPlaylists?.map(res => (
                        <div className="playlist" key={res?.playlistName} style={{ cursor: "pointer" }} onClick={() => handlePlaylistClick(res)}>
                            <img src={res.playlistImage} alt={res.playlistName} />
                            <h3 >{res.playlistName}</h3>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99999 }}>
                <Player data={{selectedPlaylist,user,click}}/>  
            </div>
        </>
    );


}

export default Playlist