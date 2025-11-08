import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { useMap } from 'react-leaflet';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RoutingMachineProps {
  waypoints: L.LatLng[];
  color?: string;
  weight?: number;
}

const RoutingMachine: React.FC<RoutingMachineProps> = ({ 
  waypoints, 
  color = '#3b82f6', 
  weight = 6 
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map || waypoints.length < 2) return;

    // Create routing control
    const routingControl = L.Routing.control({
      waypoints: waypoints,
      routeWhileDragging: false,
      showAlternatives: false,
      fitSelectedRoutes: true,
      show: false, // Hide instructions panel
      createMarker: () => null, // Don't create default markers
      lineOptions: {
        styles: [
          {
            color: color,
            weight: weight,
            opacity: 0.8
          }
        ],
        extendToWaypoints: false,
        missingRouteTolerance: 0
      },
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1'
      })
    }).addTo(map);

    // Fit map to route bounds
    setTimeout(() => {
      if (routingControl.getPlan()) {
        map.fitBounds(routingControl.getPlan().getBounds());
      }
    }, 500);

    // Cleanup function
    return () => {
      map.removeControl(routingControl);
    };
  }, [map, waypoints, color, weight]);

  return null;
};

export default RoutingMachine;