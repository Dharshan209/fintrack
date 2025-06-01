// Telegram.jsx
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import "./Telegram.css";
import { supabase } from "../config/supabase";

function Telegram() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");

  // Fetch user profile on load
  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;

      const { data, error } = await supabase
        .schema('fintrack')
        .from("user_profiles")
        .select("telegram_username")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else if (data) {
        setUsername(data.telegram_username || "");
        setUserId(userId);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setUsername(e.target.value);
  };

  // Save updated username to Supabase
  const handleSave = async () => {
    const { error } = await supabase
      .schema('fintrack')
      .from("profiles")
      .update({ telegram_username: username })
      .eq("id", userId);

    if (error) {
      console.error("Error updating Telegram username:", error);
    } else {
      alert("Telegram username updated successfully.");
    }
  };

  return (
    <div className="telegram-container">
      <div className="input-section">
        <label htmlFor="telegram">Your Telegram Username</label>
        <input
          id="telegram"
          value={username}
          onChange={handleChange}
          placeholder="@your_username"
        />
        <button onClick={handleSave}>Save</button>
      </div>

      <div className="qr-section">
        <h3>Scan to contact @fintrackautoBot</h3>
        <QRCode value={`https://t.me/fintrackautoBot`} />
      </div>
    </div>
  );
}

export default Telegram;
