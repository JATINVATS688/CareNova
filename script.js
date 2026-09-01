/* =========================================================
   Care Nova — Login Page Script
   -------------------------------------------------------
   This is a "fake it till you build it" script. Nothing here
   talks to a real server — it just makes the buttons feel
   alive for demo purposes. When a real backend exists later,
   the toast lines get replaced with real navigation/API calls.
   ========================================================= */

// Wait until the whole page (all the HTML) has loaded before
// trying to grab any elements — otherwise document.getElementById
// might run before the button even exists yet, and return null.
document.addEventListener('DOMContentLoaded', function () {

    // ---- Grab the elements we need to attach behavior to ----
    var doctorBtn = document.getElementById('doctorLoginBtn');
    var patientBtn = document.getElementById('patientLoginBtn');
    var signUpBtn = document.getElementById('signUpBtn');

    // ---- Doctor button: this one actually navigates ----
    // Because the Doctor Portal page is already built.
    doctorBtn.addEventListener('click', function () {
        window.location.href = 'doctor-portal.html';
    });

    // ---- Patient button: no patient portal built yet ----
    // So instead of going nowhere or throwing an error, we show
    // a friendly toast message explaining that.
    patientBtn.addEventListener('click', function () {
        showToast('Patient portal coming soon 👀');
    });

    // ---- Sign Up button: same idea, no backend yet ----
    signUpBtn.addEventListener('click', function () {
        showToast('Sign up flow coming soon!');
    });

});


/**
 * showToast(message)
 * ------------------------------------------------------
 * Creates a small floating message at the bottom of the
 * screen, shows it briefly, then removes it.
 *
 * Why build a new one every time instead of reusing one
 * element? It's simpler to reason about for a first script —
 * no need to worry about a leftover timer canceling itself.
 */
function showToast(message) {
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // A tiny delay before adding "is_visible" lets the CSS
    // transition actually animate in, instead of snapping
    // straight to its visible state.
    setTimeout(function () {
        toast.classList.add('is_visible');
    }, 10);

    // Hide it again after 2.5 seconds, then fully remove it
    // from the page once its fade-out transition has finished.
    setTimeout(function () {
        toast.classList.remove('is_visible');
        setTimeout(function () {
            toast.remove();
        }, 300);
    }, 2500);
}
