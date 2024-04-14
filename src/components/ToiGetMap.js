import React, { useRef, useMemo } from "react";

import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import ToiletIcon from "./ToiletIcon";
import { useToiGet } from "./ToiGetProvider";
import L from "leaflet";
import { Marker } from "react-leaflet";
import markerIcon from "../assets/marker-icon.png";

function ToiGetMap() {
  const {
    toiletList,
    currentPosition,
    setCurrentPosition,
    toiletPosition,
    setToiletPosition,
    insertMode,
    setInsertMode,
    setInsertError,
    updateMode,
    setUpdateMode,
    user,
  } = useToiGet();

  const INITIAL_POSITION = [-23.004678325889472, -43.31867551816686];

  function isToilet(latlng) { // Quando clica próximo de um banheiro, considera alteração, ao invés de inclusão
    for (let i=0; i < toiletList.length; i++ ) {
      let toiletLatLng = L.latLng(toiletList[i].latitude, toiletList[i].longitude);
      // se menos de 100 metros, ignora
      if (toiletLatLng.distanceTo(latlng) < 100.) {
        return true;
      }
    }
    return false;
  }

  function MapControl() {
    const map = useMapEvents({
      click(e) {
        // clicou em um banheiro? Se sim, ignora (será ativado o modo de alteração).
        if (!isToilet(e.latlng)) {
          if (updateMode) {
            setUpdateMode(() => false);
          }
          if (user) {
            setToiletPosition(() => e.latlng);
            setInsertMode(() => true);
          } else {
            setInsertError(() => true);
          }
        }
      },
    });
    return null;
  }

  function DraggableMarker() { // Posição de referência para calcular as distâncias até os banheiros
    const markerRef = useRef(null);
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            setCurrentPosition(() => {
              let pos1 = marker.getLatLng();
              let pos2 = [pos1.lat, pos1.lng];
              localStorage.setItem("currentPosition", JSON.stringify(pos2));
              return pos2;
            });
            setInsertMode(() => false);
            setUpdateMode(() => false);
          }
        },
      }),
      []
    );
    const streamingIcon = new L.icon({
      iconUrl: markerIcon,
      iconSize: [25, 41],
    });

    return (
      <Marker
        icon={streamingIcon}
        draggable={true}
        eventHandlers={eventHandlers}
        position={currentPosition ? currentPosition : INITIAL_POSITION}
        ref={markerRef}
      ></Marker>
    );
  }

  function ToiletMarker() {
    let toiletIcon = L.icon({
      iconUrl: require("../assets/toilet-blue.png"),
      iconSize: [32, 32],
    });

    return toiletPosition === null ? null : (
      <Marker position={toiletPosition} icon={toiletIcon}></Marker>
    );
  }

  return (
    <MapContainer
      center={INITIAL_POSITION}
      zoom={14}
      scrollWheelZoom={false}
      className="map"
    >
      <MapControl />
      {toiletList
        ? toiletList.map((toilet, index) => (
            <ToiletIcon
              key={index}
              latitude={toilet.latitude}
              longitude={toilet.longitude}
              index={index}
              toiletUser={toilet.user}
            />
          ))
        : null}
      <DraggableMarker />
      {insertMode && !updateMode && <ToiletMarker />}
      {updateMode && !insertMode && <ToiletMarker />}

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );
}

export default ToiGetMap;
