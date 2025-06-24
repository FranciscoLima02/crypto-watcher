/* global embeddedservice_bootstrap */
import { useEffect } from "react";

export default function SalesforceChat() {
  useEffect(() => {
    let scriptEl;

    if (!document.getElementById("custom-chat-css")) {
      const style = document.createElement("style");
      style.id = "custom-chat-css";
      style.innerHTML = `
        .embedded-messaging-button { background: #ff33ff !important; }
        .embedded-messaging-conversation { background: #090914 !important; }
      `;
      document.head.appendChild(style);
    }

    window.initEmbeddedMessaging = () => {
      embeddedservice_bootstrap.settings.language = "en_US";
      embeddedservice_bootstrap.init(
        "00DgL000003HwM4",
        "Jackson_Embedded_Service",
        "https://orgfarm-44732f2175-dev-ed.develop.my.site.com/ESWJacksonEmbeddedServi1748617693291",
        { scrt2URL: "https://orgfarm-44732f2175-dev-ed.develop.my.salesforce-scrt.com" }
      );
    };
      scriptEl = document.createElement("script");
      scriptEl.id = "sf-messaging-script";
      scriptEl.type = "text/javascript";
      scriptEl.src =
        "https://orgfarm-44732f2175-dev-ed.develop.my.site.com/ESWJacksonEmbeddedServi1748617693291/assets/js/bootstrap.min.js";
      scriptEl.onload = () => window.initEmbeddedMessaging();
      document.body.appendChild(scriptEl);

      return () => {
        if (scriptEl) {
        scriptEl.remove();
      }
      const styleEl = document.getElementById("custom-chat-css");
      if (styleEl) {
        styleEl.remove();
      }
    };
  }, []);

  return null;
}