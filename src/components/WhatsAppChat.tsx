// C:\javacelikoglu\frontend\src\components\WhatsAppChat.tsx
"use client";

import React, { useState } from "react";
import { FaTimes, FaWhatsapp } from "react-icons/fa";

interface FavoriteItem {
  title: string;
  description: string;
  price?: number;
}

interface Props {
  items: FavoriteItem[];
  phone: string;
}

const WhatsAppChat: React.FC<Props> = ({ items, phone }) => {
  const [open, setOpen] = useState(false);
  const [customText, setCustomText] = useState("");

  const defaultMessage = () => {
    if (items.length === 0) return "";
    let msg = "Merhaba, aşağıdaki ürünleri sipariş etmek istiyorum:%0A%0A";
    items.forEach(i => {
      const priceStr = i.price?.toFixed(2) + " TL" || "";
      msg += `• ${i.title} (${i.description}) — ${priceStr}%0A`;
    });
    msg += "%0A(Not eklemek isterseniz yazın lütfen.)";
    return msg;
  };

  const handleSend = () => {
    const text = encodeURIComponent(customText || defaultMessage());
    window.open(
      `https://wa.me/${phone}?text=${text}`,
      "WAchat",
      "width=400,height=600"
    );
  };

  return (
    <div style={{ position: "fixed", bottom: 0, right: 0, zIndex: 1000 }}>
      {open ? (
        <div
          style={{
            width: 320,
            height: 420,
            background: "#fff",
            borderRadius: "8px 8px 0 0",
            boxShadow: "0 0 8px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              background: "#25D366",
              color: "#fff",
              padding: "8px",
              borderRadius: "8px 8px 0 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <strong>WhatsApp Sipariş Botu</strong>
            <FaTimes
              style={{ cursor: "pointer" }}
              onClick={() => setOpen(false)}
            />
          </div>

          <div
            style={{
              flex: 1,
              padding: "8px",
              overflowY: "auto",
              fontSize: "14px",
            }}
          >
            {items.length === 0 ? (
              <p>Sepetiniz boş.</p>
            ) : (
              <ul style={{ paddingLeft: 16 }}>
                {items.map((i, idx) => (
                  <li key={idx} style={{ marginBottom: 6 }}>
                    <strong>{i.title}</strong>
                    <br />
                    {i.description}
                    <br />
                    {i.price?.toFixed(2)} TL
                  </li>
                ))}
              </ul>
            )}
          </div>

          <textarea
            value={customText}
            onChange={e => setCustomText(e.target.value)}
            placeholder="Mesaja eklemek istediğiniz not..."
            style={{
              width: "100%",
              border: "none",
              borderTop: "1px solid #ddd",
              padding: "8px",
              resize: "none",
              height: "100px",
              fontSize: "14px",
            }}
          />

          <button
            onClick={handleSend}
            style={{
              background: "#25D366",
              color: "#fff",
              border: "none",
              padding: "12px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Gönder
          </button>
        </div>
      ) : (
        <div
          onClick={() => setOpen(true)}
          style={{
            width: 80,
            height: 80,
            background: "#25D366",
            borderRadius: "16px 16px 0 0",
            margin: "0 16px 16px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
          title="WhatsApp Sipariş"
        >
          <FaWhatsapp size={36} />
        </div>
      )}
    </div>
  );
};

export default WhatsAppChat;
