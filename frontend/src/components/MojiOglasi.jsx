import React, { useState, useEffect } from "react";
import dayjs from 'dayjs';
import "./MojiOglasi.css";
import { getMerchantAllListings, merchantUpdateListing, merchantCreateListing, merchantDeleteListing, getAllCategories } from '../services/apiService';
import { toast } from 'react-toastify';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { API_BASE_URL, ENDPOINTS } from "../utils/constants";

const emptyProduct = { 
  name: "", 
  dailyPrice: "", 
  description: "", 
  prodImg: "",
  previewImgUrl: "", 
  deposit: "", 
  pickupAddress: "",
  pickupCity: "",
  pickupPostalCode: "",
  categoryName: "",
  availableFrom: dayjs('2026-01-22'),
  availableUntil: dayjs('2026-01-22'),
  returnAddress: "",
  returnCity: "",
  returnPostalCode: ""
};

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

    const adData = {
      ...(isEditing && { id: editId }),
      title: newProduct.name,
      description: newProduct.description,
      categoryName: newProduct.categoryName,
      dailyPrice: parseFloat(newProduct.dailyPrice),
      depositAmount: parseFloat(newProduct.deposit) || 0, 
      pickupCity: newProduct.pickupCity,
      pickupAddress: newProduct.pickupAddress,
      pickupPostalCode: newProduct.pickupPostalCode,
      returnCity: newProduct.returnCity,
      returnAddress: newProduct.returnAddress,
      returnPostalCode: newProduct.returnPostalCode,
      currency: "EUR",
      isActive: true,
      availableFrom: newProduct.availableFrom,
      availableUntil: newProduct.availableUntil, 
      returnCountry: "Croatia",
      pickupCountry: "Croatia"
    };

    try {
      let res = null;

      if (isEditing) {
        res = await merchantUpdateListing(adData);
      } else {
        res = await merchantCreateListing(adData, newProduct.prodImg);
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

   const updateProductFieldDate = (field) => (e) => {
    setNewProduct({...newProduct, [field]: e});
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
                <input required name="dailyPrice" type="number" placeholder="Cijena (€)" value={newProduct.dailyPrice} onChange={updateProductField("dailyPrice")} />
                
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker required name="availableFrom" label="Dostupno od:" value={newProduct.availableFrom} onChange={updateProductFieldDate("availableFrom")}/>
                  <DatePicker required name="availableUntil" label="Dostupno do:" value={newProduct.availableUntil} onChange={updateProductFieldDate("availableUntil")}/>
                </LocalizationProvider>
                
                <textarea required placeholder="Opis" value={newProduct.description} onChange={updateProductField("description")} />
                
                <div className="addr">
                  <input required className="cityInput" name="pickupCity" type="text" placeholder="Grad preuzimanja" value={newProduct.pickupCity} onChange={(updateProductField("pickupCity"))} />
                  <input required className="addrInput" name="pickupAddress" type="text" placeholder="Adresa preuzimanja" value={newProduct.pickupAddress} onChange={(updateProductField("pickupAddress"))} />
                  <input required className="postCodeInput" name="pickupPostalCode" type="text" placeholder="Postanski broj" value={newProduct.pickupPostalCode} onChange={(updateProductField("pickupPostalCode"))} />
                </div>
                
                <div className="addr">
                  <input required className="cityInput" name="returnCity" type="text" placeholder="Grad povratka" value={newProduct.returnCity} onChange={(updateProductField("returnCity"))} />
                  <input required className="addrInput" name="returnAddress" type="text" placeholder="Adresa povratka" value={newProduct.returnAddress} onChange={(updateProductField("returnAddress"))} />
                  <input required className="postCodeInput" name="returnPostalCode" type="text" placeholder="Postanski broj" value={newProduct.returnPostalCode} onChange={(updateProductField("returnPostalCode"))} />
                </div>

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
                  <div className="upload-btn">
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                      sx={{ marginBottom: 2 }}
                    >
                      Uploadaj sliku
                      
                      <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => {
                            console.log("Img uploaded? ", e);
                            const file = e.target.files[0];
                            if (file) {
                              setNewProduct({
                                ...newProduct,
                                prodImg: file,
                                previewImgUrl: URL.createObjectURL(file)
                              });
                            }
                          }}
                      />
                    </Button>
                  </div>

                  <div className="preview-box">
                      {newProduct.previewImgUrl && <img src={newProduct.previewImgUrl} alt="Preview" style={{ objectFit: "contain" }} />}
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
            <img src={`${API_BASE_URL}${ENDPOINTS.USER_IMAGES}/${item.prodImg}`} alt={item.title} style={{ objectFit: "contain" }} />
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