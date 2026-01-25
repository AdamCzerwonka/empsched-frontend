export const badgeApi = {
  isSupported: (): boolean => "setAppBadge" in navigator,

  setBadge: async (count: number): Promise<void> => {
    if (!badgeApi.isSupported()) return;
    try {
      if (count > 0) {
        await (
          navigator as Navigator & { setAppBadge: (n: number) => Promise<void> }
        ).setAppBadge(count);
      } else {
        await badgeApi.clearBadge();
      }
    } catch (e) {
      console.warn("Badge API error:", e);
    }
  },

  clearBadge: async (): Promise<void> => {
    if (!badgeApi.isSupported()) return;
    try {
      await (
        navigator as Navigator & { clearAppBadge: () => Promise<void> }
      ).clearAppBadge();
    } catch (e) {
      console.warn("Badge API error:", e);
    }
  },
};
