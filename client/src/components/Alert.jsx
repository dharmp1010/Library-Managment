// =============================================
// components/Alert.jsx - Reusable Alert
// =============================================

import { useEffect, useState } from "react";

// Auto-dismisses after 4 seconds
function Alert({ message, type = "success", onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible || !message) return null;

  return (
    <div className={`alert alert-${type}`}>
      <span>{type === "success" ? "✅" : "❌"}</span>
      {message}
    </div>
  );
}

export default Alert;
