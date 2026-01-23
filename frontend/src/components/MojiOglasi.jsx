import React, { useState, useEffect } from "react";
import "./MojiOglasi.css";
import { getMerchantAllListings, merchantUpdateListing, merchantCreateListing, merchantDeleteListing, getAllCategories } from '../services/apiService';
import { toast } from 'react-toastify';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const emptyProduct = { name: "", price: "", date: "", description: "", photo: "", deposit: "", location: "", categoryName: "" };

const MojiOglasi = ({ currentUser }) => {
  
  const [myAds, setMyAds] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [categories, setCats] = useState([]);

  const [newProduct, setNewProduct] = useState(emptyProduct);

  const fetchAds = async () => {
    try {
      const data = await getMerchantAllListings();
      setMyAds(data);
    } catch (err) {
      console.error("Greška pri dohvaćanju:", err);
      toast.error(err);
    }
  };

  const fetchCats = async () => {
    try {
      const data = await getAllCategories();
      setCats(data);
    } catch (err) {
      console.error("Greška pri dohvaćanju:", err);
      toast.error(err);
    }
  }

  useEffect(() => {
    fetchAds();
    fetchCats();
  }, []);

  const startEdit = (product) => {
    setIsEditing(true);
    setEditId(product.id);
    setNewProduct(structuredClone(product));
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleDelete = async (itemid) => {
    if (window.confirm("Jeste li sigurni?")) {
      try {
        await merchantDeleteListing(itemid);
        setMyAds(myAds.filter((item) => item.id !== itemid));
      } catch(err) {
        toast.error(err);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.price) return alert("Ime i cijena su obavezni.");

    const adData = {
      ...(isEditing && { id: editId }),
      title: newProduct.name,
      description: newProduct.description,
      categoryName: newProduct.categoryName,
      dailyPrice: parseFloat(newProduct.price),
      depositAmount: parseFloat(newProduct.deposit) || 0, 
      pickupCity: newProduct.location,
      currency: "EUR",
      isActive: true,
      availableFrom: new Date().toISOString(),
      availableUntil: new Date(Date.now() + 7*24*60*60*1000).toISOString(), 
    };

    try {
      let res = null;

      if (isEditing) {
        res = await merchantUpdateListing(adData);
      } else {
        res = await merchantCreateListing(adData);
      }

      console.log("res:", res);
      resetForm();
      await fetchAds(); 
    } catch (err) {
      console.error("Greška pri slanju:", err);
      toast.error("Spremanje nije uspjelo. Greska: ", err);
    }
  };

  const resetForm = () => {
    setNewProduct(emptyProduct);
    setShowAddForm(false);
    setIsEditing(false);
    setEditId(null);
  };

  const updateProductField = (field) => (e) => {
    setNewProduct({...newProduct, [field]: e.target.value});
  }

  return (
    <div className="moja-oglasna-ploca">
      <div className="ads-header">
        <h2>Moji Oglasi</h2>
        <button className="add-toggle-btn" onClick={isEditing ? resetForm : () => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Odustani" : "Dodaj novi oglas"}
        </button>
      </div>
      
      {showAddForm && (
        <div className="add-ad-container">
          <h3>{isEditing ? "Uredi Oglas" : "Novi Oglas"}</h3>
          
          <form onSubmit={handleSave}>
            <div className="form-grid">
              <div className="form-inputs">
                <input required name="name" type="text" placeholder="Naziv" value={newProduct.name} onChange={updateProductField("name")} />
                <input required name="price" type="number" placeholder="Cijena (€)" value={newProduct.price} onChange={updateProductField("price")} />
                <input required name="date" type="text" placeholder="Dostupnost" value={newProduct.date} onChange={updateProductField("date")} />
                
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker required name="availableFrom" label="Dostupno od:" />
                  <DatePicker required name="availableTo" label="Dostupno do:" />
                </LocalizationProvider>
                
                <textarea required placeholder="Opis" value={newProduct.description} onChange={updateProductField("description")} />
                <input required name="location" type="text" placeholder="Lokacija" value={newProduct.location} onChange={updateProductField("location")} />
                <select required name="categories" id="category-select" value={newProduct.categoryName} onChange={updateProductField("categoryName")}>
                  <option value="">Izaberite kategoriju</option>
                  {
                    categories?.map(currCat => {
                      return(
                        <option value={currCat.name} key={currCat.id}>
                          {currCat.name}
                        </option>
                      );
                    })
                  }
                </select>
              </div>
              
              <div className="form-image-preview">
                  <input required name="photo" type="text" placeholder="URL slike" value={newProduct.photo} onChange={updateProductField("photo")} />
                  <div className="preview-box">
                      {newProduct.photo && <img src={newProduct.photo} alt="Preview" style={{ objectFit: "contain" }} />}
                  </div>
              </div>
            </div>

            <button type="submit" className="publish-btn">
              {isEditing ? "Spremi promjene" : "Objavi Oglas"}
            </button>
          </form>
        </div>
      )}

      <div className="grid-container">
        {myAds?.map((item) => (
          <div className="card" key={item.id}>
            <img src={item.imageUrl} alt={item.title} />
            <div className="card-content">
              <h1>{item.title}</h1>
              <p className="price-tag">€{Number(item.dailyPrice || 0).toFixed(2)}</p>
              <div className="card-actions">
                <button className="edit-btn" onClick={() => startEdit(item)}>Uredi</button>
                <button className="delete-btn" onClick={() => handleDelete(item.id)}>Ukloni</button>
              </div>
            </div>
          </div>
        ))}
        { (!myAds || myAds.length === 0) && <p className="no-ads-text">Još niste objavili niti jedan oglas.</p>}
      </div>
    </div>
  );
};

export default MojiOglasi;