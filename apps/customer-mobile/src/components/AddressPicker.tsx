import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import { Input } from "@bawaa/ui/input";

declare global {
  interface Window {
    google?: any;
  }
}

const ADUTHURAI = { lat: 11.01542, lng: 79.48093 };
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY as string | undefined;

let scriptPromise: Promise<void> | null = null;

function loadMapsScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps) {
    scriptPromise = Promise.resolve();
    return scriptPromise;
  }
  scriptPromise = new Promise<void>((resolve) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
  return scriptPromise;
}

type AddressPickerProps = {
  value: string;
  onChange: (value: string) => void;
};

const AddressPicker = ({ value, onChange }: AddressPickerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [loaded, setLoaded] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [address, setAddress] = useState(value);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    setAddress(value);
  }, [value]);

  useEffect(() => {
    if (!apiKey) { setMapError(true); return; }

    let map: any = null;
    let marker: any = null;
    let geocoder: any = null;
    let autocomplete: any = null;
    let circle: any = null;

    loadMapsScript().then(() => {
      if (!mapRef.current || !window.google?.maps) return;
      setLoaded(true);

      geocoder = new window.google.maps.Geocoder();

      map = new window.google.maps.Map(mapRef.current, {
        center: ADUTHURAI,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        styles: [
          { featureType: "poi", stylers: [{ visibility: "off" }] },
        ],
      });

      marker = new window.google.maps.Marker({
        position: ADUTHURAI,
        map,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
      });

      circle = new window.google.maps.Circle({
        strokeColor: "#168C67",
        strokeOpacity: 0.15,
        strokeWeight: 1,
        fillColor: "#168C67",
        fillOpacity: 0.1,
        map,
        center: ADUTHURAI,
        radius: 500,
      });

      const updateAddress = (pos: any) => {
        circle.setCenter(pos);
        marker.setPosition(pos);
        geocoder.geocode({ location: pos }, (results: any[], status: string) => {
          if (status === "OK" && results[0]) {
            const addr = results[0].formatted_address;
            setAddress(addr);
            onChangeRef.current(addr);
          }
        });
      };

      marker.addListener("dragend", () => {
        const pos = marker.getPosition();
        if (pos) updateAddress({ lat: pos.lat(), lng: pos.lng() });
      });

      map.addListener("click", (e: any) => {
        if (e.latLng) updateAddress({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      });

      if (searchRef.current) {
        autocomplete = new window.google.maps.places.Autocomplete(searchRef.current, {
          types: ["address"],
          componentRestrictions: { country: "IN" },
        });
        autocomplete.bindTo("bounds", map);
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place?.geometry?.location) {
            const pos = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
            map.setCenter(pos);
            map.setZoom(17);
            updateAddress(pos);
          }
        });
      }

      setGettingLocation(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            map.setCenter(userPos);
            map.setZoom(16);
            updateAddress(userPos);
            setGettingLocation(false);
          },
          () => {
            geocoder.geocode({ location: ADUTHURAI }, (results: any[], status: string) => {
              if (status === "OK" && results[0]) {
                const addr = results[0].formatted_address;
                setAddress(addr);
                onChangeRef.current(addr);
              }
            });
            setGettingLocation(false);
          },
          { enableHighAccuracy: true, timeout: 8000 },
        );
      } else {
        geocoder.geocode({ location: ADUTHURAI }, (results: any[], status: string) => {
          if (status === "OK" && results[0]) {
            const addr = results[0].formatted_address;
            setAddress(addr);
            onChangeRef.current(addr);
          }
        });
        setGettingLocation(false);
      }
    });

    return () => {
      if (autocomplete) window.google?.maps?.event?.clearInstanceListeners?.(autocomplete);
      if (marker) marker.setMap(null);
      if (circle) circle.setMap(null);
    };
  }, []);

  if (!apiKey) {
    return (
      <div className="relative">
        <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
        <Input placeholder="Enter your delivery address" value={value} onChange={(e) => onChange(e.target.value)} className="pl-11 h-13 text-base rounded-xl bg-card border-border" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
          <MapPin size={18} />
        </div>
        <Input ref={searchRef} placeholder="Search address..." className="pl-11 h-11 text-sm rounded-xl bg-card border-border" />
      </div>

      <div className="relative rounded-xl overflow-hidden border border-border h-64">
        {!loaded && (
          <div className="absolute inset-0 bg-secondary flex items-center justify-center z-10">
            <Loader2 className="animate-spin text-muted-foreground" size={24} />
          </div>
        )}
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {gettingLocation && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="animate-spin" size={12} />
          Getting your location...
        </div>
      )}

      {address && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-primary/5 border border-primary/10">
          <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground leading-snug">{address}</p>
        </div>
      )}
    </div>
  );
};

export default AddressPicker;
