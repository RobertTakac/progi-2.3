import React, { useState } from "react";
import "./MojiOglasi.css"; 
import { newListing } from "../services/apiService";
import { toast } from 'react-toastify';

const MojiOglasi = () => {
  const [productList, setProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDate, setProductDate] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPhoto, setProductPhoto] = useState("");
  const [productDeposit, setProductDeposit] = useState("");
  const [productLocation, setProductLocation] = useState("");
  const [productCategory, setProductCategory] = useState("");

  const handleDelete = (itemid) => {
    if (window.confirm("Jeste li sigurni da želite ukloniti ovaj proizvod?")) {
      const filteredList = productList.filter((item) => item.id !== itemid);
      setProductList(filteredList);
    }
  };


//   useEffect(() => {
//     if (searchTerm) {
//       const filteredList = products.filter((item) =>
//         item.title.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setProductList(filteredList);
//     } else {
//       setProductList(products);
//     }
//   }, [searchTerm]);

  const handleAdd = async () => {
    if (!productName || !productPrice) {
      return alert("Ime proizvoda i cijena su obavezni.");
    }
    const newProduct = {
      id: new Date().getTime(),
      title: productName,
      dailyPrice: parseFloat(productPrice),
      availableFrom: productDate,
      description: productDescription,
      imageUrl: productPhoto, 
      deposit: parseFloat(productDeposit) || 0,
      location: productLocation,
      categoryName: productCategory
    };

    try {
      const res = await newListing(newProduct);
      console.log("Success creating a new listing: ", res);

      setProductList([...productList, newProduct]);
    
      setProductName("");
      setProductPrice("");
      setProductDescription("");
      setProductPhoto("");
      setProductDeposit("");
      setProductLocation("");
      setProductCategory("");
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Pogreska prilikom stvaranja nove ponude";
      toast.error(errMsg);
    }
  };

  return (
    <div className="moja-oglasna-ploca">
      <h2>Moji Oglasi</h2>
      
      <div className="addProduct">
        <h3>Dodaj novi oglas</h3>
        <input
          type="text"
          placeholder="Unesi naziv (obavezno)"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="number" 
          placeholder="Unesi cijenu (obavezno)"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
        />
        <input
          type="text"
          placeholder="Unesi razdoblje dostupnosti (npr. 01.06. - 01.09.)"
          value={productDate}
          onChange={(e) => setProductDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Opiši proizvod"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Stavi URL slike proizvoda"
          value={productPhoto}
          onChange={(e) => setProductPhoto(e.target.value)}
        />
        <input
          type="number" 
          placeholder="Unesi iznos pologa"
          value={productDeposit}
          onChange={(e) => setProductDeposit(e.target.value)}
        />
        <input
          type="text"
          placeholder="Unesi lokaciju preuzimanja i povrata"
          value={productLocation}
          onChange={(e) => setProductLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Unesi kategoriju predmeta"
          value={productCategory}
          onChange={(e) => setProductCategory(e.target.value)}
        />
        <button onClick={handleAdd} className="add-btn">Dodaj oglas</button>
      </div>

      <div className="searchBar">
        <input
          type="text"
          placeholder="Pretraži svoje oglase..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid-container">
        {productList.map((item, index) => (
          <div className="card" key={index}>
            <img 
              src={item.imageUrl || "https://placehold.co/600x400?text=SLIKA"} 
              alt={item.title}
            />
            <h1>{item.title}</h1>
            <p><strong>Cijena:</strong> €{item.price.toFixed(2)}</p>
            {item.deposit ? (
              <p><strong>Polog:</strong> €{item.deposit.toFixed(2)}</p>
            ) : null}
            {item.date && (<p><strong>Dostupnost:</strong> {item.date}</p>)}
            {item.location && (<p><strong>Lokacija:</strong> {item.location}</p>)}
            {item.description && <p>{item.description}</p>}

            <button
              className="delete-btn"
              onClick={() => handleDelete(item.id)}
            >
              Ukloni
            </button>
          </div>
        ))}
        {productList.length === 0 && <p>Nema pronađenih oglasa.</p>}
      </div>
    </div>
  );
};

export default MojiOglasi;

//