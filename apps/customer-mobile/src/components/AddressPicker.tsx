import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import { Input } from "@bawaa/ui/input";

declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          Autocomplete: any;
        };
        event?: {
          clearInstanceListeners: (instance: any) => void;
        };
      };
    };
  }
}

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY as string | undefined;

let scriptPromise: Promise<void> | null = null;

function loadMapsScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps?.places) {
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
  const inputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!apiKey || !inputRef.current) return;

    let autocomplete: any = null;

    loadMapsScript().then(() => {
      if (!inputRef.current || !window.google?.maps?.places) return;
      autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"],
        componentRestrictions: { country: "IN" },
      });
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place?.formatted_address) {
          onChangeRef.current(place.formatted_address);
        }
      });
    });

    return () => {
      if (autocomplete) {
        window.google?.maps?.event?.clearInstanceListeners?.(autocomplete);
      }
    };
  }, []);

  return (
    <div className="relative">
      <MapPin
        size={18}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground z-10"
      />
      <Input
        ref={inputRef}
        placeholder="Enter your delivery address"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-11 h-13 text-base rounded-xl bg-card border-border"
      />
    </div>
  );
};

export default AddressPicker;
