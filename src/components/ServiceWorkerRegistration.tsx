"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js?v=3")
        .then((reg) => {
          console.log("SW registered:", reg.scope);
          
          // Add listener for service worker updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'activated') {
                  // Force a reload when the new SW becomes active
                  window.location.reload();
                }
              });
            }
          });
        })
        .catch((err) => console.log("SW registration failed:", err));
        
      // Also handle controllerchange for immediate updates
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          window.location.reload();
          refreshing = true;
        }
      });
    }
  }, []);

  return null;
}

