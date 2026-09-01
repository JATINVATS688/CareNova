/* =========================================================
   Care Nova — Patient Portal Script
   -------------------------------------------------------
   Single-patient page, so there's no "switch patient" logic
   like doctor.js has — just one record (Sarah Chen), matching
   what she looks like on the Doctor Portal side, so the demo
   feels like one connected product instead of two unrelated
   mockups.
   ========================================================= */

// ---------------------------------------------------------
// 1. FAKE DATABASE — this patient's own prescriptions
// ---------------------------------------------------------
var prescriptions = [
    {
        status: 'active',
        id: 'RX001',
        title: 'Essential hypertension (I10)',
        doctor: 'Dr. Michael Torres · Cardiologist',
        date: 'Jul 28, 2026',
        meds: [
            { name: 'Lisinopril', dose: '10 mg' },
            { name: 'Amlodipine', dose: '5 mg' }
        ],
        notes: 'Monitor blood pressure weekly. Return if readings exceed 160/100 mmHg.'
    },
    {
        status: 'active',
        id: 'RX002',
        title: 'Hypercholesterolemia (E78.0)',
        doctor: 'Dr. Michael Torres · Cardiologist',
        date: 'Jun 10, 2026',
        meds: [
            { name: 'Atorvastatin', dose: '20 mg' }
        ],
        notes: 'Recheck lipid panel in 3 months. Continue low-saturated-fat diet.'
    },
    {
        status: 'pending',
        id: 'RX003',
        title: 'Type 2 diabetes mellitus (E11) — refill request',
        doctor: 'Dr. Michael Torres · Cardiologist',
        date: 'Aug 22, 2026',
        meds: [
            { name: 'Metformin', dose: '500 mg' }
        ],
        notes: 'Refill requested — awaiting doctor approval.'
    },
    {
        status: 'expired',
        id: 'RX000',
        title: 'Seasonal allergic rhinitis (J30.2)',
        doctor: 'Dr. Priya Nair · Allergist',
        date: 'Mar 2, 2026',
        meds: [
            { name: 'Cetirizine', dose: '10 mg' }
        ],
        notes: 'Course completed. Follow up only if symptoms return.'
    }
];

var currentFilter = 'all'; // which tab is selected right now


// ---------------------------------------------------------
// 2. RUN EVERYTHING ONCE THE PAGE HAS LOADED
// ---------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {

    fillStatCards();
    renderPrescriptions();

    // Logo click — takes you back to the login screen.
    document.getElementById('brandLogoBtn').addEventListener('click', function () {
        window.location.href = 'index.html';
    });

    // Back button — real browser navigation.
    document.getElementById('backBtn').addEventListener('click', function () {
        window.history.back();
    });

    // Home / Info / Help — no pages built for these yet.
    document.querySelectorAll('.pp_nav_link').forEach(function (link) {
        link.addEventListener('click', function () {
            showToast(link.getAttribute('data-page') + ' page coming soon!');
        });
    });

    // Logout — nothing to actually log out of yet.
    document.getElementById('logoutBtn').addEventListener('click', function () {
        showToast('Logged out (demo) — this would end a real session.');
    });

    // Filter tabs (All / Active / Expired / Pending).
    document.querySelectorAll('.pp_filter_tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
            currentFilter = tab.getAttribute('data-filter');
            setActiveTab(tab);
            renderPrescriptions();
        });
    });

});


// ---------------------------------------------------------
// 3. STAT CARDS
// ---------------------------------------------------------
function fillStatCards() {
    var activeCount = prescriptions.filter(function (rx) {
        return rx.status === 'active';
    }).length;

    var totalMeds = prescriptions.reduce(function (sum, rx) {
        return sum + rx.meds.length;
    }, 0);

    document.getElementById('statActive').textContent = activeCount;
    document.getElementById('statTotal').textContent = prescriptions.length;
    document.getElementById('statMeds').textContent = totalMeds;
    // Blood type is static (A+) since it doesn't depend on prescriptions.
}


// ---------------------------------------------------------
// 4. PRESCRIPTION LIST + FILTERING
// ---------------------------------------------------------

/**
 * renderPrescriptions()
 * ------------------------------------------------------
 * Clears the list and rebuilds it from scratch, showing only
 * prescriptions that match the currently selected filter tab.
 */
function renderPrescriptions() {
    var rxList = document.getElementById('rxList');
    rxList.innerHTML = '';

    var visibleRx = prescriptions.filter(function (rx) {
        return currentFilter === 'all' || rx.status === currentFilter;
    });

    visibleRx.forEach(function (rx) {
        rxList.appendChild(buildRxCard(rx));
    });
}

/**
 * setActiveTab(clickedTab)
 * ------------------------------------------------------
 * Same pattern as the sidebar highlight in doctor.js —
 * clear the highlight everywhere, then add it back to just
 * the one that was clicked.
 */
function setActiveTab(clickedTab) {
    document.querySelectorAll('.pp_filter_tab').forEach(function (tab) {
        tab.classList.remove('is_active');
    });
    clickedTab.classList.add('is_active');
}

/**
 * buildRxCard(rx)
 * ------------------------------------------------------
 * Builds one expandable prescription card. Clicking the
 * summary row toggles an "is_open" class, which the CSS uses
 * to animate the details panel open/closed (see .pp_rx_details
 * in patient_style.css — it's a max-height transition).
 */
function buildRxCard(rx) {
    var statusLabels = { active: 'Active', expired: 'Expired', pending: 'Pending' };

    var card = document.createElement('article');
    card.className = 'pp_rx_card';

    var medsHTML = rx.meds.map(function (med) {
        return '<span class="pp_med_pill">' + med.name + ' <b>' + med.dose + '</b></span>';
    }).join('');

    card.innerHTML =
        '<button class="pp_rx_summary" type="button">' +
            '<div class="pp_rx_left">' +
                '<div class="pp_rx_top_row">' +
                    '<span class="pp_status_pill status_' + rx.status + '">' + statusLabels[rx.status] + '</span>' +
                    '<span class="pp_rx_id">' + rx.id + '</span>' +
                '</div>' +
                '<span class="pp_rx_title">' + rx.title + '</span>' +
                '<span class="pp_rx_doctor">' + rx.doctor + '</span>' +
            '</div>' +
            '<div class="pp_rx_right">' +
                '<div class="pp_rx_meta">' +
                    '<span>' + rx.meds.length + ' medication' + (rx.meds.length > 1 ? 's' : '') + '</span>' +
                    '<span class="pp_rx_date">' +
                        '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                            '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>' +
                        '</svg>' +
                        rx.date +
                    '</span>' +
                '</div>' +
                '<svg class="pp_rx_chevron" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                    '<polyline points="9 18 15 12 9 6"/>' +
                '</svg>' +
            '</div>' +
        '</button>' +
        '<div class="pp_rx_details">' +
            '<div class="pp_rx_details_inner">' +
                '<div class="pp_med_pills">' + medsHTML + '</div>' +
                '<p class="pp_rx_notes">Notes: ' + rx.notes + '</p>' +
            '</div>' +
        '</div>';

    // Toggling open/closed, plus animating the max-height so it
    // actually slides instead of snapping instantly.
    var summaryButton = card.querySelector('.pp_rx_summary');
    var detailsPanel = card.querySelector('.pp_rx_details');

    summaryButton.addEventListener('click', function () {
        var isOpen = card.classList.toggle('is_open');
        detailsPanel.style.maxHeight = isOpen ? detailsPanel.scrollHeight + 'px' : null;
    });

    return card;
}


// ---------------------------------------------------------
// 5. TOAST HELPER (same pattern as the other pages)
// ---------------------------------------------------------
function showToast(message) {
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(function () {
        toast.classList.add('is_visible');
    }, 10);

    setTimeout(function () {
        toast.classList.remove('is_visible');
        setTimeout(function () {
            toast.remove();
        }, 300);
    }, 2500);
}