// ==========================================
// FIREBASE CONFIG
// ==========================================

const firebaseConfig = {
  apiKey: "AIzaSyAIoGCsCkUF-obPcUK8iahya4cprnUKxn8",

  authDomain: "js-task-3-39703.firebaseapp.com",

  databaseURL:
    "https://js-task-3-39703-default-rtdb.asia-southeast1.firebasedatabase.app",

  projectId: "js-task-3-39703",

  storageBucket: "js-task-3-39703.firebasestorage.app",

  messagingSenderId: "567517803481",

  appId: "1:567517803481:web:27b2bb0ba340f257841fc8",
};

// Firebase initialize
firebase.initializeApp(firebaseConfig);

// Firebase Database
const database = firebase.database();

// contacts naam ka reference
const contactsRef = database.ref("contacts");

// ==========================================
// DOM ELEMENTS
// ==========================================

const contactList = document.getElementById("contactList");

const contactModal = document.getElementById("contactModal");

const contactForm = document.getElementById("contactForm");

// Firebase se aane wale contacts
let contacts = [];

// ==========================================
// GET / RETRIEVE CONTACTS
// ==========================================

function getContacts() {
  contactsRef.on("value", function (snapshot) {
    contacts = [];

    snapshot.forEach(function (childSnapshot) {
      const contact = childSnapshot.val();

      contacts.push({
        // Firebase ki generated key
        uid: childSnapshot.key,

        name: contact.name,

        email: contact.email,

        phone: contact.phone,
      });
    });

    // Firebase data UI mein show
    renderContacts();
  });
}

// ==========================================
// RENDER CONTACTS
// ==========================================

function renderContacts() {
  contactList.innerHTML = "";

  // Agar Firebase mein koi contact nahi
  if (contacts.length === 0) {
    contactList.innerHTML =
      '<p style="text-align:center; color:#888; padding:20px;">No contacts found.</p>';

    return;
  }

  contacts.forEach(function (contact) {
    const card = document.createElement("div");

    card.className = "contact-card";

    card.innerHTML = `

            <div class="contact-info">

              <h4>
                ${contact.name}
              </h4>

              <p>
                <i class="fa-solid fa-envelope"></i>
                ${contact.email}
              </p>

              <p>
                <i class="fa-solid fa-phone"></i>
                ${contact.phone}
              </p>

            </div>


            <div class="contact-actions">

              <button
                class="action-icon edit-icon"
                onclick="editContact('${contact.uid}')"
              >

                <i class="fa-solid fa-pen-to-square"></i>

              </button>


              <button
                class="action-icon delete-icon"
                onclick="deleteContact('${contact.uid}')"
              >

                <i class="fa-solid fa-trash"></i>

              </button>

            </div>

          `;

    contactList.appendChild(card);
  });
}

// ==========================================
// OPEN MODAL
// ==========================================

function openModal(editMode = false) {
  document.getElementById("modalTitle").innerText = editMode
    ? "Edit Contact"
    : "Add New Contact";

  contactModal.style.display = "flex";
}

// ==========================================
// CLOSE MODAL
// ==========================================

function closeModal() {
  contactModal.style.display = "none";

  contactForm.reset();

  document.getElementById("contactUid").value = "";
}

// ==========================================
// ADD / UPDATE CONTACT
// ==========================================

function handleFormSubmit(e) {
  e.preventDefault();

  // Firebase UID
  const uid = document.getElementById("contactUid").value;

  // Form values
  const name = document.getElementById("name").value.trim();

  const email = document.getElementById("email").value.trim();

  const phone = document.getElementById("phone").value.trim();

  // Contact object
  const contactData = {
    name: name,

    email: email,

    phone: phone,
  };

  // ======================================
  // EDIT
  // ======================================

  if (uid) {
    contactsRef
      .child(uid)
      .update(contactData)

      .then(function () {
        console.log("Contact updated successfully");

        closeModal();
      })

      .catch(function (error) {
        console.log("Update Error:", error);
      });
  }

  // ======================================
  // ADD
  // ======================================
  else {
    const newContactRef = contactsRef.push();

    newContactRef
      .set(contactData)

      .then(function () {
        console.log("Contact added successfully");

        closeModal();
      })

      .catch(function (error) {
        console.log("Add Error:", error);
      });
  }
}

// ==========================================
// EDIT CONTACT
// ==========================================

function editContact(uid) {
  const contact = contacts.find(function (c) {
    return c.uid === uid;
  });

  if (!contact) {
    return;
  }

  // Firebase UID hidden field mein
  document.getElementById("contactUid").value = contact.uid;

  // Existing data form mein
  document.getElementById("name").value = contact.name;

  document.getElementById("email").value = contact.email;

  document.getElementById("phone").value = contact.phone;

  // Edit modal open
  openModal(true);
}

// ==========================================
// DELETE CONTACT
// ==========================================

function deleteContact(uid) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this contact?",
  );

  if (!confirmDelete) {
    return;
  }

  contactsRef
    .child(uid)
    .remove()

    .then(function () {
      console.log("Contact deleted successfully");
    })

    .catch(function (error) {
      console.log("Delete Error:", error);
    });
}

// ==========================================
// GET DATA WHEN PAGE LOADS
// ==========================================

getContacts();
