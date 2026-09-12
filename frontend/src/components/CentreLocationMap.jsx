import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';

// Custom red pin marker using Leaflet divIcon with inline SVG to avoid asset bundling issues
const createMandiIcon = () => {
  return L.divIcon({
    className: 'custom-mandi-icon',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <svg width="34" height="44" viewBox="0 0 34 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 3px 5px rgba(0,0,0,0.35));">
          <path d="M17 0C7.611 0 0 7.611 0 17C0 28.5 17 44 17 44C17 44 34 28.5 34 17C34 7.611 26.389 0 17 0Z" fill="#C62828" stroke="#8E0000" stroke-width="1.5"/>
          <circle cx="17" cy="16" r="7.5" fill="#FFFFFF"/>
          <circle cx="17" cy="16" r="4" fill="#C62828"/>
        </svg>
      </div>
    `,
    iconSize: [34, 44],
    iconAnchor: [17, 44],
    popupAnchor: [0, -42],
  });
};

// Auto-fit map viewport bounds to encompass all valid centre coordinates
const FitBounds = ({ centres }) => {
  const map = useMap();

  useEffect(() => {
    if (!centres || centres.length === 0) return;

    const latLngs = centres
      .filter((c) => c.location && typeof c.location.latitude === 'number' && typeof c.location.longitude === 'number')
      .map((c) => [c.location.latitude, c.location.longitude]);

    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, {
        padding: [45, 45],
        maxZoom: 12,
        animate: true,
      });
    }
  }, [centres, map]);

  return null;
};

export const CentreLocationMap = ({ centres = [] }) => {
  const { t } = useTranslation();
  const mandiIcon = useMemo(() => createMandiIcon(), []);

  // Filter centres with valid latitude and longitude
  const validCentres = useMemo(() => {
    return centres.filter(
      (c) =>
        c &&
        c.location &&
        typeof c.location.latitude === 'number' &&
        typeof c.location.longitude === 'number' &&
        !isNaN(c.location.latitude) &&
        !isNaN(c.location.longitude)
    );
  }, [centres]);

  // Default fallback center: Geographic center of India
  const defaultCenter = [22.5, 78.5];
  const defaultZoom = 5;

  return (
    <div className="w-full h-[450px] sm:h-[480px] rounded-2xl overflow-hidden border border-gov-border hero-container-shadow relative z-0">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={false}
        className="w-full h-full"
        style={{ minHeight: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds centres={validCentres} />

        {validCentres.map((centre) => (
          <Marker
            key={centre._id || centre.code}
            position={[centre.location.latitude, centre.location.longitude]}
            icon={mandiIcon}
          >
            <Popup className="custom-gov-popup">
              <div className="font-body text-gov-text p-1 space-y-2 min-w-[220px] max-w-[280px]">
                <div className="border-b border-gov-border pb-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-100 text-gov-red border border-red-200">
                      {centre.code}
                    </span>
                    <span className="text-[10px] text-gov-muted font-medium">
                      {centre.district}, {centre.state}
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-sm text-gov-text mt-1 leading-snug">
                    {centre.name}
                  </h4>
                </div>

                <div className="text-xs space-y-1 text-gov-text">
                  <div className="flex items-start space-x-1.5 text-gov-muted text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-gov-red shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{centre.address}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-gov-muted">{t('home.map_popup_capacity')}:</span>
                    <span className="font-bold text-gov-text">
                      {centre.dailyCapacityQuintals} Qtl/day
                    </span>
                  </div>

                  {centre.contactPhone && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gov-muted">{t('home.map_popup_contact')}:</span>
                      <span className="font-mono text-gov-text font-medium">{centre.contactPhone}</span>
                    </div>
                  )}
                </div>

                {centre.supportedCrops && centre.supportedCrops.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[10px] uppercase font-bold text-gov-muted font-heading block mb-1">
                      {t('home.map_popup_crops')}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {centre.supportedCrops.map((crop) => (
                        <span
                          key={crop}
                          className="text-[10px] bg-gov-gray border border-gov-border text-gov-text px-1.5 py-0.5 rounded font-medium"
                        >
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-gov-border flex justify-end">
                  <Link
                    to="/book-slot"
                    className="inline-flex items-center space-x-1 px-3 py-1.5 btn-primary-red text-[11px] font-heading font-bold rounded-lg shadow-2xs transition-all hover:scale-[1.02]"
                  >
                    <span>{t('home.map_popup_book_slot')}</span>
                    <ArrowRight className="w-3 h-3 ml-0.5" />
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CentreLocationMap;
