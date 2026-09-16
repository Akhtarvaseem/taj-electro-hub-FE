import { Link } from "react-router-dom";
import { useStore } from "../store/StoreContext";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const { wishlist, user, authLoaded } = useStore();

  if (authLoaded && !user)
    return <div className="container empty"><h2>Please login to view wishlist</h2><Link to="/login" className="btn btn-blue" style={{ display: "inline-block", marginTop: 12 }}>Login</Link></div>;

  return (
    <div className="container">
      <h1 className="mb">My Wishlist ({wishlist.length})</h1>
      {wishlist.length === 0 ?
        <div className="card empty"><div className="big">♥</div><p>Your wishlist is empty.</p></div> :
        <div className="grid grid-4">{wishlist.map((w) => <ProductCard key={w.id} product={w.product} />)}</div>}
    </div>
  );
}
