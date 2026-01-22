import React, { useState, useEffect } from "react";
import "./MojiOglasi.css";
import { apiRequest } from '../api/apiService';

const MojiOglasi = ({ currentUser }) => {
  
  const [allAds, setAllAds] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "", price: "", date: "", description: "", photo: "", deposit: "", location: ""
  });

  const fetchAds = async () => {
    try {
      const res = await apiRequest('/merchant/get-all-listings', 'GET'); 
      if (res && res.ok) {
        const data = await res.json();
        setAllAds(data);
      }
    } catch (err) {
      console.error("Greška pri dohvaćanju:", err);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const startEdit = (product) => {
    setIsEditing(true);
    setEditId(product.id);
    setNewProduct({
      name: product.title,
      price: product.dailyPrice,
      date: product.availableUntil || "",
      description: product.description || "",
      photo:  "",
      deposit: product.depositAmount || "",
      location: product.pickupCity || ""
    });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleDelete = async (itemid) => {
    if (window.confirm("Jeste li sigurni?")) {
      const res = await apiRequest(`/merchant/deleteListing/${itemid}`, 'DELETE');
      if (res && res.ok) {
        setAllAds(allAds.filter((item) => item.id !== itemid));
      }
    }
  };

  const handleSave = async () => {
    if (!newProduct.name || !newProduct.price) return alert("Ime i cijena su obavezni.");

    const adData = {
      ...(isEditing && { id: editId }),
      title: newProduct.name,
      description: newProduct.description,
      dailyPrice: parseFloat(newProduct.price),
      depositAmount: parseFloat(newProduct.deposit) || 0, 
      pickupCity: newProduct.location,
      categoryName: "Sport",
      currency: "EUR",
      isActive: true,
      availableFrom: new Date().toISOString(),
      availableUntil: new Date(Date.now() + 7*24*60*60*1000).toISOString(), 
    };

  const endpoint = isEditing ? '/merchant/updateListing' : '/merchant/create-listing';

    try {
      const res = await apiRequest(endpoint, 'POST', adData);
      if (res && res.ok) {
        fetchAds(); 
        resetForm();
      } else {
        alert("Spremanje nije uspjelo.");
      }
    } catch (err) {
      console.error("Greška pri slanju:", err);
    }
  };

  const resetForm = () => {
    setNewProduct({ name: "", price: "", date: "", description: "", photo: "", deposit: "", location: "" });
    setShowAddForm(false);
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div className="moja-oglasna-ploca">
      <div className="ads-header">
        <h2>Moji Oglasi ({currentUser?.username || 'Trgovac'})</h2>
        <button className="add-toggle-btn" onClick={isEditing ? resetForm : () => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Odustani" : "Dodaj novi oglas"}
        </button>
      </div>
      
      {showAddForm && (
        <div className="add-ad-container">
          <h3>{isEditing ? "Uredi Oglas" : "Novi Oglas"}</h3>
          
          <div className="form-grid">
            <div className="form-inputs">
              <input type="text" placeholder="Naziv" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} />
              <input type="number" placeholder="Cijena (€)" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} />
              <input type="text" placeholder="Dostupnost" value={newProduct.date} onChange={(e) => setNewProduct({...newProduct, date: e.target.value})} />
              <textarea placeholder="Opis" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} />
              <input type="text" placeholder="Lokacija" value={newProduct.location} onChange={(e) => setNewProduct({...newProduct, location: e.target.value})} />
            </div>
            
            <div className="form-image-preview">
                <input type="text" placeholder="URL slike" value={newProduct.photo} onChange={(e) => setNewProduct({...newProduct, photo: e.target.value})} />
                <div className="preview-box">
                    {newProduct.photo && <img src={newProduct.photo} alt="Preview" />}
                </div>
            </div>
          </div>

          <button onClick={handleSave} className="publish-btn">
            {isEditing ? "Spremi promjene" : "Objavi Oglas"}
          </button>
        </div>
      )}

      <div className="grid-container">
        {allAds.map((item) => (
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
        {allAds.length === 0 && <p className="no-ads-text">Još niste objavili niti jedan oglas.</p>}
      </div>
    </div>
  );
};

export default MojiOglasi;