// ==UserScript==
// @name         ChatGPT untuk Scola SMP Paramarta Unggulan
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Menambahkan jendela ChatGPT di situs Scola Paramarta Unggulan
// @author       Faris
// @match        https://*.scola.id/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const PROXY_URL = "https://paramarta-chat.onrender.com/openai-chat";

  const chatButton = document.createElement("button");
  chatButton.innerText = "💬 ChatGPT Paramarta";
  chatButton.style.position = "fixed";
  chatButton.style.bottom = "20px";
  chatButton.style.right = "20px";
  chatButton.style.padding = "10px 15px";
  chatButton.style.background = "#007bff";
  chatButton.style.color = "white";
  chatButton.style.border = "none";
  chatButton.style.borderRadius = "8px";
  chatButton.style.zIndex = "9999";
  chatButton.style.cursor = "pointer";
  document.body.appendChild(chatButton);

  const chatBox = document.createElement("div");
  chatBox.style.position = "fixed";
  chatBox.style.bottom = "70px";
  chatBox.style.right = "20px";
  chatBox.style.width = "300px";
  chatBox.style.height = "400px";
  chatBox.style.background = "white";
  chatBox.style.border = "1px solid #ccc";
  chatBox.style.borderRadius = "10px";
  chatBox.style.padding = "10px";
  chatBox.style.display = "none";
  chatBox.style.flexDirection = "column";
  chatBox.style.zIndex = "10000";
  chatBox.innerHTML = `
    <div style="flex:1; overflow-y:auto; border-bottom:1px solid #ccc; margin-bottom:8px;" id="chatContent"></div>
    <input type="text" id="chatInput" placeholder="Ketik pesan..." style="width:100%; padding:6px; border:1px solid #ccc; border-radius:6px;" />
  `;
  document.body.appendChild(chatBox);

  const chatContent = chatBox.querySelector("#chatContent");
  const chatInput = chatBox.querySelector("#chatInput");

  chatButton.onclick = () => {
    chatBox.style.display = chatBox.style.display === "none" ? "flex" : "none";
  };

  chatInput.addEventListener("keypress", async (e) => {
    if (e.key === "Enter" && chatInput.value.trim() !== "") {
      const userMessage = chatInput.value.trim();
      chatContent.innerHTML += `<div><b>Kamu:</b> ${userMessage}</div>`;
      chatInput.value = "";

      const res = await fetch(PROXY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await res.json();
      if (data.reply) {
        chatContent.innerHTML += `<div><b>ChatGPT:</b> ${data.reply}</div>`;
        chatContent.scrollTop = chatContent.scrollHeight;
      } else {
        chatContent.innerHTML += `<div><b>Error:</b> Gagal mendapatkan respons.</div>`;
      }
    }
  });
})();
