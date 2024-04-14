import React, { useEffect } from "react";

import ToiGetMap from "../components/ToiGetMap";
import ToiletTable from "../components/ToiletTable";
import ToiGetForm from "../components/ToiGetForm";
import { useToiGet } from "../components/ToiGetProvider";
import { Navigate } from "react-router-dom";

export default function InsertPage() {
  const { insertMode, setInsertMode, updateMode } = useToiGet();

  useEffect(() => {
    if (updateMode) {
      setInsertMode(() => false);
    }
  }, [setInsertMode, updateMode]);

  if (!insertMode) {
    return <Navigate to="/" replace />;
  }
  if (updateMode) {
    return <Navigate to="/update" replace />;
  }

  return (
    <div style={{ backgroundColor: "lightblue" }} data-bs-theme="dark">
      <div>
        <div style={{ padding: "10px" }}>
          <ToiGetMap />
        </div>
      </div>
      <div>{insertMode && <ToiGetForm />}</div>
      <div>
        <ToiletTable />
      </div>
      <footer></footer>
    </div>
  );
}
