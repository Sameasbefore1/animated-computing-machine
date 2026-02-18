document.addEventListener('DOMContentLoaded', function() {
  const clearButton = document.getElementById('clearCookies');
  const statusDiv = document.getElementById('status');

  // Function to update status message
  function updateStatus(message) {
    statusDiv.textContent = message;
  }

  // Add click event to the clear cookies button
  clearButton.addEventListener('click', async function() {
    updateStatus('Clearing cookies...');
    
    try {
      // Query for tabs with Qwen AI URL
      const tabs = await chrome.tabs.query({
        url: "*://chat.qwen.ai/*"
      });

      // Execute cookie clearing in the background script
      if (tabs.length > 0) {
        // If there are Qwen AI tabs open, clear cookies for the first one
        await chrome.runtime.sendMessage({
          action: "clear_cookies"
        });
        
        updateStatus('Cookies cleared! Refresh the page.');
      } else {
        // If no Qwen AI tabs are open, open the site and clear cookies
        chrome.tabs.create({ url: "https://chat.qwen.ai/" }, async function(tab) {
          // Wait for the page to load, then clear cookies
          setTimeout(async () => {
            await chrome.runtime.sendMessage({
              action: "clear_cookies"
            });
            updateStatus('Cookies cleared!');
          }, 2000);
        });
      }
    } catch (error) {
      console.error('Error clearing cookies:', error);
      updateStatus('Error occurred');
    }
  });

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "cookies_cleared") {
      updateStatus(`Cookies cleared: ${request.count}`);
    }
  });
});