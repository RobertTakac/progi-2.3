import React, { useState, useEffect } from "react";
import "./MojiOglasi.css";
import { apiRequest } from '../api/apiService';

const MojiOglasi = ({ currentUser }) => {
    const BASE_URL = import.meta.env.VITE_BASE_URL
  
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
      photoFile: null,
      photoPreview: "",
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
        photoFile: null,
        photoPreview: "",
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
    const uploadImage = async (listingId, file) => {
        if (!file) {
            console.log("No file provided → skipping upload");
            return true;
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("listingID", listingId);
        if (newProduct.photoFile) {
            console.log("Uploading file:", newProduct.photoFile.name, "size:", newProduct.photoFile.size);
        }
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${BASE_URL}/merchant/upload-image`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                console.error("Upload failed", response.status);
                return false;
            }
            return true;
        } catch (err) {
            console.error("Upload error:", err);
            return false;
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
          const res = await apiRequest(endpoint, "POST", adData);
          if (res && res.ok) {
              const savedListing = await res.json();


              let imageOk = true;
              if (newProduct.photoFile) {
                  imageOk = await uploadImage(savedListing.id, newProduct.photoFile);
              }

              if (imageOk) {
                  alert("Oglas uspješno objavljen!");
              } else {
                  alert("Oglas spremljen, ali slika nije uspjela uploadati.");
              }

              await fetchAds();
              resetForm();
          } else {
              alert("Spremanje nije uspjelo.");
          }
      } catch (err) {
          console.error("Greška pri slanju:", err);
          alert("Došlo je do greške.");
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

                <div className="date-inputs">
                  <div className="form-group">
                    <label>Dostupno od:</label>
                    <input 
                      type="datetime-local" 
                      value={newProduct.availableFrom} 
                      onChange={(e) => setNewProduct({...newProduct, availableFrom: e.target.value})} 
                    />
                  </div>
                <div className="form-group">
                  <label>Dostupno do:</label>
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
                <label>Slika opreme:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            setNewProduct({
                                ...newProduct,
                                photoFile: file,
                                photoPreview: URL.createObjectURL(file),
                            });
                        }
                    }}
                />

                {newProduct.photoPreview && (
                    <div style={{ marginTop: "10px" }}>
                        <img
                            src={newProduct.photoPreview}
                            alt="Preview"
                            style={{ maxWidth: "220px", maxHeight: "220px", objectFit: "cover", borderRadius: "6px" }}
                        />
                    </div>
                )}

                {isEditing && !newProduct.photoPreview && newProduct.imageUrl && (
                    <div style={{ marginTop: "10px" }}>
                        <img
                            src={`${BASE_URL}/listing/get-image?listingID=${editId}`}
                            alt="Trenutna slika"
                            style={{ maxWidth: "220px", maxHeight: "220px", objectFit: "cover", borderRadius: "6px" }}
                        />
                    </div>
                )}
            </div>

          <button onClick={handleSave} className="publish-btn">
            {isEditing ? "Spremi promjene" : "Objavi Oglas"}
          </button>
        </div>
      )}

      <div className="grid-container">
        {allAds.map((item) => (
          <div className="card" key={item.id}>
              <img
                  src={item.imageUrl || `${BASE_URL}/listing/get-image?listingID=${item.id}` || "https://placehold.co/400x300?text=Nema+slike"}
                  alt={item.title}
                  onError={(e) => {
                      e.target.src = "https://placehold.co/400x300?text=Greška";
                  }}
              />
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