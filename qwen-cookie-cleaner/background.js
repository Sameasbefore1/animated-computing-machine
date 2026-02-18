// Background script to handle cookie cleaning for Qwen AI chat
chrome.runtime.onInstalled.addListener(() => {
  console.log("Qwen Cookie Cleaner installed");
});

// Function to clear cookies for Qwen AI domain
async function clearQwenCookies() {
  try {
    // Get all cookies for the Qwen AI domain
    const cookies = await chrome.cookies.getAll({
      domain: "chat.qwen.ai"
    });

    // Remove each cookie
    for (const cookie of cookies) {
      await chrome.cookies.remove({
        url: `https://${cookie.domain}${cookie.path}`,
        name: cookie.name
      });
    }

    console.log(`Cleared ${cookies.length} cookies from chat.qwen.ai`);
  } catch (error) {
    console.error('Error clearing cookies:', error);
  }
}

// Clear cookies when the extension icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
  // Check if the current tab is on the Qwen AI domain
  if (tab.url && tab.url.includes("chat.qwen.ai")) {
    await clearQwenCookies();
    
    // Show notification to user
    chrome.tabs.sendMessage(tab.id, {
      action: "cookies_cleared",
      count: "unknown" // We could enhance this to return actual count
    }).catch(() => {
      // If unable to send message to tab, just continue
    });
  } else {
    // Open Qwen AI in a new tab and then clear cookies
    chrome.tabs.create({ url: "https://chat.qwen.ai/" }, async (newTab) => {
      // Wait a bit for the page to load, then clear cookies
      setTimeout(async () => {
        await clearQwenCookies();
        chrome.tabs.update(newTab.id, { active: true });
      }, 2000);
    });
  }
});

// Listen for messages from popup to clear cookies
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "clear_cookies") {
    await clearQwenCookies();
    sendResponse({ success: true });
  }
});

// Optional: Clear cookies periodically
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "periodic_cookie_clear") {
    await clearQwenCookies();
  }
});

// Set up periodic clearing (every hour) - optional feature
chrome.alarms.create("periodic_cookie_clear", {
  periodInMinutes: 60
});