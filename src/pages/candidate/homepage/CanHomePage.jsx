import SearchBar from "../../../components/searchBox/SearchBox";
import bannerImg from  '../../../assets/can_home.png';
import './canhome.css';

export default function CanHomePage() {
  return (
    <div className="can-home-page">
        <SearchBar/>
        <div className="banner">
            <img src={bannerImg} alt="" />
        </div>
        <div className="text">
            <h1>Welcome to ITWork!</h1>
            <p>Let’s find your next job together!</p>
        </div>
    </div>
  );
}