import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import debounce from "lodash/debounce";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';

// Fix for default Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// AutoZoom to fit bounds
const AutoZoom = ({ places }) => {
  const map = useMap();

  useEffect(() => {
    if (places.length > 0) {
      const bounds = L.latLngBounds(places.map((place) => [place.lat, place.lon]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [places, map]);

  return null;
};

// Popup handler for selected place
const MarkerPopup = ({ selectedPlace }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedPlace) {
      const latlng = L.latLng(selectedPlace.lat, selectedPlace.lon);
      map.setView(latlng, 14);
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker && layer.getLatLng().equals(latlng)) {
          layer.openPopup();
        }
      });
    }
  }, [selectedPlace, map]);

  return null;
};

const MapComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState([20.5937, 78.9629]); // Default to India
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null); // Track selected place
  const [suggestions, setSuggestions] = useState([]); // Dropdown suggestions

  const excludeKeywords = ["hospital", "school", "college", "university", "estate", "division", "Academy", "company", "bus Stand", "railways", "assembly", "stadium", "state", "district", "constituency"];
  const defaultFallbackImage = "https://via.placeholder.com/300x200?text=No+Image+Available";
  const googleMapsApiKey = 'AIzaSyDx20hX9rZ-PRB3SDFoiQOdhEzHtk8rkOg'; // Replace with your Google Maps API key

  const debouncedSearch = useCallback(debounce(async (term) => {
    setLoading(true);
    setErrorMessage(""); // Reset error message

    try {
      const nominatimResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${term}&countrycodes=IN`
      );

      if (nominatimResponse.data.length === 0) {
        setErrorMessage("Location not found!");
        setLoading(false);
        return;
      }

      const { lat, lon } = nominatimResponse.data[0];
      setLocation([lat, lon]);

      const wikipediaResponse = await axios.get(
        `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=${lat}|${lon}&gslimit=50&format=json&origin=*`
      );

      const placesData = await Promise.all(
        wikipediaResponse.data.query.geosearch
          .filter((place) => {
            const title = place.title.toLowerCase();
            return !excludeKeywords.some((keyword) => new RegExp(`\\b${keyword}\\b`).test(title));
          })
          .map(async (place) => {
            const placeInfo = await axios.get(
              `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=thumbnail&pithumbsize=300&pageids=${place.pageid}&origin=*`
            );

            let imageUrl;
            if (placeInfo.data.query.pages[place.pageid].thumbnail) {
              imageUrl = placeInfo.data.query.pages[place.pageid].thumbnail.source;
            } else {
              imageUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(place.title)}`;
            }

            const address = await reverseGeocode(place.lat, place.lon);

            return {
              title: place.title,
              lat: place.lat,
              lon: place.lon,
              imageUrl,
              address, // Add address to place data
            };
          })
      );

      if (placesData.length === 0) {
        setErrorMessage("No notable places nearby.");
      } else {
        setPlaces(placesData);
        setSuggestions(placesData); // Populate dropdown
      }
    } catch (error) {
      console.error("Error fetching location or places:", error);
      setErrorMessage("Error fetching places. Please try again.");
    } finally {
      setLoading(false);
    }
  }, 500), []);

  const handleSearch = (e) => {
    e.preventDefault();
    debouncedSearch(searchTerm);
  };

  const handlePlaceSelect = (title) => {
    const place = places.find((p) => p.title === title);
    if (place) {
      setSelectedPlace(place); // Show popup for selected place
      const latlng = L.latLng(place.lat, place.lon);
      const map = document.querySelector('.leaflet-container').__leaflet__map;
      map.setView(latlng, 14); // Adjust zoom level if needed
    }
  };

  // When a marker is clicked, update dropdown
  const handleMarkerClick = (place) => {
    setSelectedPlace(place); // Sync the selected marker with the dropdown
    const latlng = L.latLng(place.lat, place.lon);
    const map = document.querySelector('.leaflet-container').__leaflet__map;
    map.setView(latlng, 14); // Adjust zoom level if needed
  };

  // Function to reverse geocode coordinates into location name using Google Maps Geocoding API
  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${googleMapsApiKey}`
      );

      if (response.data.results.length === 0) {
        return `Coordinates: ${lat}, ${lon}`; // Return coordinates if no results found
      }

      const address = response.data.results[0].formatted_address || `Coordinates: ${lat}, ${lon}`;
      return address;
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      return `Coordinates: ${lat}, ${lon}`; // Fallback in case of error
    }
  };

  return (
    <>
      <div id="mapcomponent">
        <div id="mapcomponentfields">
          <form onSubmit={handleSearch} style={{display: "flex"}}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search state, district, city, or area"
              style={{ width: "300px", padding: "5px" }}
              className="map-search"
            />
            <button
              className="btn-search"
              type="submit"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          {/* Bootstrap Dropdown that shows places */}
          <DropdownButton
            id="dropdown-basic-button"
            title={selectedPlace ? selectedPlace.title : "Select a place"}
            style={{ marginTop: "20px" ,width:"400px"}}
          >
            {places.length === 0 && (
              <Dropdown.ItemText>No places found</Dropdown.ItemText>
            )}
            {places.map((place, idx) => (
              <Dropdown.Item
                key={idx}
                eventKey={place.title}
                onClick={() => handlePlaceSelect(place.title)}
              >
                {place.title}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </div>

        <MapContainer
          key={JSON.stringify(location)}
          center={location}
          zoom={6}
          style={{ height: "600px", width: "100%", marginTop: "20px" ,border:"8px solid #FAEAA4"}}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {places.length > 0 && <AutoZoom places={places} />}

          {/* Trigger popup for selected place */}
          {selectedPlace && <MarkerPopup selectedPlace={selectedPlace} />}

          {places.map((place, idx) => (
            <Marker
              key={idx}
              position={[place.lat, place.lon]}
              eventHandlers={{
                click: () => handleMarkerClick(place), // Sync dropdown with marker click
              }}
            >
              <Popup
                className="custom-popup"
                maxWidth={300}
                closeButton
                autoClose
                autoPan
              >
                <div style={{ backgroundColor: "#190808", color: "#ffffff", padding: "10px", borderRadius: "5px" }}>
                  <img
                    src={place.imageUrl}
                    alt={place.title}
                    className="d-block w-100"
                    style={{ width: "200px", height: "150px", objectFit: "cover" }}
                    onError={(e) => { e.target.src = defaultFallbackImage; }}
                    loading="lazy"
                  />
                  <br/>
                  <b style={{fontWeight: "400"}}>{place.title}</b>
                  <br />
                  <p>{place.address}</p> {/* Show address in popup */}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm btn-directions"
                  >
                    Get Directions
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {errorMessage && (
        <div className="errormsgmap">
          <h3>{errorMessage}</h3>
        </div>
      )}
    </>
  );
};

export default MapComponent;
