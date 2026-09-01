/* =========================================================
   Care Nova — Doctor Portal Script
   -------------------------------------------------------
   Everything on this page runs off the "patients" object
   below — it's fake data standing in for a real database.
   When a real backend exists, this whole object gets deleted
   and replaced with something like:
       fetch('/api/patients').then(res => res.json())
   ...but every function below (renderPatient, the search
   filter, etc.) will still work the same way, because they
   just expect "a patient object shaped like this" — they
   don't care whether it came from this file or a server.
   ========================================================= */

// ---------------------------------------------------------
// 1. FAKE DATABASE
// ---------------------------------------------------------
// Each key (e.g. "sarah-chen") matches a data-patient-id
// attribute on a sidebar button in the HTML.
var patients = {

    'sarah-chen': {
        initials: 'SC',
        name: 'Sarah Chen',
        mrn: 'MRN-004821',
        dob: 'Apr 15, 1982 (44 yrs)',
        bloodType: 'A+',
        lastVisit: 'Jul 28, 2026',
        allergies: 'Penicillin, Sulfa drugs',
        prescriptions: [
            {
                status: 'active',
                id: 'RX001',
                title: 'Essential hypertension (I10)',
                dateFrom: 'Jul 28, 2026',
                dateTo: 'Expires Jan 28, 2027',
                meds: [
                    { name: 'Lisinopril', dose: '10 mg' },
                    { name: 'Amlodipine', dose: '5 mg' }
                ],
                notes: 'Monitor blood pressure weekly. Return if readings exceed 160/100 mmHg.'
            },
            {
                status: 'complete',
                id: 'RX000',
                title: 'Seasonal allergic rhinitis (J30.2)',
                dateFrom: 'Mar 2, 2026',
                dateTo: 'Completed Apr 2, 2026',
                meds: [
                    { name: 'Cetirizine', dose: '10 mg' }
                ],
                notes: 'Course completed. Follow up only if symptoms return.'
            }
        ]
    },

    'marcus-williams': {
        initials: 'MW',
        name: 'Marcus Williams',
        mrn: 'MRN-003142',
        dob: 'Feb 2, 1975 (51 yrs)',
        bloodType: 'O-',
        lastVisit: 'Aug 10, 2026',
        allergies: 'None known',
        prescriptions: [
            {
                status: 'active',
                id: 'RX003',
                title: 'Type 2 diabetes mellitus (E11)',
                dateFrom: 'Aug 10, 2026',
                dateTo: 'Expires Feb 10, 2027',
                meds: [
                    { name: 'Metformin', dose: '500 mg' }
                ],
                notes: 'Recheck HbA1c in 3 months. Reinforce dietary guidance.'
            }
        ]
    },

    'elena-rossi': {
        initials: 'ER',
        name: 'Elena Rossi',
        mrn: 'MRN-007563',
        dob: 'Nov 30, 1990 (35 yrs)',
        bloodType: 'B+',
        lastVisit: 'Aug 20, 2026',
        allergies: 'Latex',
        prescriptions: [
            {
                status: 'active',
                id: 'RX004',
                title: 'Hypothyroidism (E03.9)',
                dateFrom: 'Aug 20, 2026',
                dateTo: 'Expires Feb 20, 2027',
                meds: [
                    { name: 'Levothyroxine', dose: '75 mcg' }
                ],
                notes: 'Recheck TSH levels in 6 weeks.'
            }
        ]
    },

    'james-okafor': {
        initials: 'JO',
        name: 'James Okafor',
        mrn: 'MRN-001987',
        dob: 'Jun 5, 1968 (58 yrs)',
        bloodType: 'AB+',
        lastVisit: 'Jul 5, 2026',
        allergies: 'Shellfish',
        prescriptions: [
            {
                status: 'active',
                id: 'RX005',
                title: 'Atrial fibrillation (I48.91)',
                dateFrom: 'Jul 5, 2026',
                dateTo: 'Expires Jan 5, 2027',
                meds: [
                    { name: 'Apixaban', dose: '5 mg' }
                ],
                notes: 'Watch for signs of unusual bleeding or bruising.'
            }
        ]
    }

};


// ---------------------------------------------------------
// 2. RUN EVERYTHING ONCE THE PAGE HAS LOADED
// ---------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {

    // Show Sarah Chen's data first, since her sidebar item
    // already starts with the "is_active" class in the HTML.
    renderPatient('sarah-chen');

    // Clicking any patient in the sidebar swaps the main panel.
    var patientButtons = document.querySelectorAll('.dp_patient_item');
    patientButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            var id = button.getAttribute('data-patient-id');
            renderPatient(id);
            setActiveButton(button);
        });
    });

    // Typing in the search box filters the sidebar list live.
    var searchInput = document.getElementById('patientSearchInput');
    searchInput.addEventListener('input', function () {
        filterPatientList(searchInput.value);
    });

    // Logo click — takes you back to the login screen, same
    // idea as clicking a site logo on any real web app.
    document.getElementById('brandLogoBtn').addEventListener('click', function () {
        window.location.href = 'index.html';
    });

    // Back button — uses the browser's own history, so it goes
    // wherever you actually came from (works for real, no fake
    // data needed).
    document.getElementById('backBtn').addEventListener('click', function () {
        window.history.back();
    });

    // Home / Info / Help — no pages built for these yet.
    document.querySelectorAll('.dp_nav_link').forEach(function (link) {
        link.addEventListener('click', function () {
            showToast(link.getAttribute('data-page') + ' page coming soon!');
        });
    });

    // "New Prescription" — no backend yet, so just confirm the click.
    document.getElementById('newRxBtn').addEventListener('click', function () {
        showToast('Demo only — connect a backend to actually save a new prescription.');
    });

    // Logout — same idea, nothing to actually log out of yet.
    document.getElementById('logoutBtn').addEventListener('click', function () {
        showToast('Logged out (demo) — this would end a real session.');
    });

    // The Edit buttons are created dynamically inside prescription
    // cards, so instead of attaching a listener to each one (which
    // wouldn't work for cards added later), we listen on the
    // container that holds all of them. This is called "event
    // delegation" — the click "bubbles up" to a parent we're
    // already listening on.
    document.getElementById('rxList').addEventListener('click', function (event) {
        // event.target is whatever was actually clicked — but the
        // click might have landed on the SVG icon inside the
        // button rather than the button itself, so we use
        // .closest() to find the nearest .dp_edit_btn ancestor.
        var editButton = event.target.closest('.dp_edit_btn');
        if (editButton) {
            showToast('Demo only — editing would open a real form here.');
        }
    });

});


// ---------------------------------------------------------
// 3. RENDER FUNCTIONS
// ---------------------------------------------------------

/**
 * renderPatient(id)
 * ------------------------------------------------------
 * Looks up a patient by id and fills every part of the main
 * panel with their data — header, info grid, allergy banner,
 * and the list of prescription cards.
 */
function renderPatient(id) {
    var patient = patients[id];
    if (!patient) {
        return; // Unknown id — nothing to show, so just stop here.
    }

    document.getElementById('patientAvatar').textContent = patient.initials;
    document.getElementById('patientName').textContent = patient.name;
    document.getElementById('patientMrn').textContent = patient.mrn;

    document.getElementById('infoDob').textContent = patient.dob;
    document.getElementById('infoBlood').textContent = patient.bloodType;
    document.getElementById('infoLastVisit').textContent = patient.lastVisit;
    document.getElementById('infoAllergies').textContent = patient.allergies;

    // Only show the big amber allergy warning banner if the
    // patient actually has an allergy on file.
    var allergyAlert = document.getElementById('allergyAlert');
    if (patient.allergies && patient.allergies.toLowerCase() !== 'none known') {
        document.getElementById('allergyAlertText').textContent = patient.allergies;
        allergyAlert.style.display = 'flex';
    } else {
        allergyAlert.style.display = 'none';
    }

    renderPrescriptions(patient.prescriptions);
}

/**
 * renderPrescriptions(prescriptions)
 * ------------------------------------------------------
 * Rebuilds the "Prescriptions" section from scratch every
 * time — clears out whatever cards were there before, then
 * builds one new card per prescription.
 */
function renderPrescriptions(prescriptions) {
    var rxList = document.getElementById('rxList');
    rxList.innerHTML = ''; // Clear out the previous patient's cards.

    var activeCount = prescriptions.filter(function (rx) {
        return rx.status === 'active';
    }).length;

    document.getElementById('rxMeta').textContent =
        activeCount + ' active · ' + prescriptions.length + ' total';

    prescriptions.forEach(function (rx) {
        rxList.appendChild(buildRxCard(rx));
    });
}

/**
 * buildRxCard(rx)
 * ------------------------------------------------------
 * Builds one prescription <article> element from a
 * prescription object. Uses the exact same class names as
 * the original hand-written HTML, so it looks identical —
 * just generated instead of typed out.
 */
function buildRxCard(rx) {
    var article = document.createElement('article');
    article.className = 'dp_rx_card';

    var statusLabel = rx.status === 'active' ? 'Active' : 'Completed';
    var statusClass = rx.status === 'active' ? '' : 'is_complete';

    var medsHTML = rx.meds.map(function (med) {
        return '<span class="dp_med_pill">' + med.name + ' <b>' + med.dose + '</b></span>';
    }).join('');

    article.innerHTML =
        '<div class="dp_rx_top">' +
            '<div class="dp_rx_top_left">' +
                '<span class="dp_status_pill ' + statusClass + '">' + statusLabel + '</span>' +
                '<span class="dp_rx_id">' + rx.id + '</span>' +
            '</div>' +
            '<button class="dp_edit_btn" type="button">' +
                '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                    '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>' +
                '</svg>' +
                'Edit' +
            '</button>' +
        '</div>' +
        '<h3 class="dp_rx_title">' + rx.title + '</h3>' +
        '<div class="dp_rx_dates">' +
            '<span>' + rx.dateFrom + '</span>' +
            '<span class="dp_rx_arrow">→</span>' +
            '<span>' + rx.dateTo + '</span>' +
        '</div>' +
        '<div class="dp_med_pills">' + medsHTML + '</div>' +
        '<p class="dp_rx_notes">Notes: ' + rx.notes + '</p>';

    return article;
}

/**
 * setActiveButton(clickedButton)
 * ------------------------------------------------------
 * Removes the "is_active" highlight from every sidebar
 * button, then adds it back only to the one just clicked.
 */
function setActiveButton(clickedButton) {
    document.querySelectorAll('.dp_patient_item').forEach(function (button) {
        button.classList.remove('is_active');
    });
    clickedButton.classList.add('is_active');
}

/**
 * filterPatientList(query)
 * ------------------------------------------------------
 * Hides sidebar patients whose name AND mrn both fail to
 * match the typed query. Case-insensitive.
 */
function filterPatientList(query) {
    var lowerQuery = query.trim().toLowerCase();

    document.querySelectorAll('#patientList > li').forEach(function (listItem) {
        var name = listItem.querySelector('.dp_patient_name').textContent.toLowerCase();
        var mrn = listItem.querySelector('.dp_patient_mrn').textContent.toLowerCase();
        var matches = name.includes(lowerQuery) || mrn.includes(lowerQuery);
        listItem.style.display = matches ? '' : 'none';
    });
}


// ---------------------------------------------------------
// 4. TOAST HELPER (same pattern as the login page's script.js)
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