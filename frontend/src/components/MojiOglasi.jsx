import React, { useState, useEffect } from "react";
import "./MojiOglasi.css";
import { apiRequest } from '../api/apiService';

const MojiOglasi = ({ currentUser }) => {
  
  const [allAds, setAllAds] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const USD_RATE = 1.17;
  const formatPrice = (price) => {
    const num = parseFloat(price);
    return isNaN(num) ? "0.00" : (num * USD_RATE).toFixed(2);
  };

  const CATEGORIES = [
  "Kampiranje i boravak u prirodi", "Planinarenje i trekking", "Biciklizam",
  "Vodeni sportovi", "Zimski sportovi", "Penjanje i alpinizam",
  "Fitness i trening", "Timski sportovi", "Sportska odjeća i zaštitna oprema",
  "Navigacija i sigurnosna oprema"
  ];

  const [newProduct, setNewProduct] = useState({
  categoryName: CATEGORIES[0],
  title: "",
  description: "",
  dailyPrice: "",
  depositAmount: "",
  currency: "EUR",
  quantityAvailable: 1,
  photo: "", 
  availableFrom: "", 
  availableUntil: "",
  pickupAddress: "", pickupArea: "", pickupCity: "", pickupPostalCode: "", pickupCountry: "Hrvatska",
  returnAddress: "", returnArea: "", returnCity: "", returnPostalCode: "", returnCountry: "Hrvatska",
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

    const formatForInput = (dateStr) => dateStr ? dateStr.slice(0, 16) : "";

    setNewProduct({
      categoryName: product.categoryName || CATEGORIES[0],
      title: product.title || "",
      dailyPrice: product.dailyPrice || "",
      description: product.description || "",
      photo: product.imageUrl || "",
      depositAmount: product.depositAmount || "",
      currency: product.currency || "EUR",
      quantityAvailable: product.quantityAvailable || 1,
      availableFrom: formatForInput(product.availableFrom),
      availableUntil: formatForInput(product.availableUntil),
      pickupAddress: product.pickupAddress || "",
      pickupCity: product.pickupCity || "",
      pickupPostalCode: product.pickupPostalCode || "",
      returnAddress: product.returnAddress || "",
      returnCity: product.returnCity || "",
      returnPostalCode: product.returnPostalCode || "",
    }); 
    alert("Uredi oglas u formi ispod i klikni 'Spremi promjene'");
    setShowAddForm(true);
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
    if (!newProduct.title || !newProduct.dailyPrice) return alert("Ime i cijena su obavezni.");

    const adData = {
      ...(isEditing && { id: editId }),
      categoryName: newProduct.categoryName,
      title: newProduct.title,
      description: newProduct.description,
      dailyPrice: parseFloat(newProduct.dailyPrice),
      depositAmount: parseFloat(newProduct.depositAmount) || 0,
      currency: newProduct.currency,
      quantityAvailable: parseInt(newProduct.quantityAvailable),
      isActive: true,
      imageUrl: newProduct.photo,
      availableFrom: newProduct.availableFrom,
      availableUntil: newProduct.availableUntil,
      pickupAddress: newProduct.pickupAddress,
      pickupArea: newProduct.pickupArea,
      pickupCity: newProduct.pickupCity,
      pickupPostalCode: newProduct.pickupPostalCode,
      pickupCountry: newProduct.pickupCountry,
      returnAddress: newProduct.returnAddress,
      returnArea: newProduct.returnArea,
      returnCity: newProduct.returnCity,
      returnPostalCode: newProduct.returnPostalCode,
      returnCountry: newProduct.returnCountry,
  };

  const endpoint = isEditing ? '/merchant/updateListing' : '/merchant/create-listing';

    try {
      const res = await apiRequest(endpoint, 'POST', adData);
      if (res && res.ok) {
        alert("Oglas uspješno objavljen!");
        await fetchAds(); 
        resetForm();
      } else {
        alert("Spremanje nije uspjelo.");
      }
    } catch (err) {
      console.error("Greška pri slanju:", err);
    }
  };

  const resetForm = () => {
    setNewProduct({
    categoryName: CATEGORIES[0],
    title: "",
    description: "",
    dailyPrice: "",
    depositAmount: "",
    currency: "EUR",
    quantityAvailable: 1,
    availableFrom: "",
    availableUntil: "",
    photo: "", 
    pickupAddress: "", pickupArea: "", pickupCity: "", pickupPostalCode: "", pickupCountry: "Hrvatska",
    returnAddress: "", returnArea: "", returnCity: "", returnPostalCode: "", returnCountry: "Hrvatska",
  });
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
          
          <div className="form-section">
            <h4>Osnovne informacije</h4>
            <div className="form-grid-main">
              <select value={newProduct.categoryName} onChange={(e) => setNewProduct({...newProduct, categoryName: e.target.value})}>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input type="text" placeholder="Naslov oglasa" value={newProduct.title} onChange={(e) => setNewProduct({...newProduct, title: e.target.value})} />
              <textarea placeholder="Opis opreme" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} />
              <div className="inline-inputs">
                <div className="input-calc-group">
                  <input type="number" placeholder="Cijena/dan (€)" value={newProduct.dailyPrice} onChange={(e) => setNewProduct({...newProduct, dailyPrice: e.target.value})} />
                  <span className="usd-hint">${formatPrice(newProduct.dailyPrice)} USD</span>
                </div>

                <div className="input-calc-group">
                  <input type="number" placeholder="Polog (€)" value={newProduct.depositAmount} onChange={(e) => setNewProduct({...newProduct, depositAmount: e.target.value})} />
                  <span className="usd-hint">${formatPrice(newProduct.depositAmount)} USD</span>
                </div>

                <div className="input-calc-group">
                  <input type="number" placeholder="Količina" value={newProduct.quantityAvailable} onChange={(e) => setNewProduct({...newProduct, quantityAvailable: e.target.value})} />
                </div>

                <div className="date-inputs" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.8rem', color: '#666' }}>Dostupno od:</label>
                    <input 
                      type="datetime-local" 
                      value={newProduct.availableFrom} 
                      onChange={(e) => setNewProduct({...newProduct, availableFrom: e.target.value})} 
                    />
                  </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', color: '#666' }}>Dostupno do:</label>
                  <input 
                    type="datetime-local" 
                    value={newProduct.availableUntil} 
                    onChange={(e) => setNewProduct({...newProduct, availableUntil: e.target.value})} 
                  />
                </div>
              </div>

              </div>
            </div>
          </div>

          <div className="form-location-wrapper">
            <div className="location-section">
              <h4>Lokacija preuzimanja (Pickup)</h4>
              <input type="text" placeholder="Adresa" value={newProduct.pickupAddress} onChange={(e) => setNewProduct({...newProduct, pickupAddress: e.target.value})} />
              <input type="text" placeholder="Grad" value={newProduct.pickupCity} onChange={(e) => setNewProduct({...newProduct, pickupCity: e.target.value})} />
              <input type="text" placeholder="Poštanski broj" value={newProduct.pickupPostalCode} onChange={(e) => setNewProduct({...newProduct, pickupPostalCode: e.target.value})} />
            </div>

            <div className="location-section">
              <h4>Lokacija povrata (Return)</h4>
              <input type="text" placeholder="Adresa" value={newProduct.returnAddress} onChange={(e) => setNewProduct({...newProduct, returnAddress: e.target.value})} />
              <input type="text" placeholder="Grad" value={newProduct.returnCity} onChange={(e) => setNewProduct({...newProduct, returnCity: e.target.value})} />
              <input type="text" placeholder="Poštanski broj" value={newProduct.returnPostalCode} onChange={(e) => setNewProduct({...newProduct, returnPostalCode: e.target.value})} />
            </div>
          </div>

          <div className="form-image-preview">
            <input type="text" placeholder="URL slike opreme" value={newProduct.photo} onChange={(e) => setNewProduct({...newProduct, photo: e.target.value})} />
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
              <div className="price-container">
                <span className="price-eur">€{Number(item.dailyPrice || 0).toFixed(2)}</span>
                <span className="price-usd">(${Number((item.dailyPrice || 0) * USD_RATE).toFixed(2)} USD)</span>
              </div>
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