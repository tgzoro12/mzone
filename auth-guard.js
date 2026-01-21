// ============================================================
// MZONE AUTH GUARD - Protects all tool pages
// ============================================================

(function() {
    'use strict';
    
    var SECRET_KEY = 'MZ_' + btoa(navigator.userAgent.slice(0, 20) + screen.width);
    
    function generateHMAC(data) {
        var str = JSON.stringify(data) + SECRET_KEY;
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }
    
    function getSecureItem(key) {
        try {
            var raw = localStorage.getItem('mz_' + key);
            if (!raw) return null;
            
            var data = JSON.parse(raw);
            var expectedHMAC = generateHMAC({ value: data.value, key: key });
            
            if (data.hmac !== expectedHMAC) {
                localStorage.removeItem('mz_' + key);
                return null;
            }
            
            return data.value;
        } catch (e) {
            return null;
        }
    }
    
    function checkAccess() {
        var session = getSecureItem('session');
        
        // No session = not logged in
        if (!session) {
            redirectToLogin('Please login first');
            return;
        }
        
        // Session expired
        if (Date.now() > session.expiresAt) {
            redirectToLogin('Session expired. Please login again');
            return;
        }
        
        // Tab session check
        if (sessionStorage.getItem('mz_active') !== 'true') {
            redirectToLogin('Please login to access this page');
            return;
        }
        
        // Admin always has access
        if (session.isAdmin) {
            return; // Allow access
        }
        
        // Check user subscription
        var users = getSecureItem('users') || {};
        var user = users[session.email];
        
        if (!user) {
            redirectToLogin('User not found. Please signup');
            return;
        }
        
        if (!user.subscribed) {
            redirectToLogin('Please subscribe to access this page');
            return;
        }
        
        if (!user.subscriptionExpiry || user.subscriptionExpiry < Date.now()) {
            redirectToLogin('Your subscription has expired. Please renew');
            return;
        }
        
        // User has valid subscription - allow access
    }
    
    function redirectToLogin(reason) {
        alert('🔒 Access Denied\n\n' + reason);
        window.location.href = 'index.html';
    }
    
    // Check access immediately when page loads
    checkAccess();
    
    // Check when user switches back to this tab
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            checkAccess();
        }
    });
    
    // Check every 30 seconds
    setInterval(checkAccess, 30000);
    
    // Check when using browser back button
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            checkAccess();
        }
    });
})();
