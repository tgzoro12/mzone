// ============================================================
// MZONE AUTH GUARD v3 - Protects all tool pages
// ============================================================

(function() {
    'use strict';
    
    var STORAGE_KEY = 'mzone_data_v3';
    
    function getData() {
        try {
            var data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : { users: {}, currentUser: null };
        } catch (e) {
            return { users: {}, currentUser: null };
        }
    }
    
    function checkAccess() {
        var data = getData();
        
        // No logged in user
        if (!data.currentUser) {
            redirectToLogin('Please login first');
            return;
        }
        
        // Admin always has access
        if (data.currentUser === 'admin' || data.isAdmin) {
            return; // Allow
        }
        
        // Regular user
        var user = data.users[data.currentUser];
        
        if (!user) {
            redirectToLogin('User not found');
            return;
        }
        
        if (!user.subscribed) {
            redirectToLogin('Please subscribe to access');
            return;
        }
        
        if (!user.expiry || user.expiry < Date.now()) {
            redirectToLogin('Subscription expired');
            return;
        }
        
        // User has valid subscription - allow access
    }
    
    function redirectToLogin(reason) {
        alert('🔒 Access Denied\n\n' + reason);
        window.location.href = 'index.html';
    }
    
    // Check immediately
    checkAccess();
    
    // Check when tab becomes visible
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            checkAccess();
        }
    });
    
    // Check every 30 seconds
    setInterval(checkAccess, 30000);
    
    // Check on back button
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            checkAccess();
        }
    });
})();
