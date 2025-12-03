const firebaseConfig = {
    apiKey: "AIzaSyDJLWNpy-aVUVFFeiK-IKaBEDF5Z8Ewwb0",
    authDomain: "student-teacher-appointm-5b12a.firebaseapp.com",
    projectId: "student-teacher-appointm-5b12a",
    storageBucket: "student-teacher-appointm-5b12a.firebasestorage.app",
    messagingSenderId: "272181489450",
    appId: "1:272181489450:web:7b0027b54b0adedd55f853",
    measurementId: "G-FE0T2H92VV"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const hidePass = document.querySelector(".hide-password");
const viewPass = document.querySelector(".view-password");
let index = document.querySelectorAll(".continue");
index.forEach((btn) => {
    btn.addEventListener("click", () => {
        if (btn.parentElement.classList.contains("student")) {
            window.open("student-login.html", "_blank");
            console.log("working");
        }
        else if (btn.parentElement.classList.contains("teacher")) {
            window.open("teacher-login.html", "_blank");
        }
        else if (btn.parentElement.classList.contains("admin")) {
            window.open("admin-login.html", "_blank");
        }
    });
});
function showPopup(message) {
    document.getElementById("popup-message").textContent = message;
    document.getElementById("popup").classList.remove("hidden");
}

const popupOk = document.getElementById("popup-ok");
if (popupOk) {
    popupOk.addEventListener("click", () => {
        document.getElementById("popup").classList.add("hidden");
    });
}

if (window.location.pathname.includes("student-login.html")) {
    function login() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            showPopup("Please enter both email and password.");
            return;
        }

        auth.signInWithEmailAndPassword(email, password)
            .then(async userCredential => {

                const user = userCredential.user;

                // Get role data from Firestore
                /*const userRef = firebase.firestore().collection("users").doc(user.uid);
                const userSnap = await userRef.get();
    
                if (!userSnap.exists) {
                    showPopup("Account data missing. Contact support.");
                    return;
                }
    
                const role = userSnap.data().role;
    
                if (role !== "student") {
                    showPopup("This login page is only for students.");
                    auth.signOut();
                    return;
                }
    
                const username = userSnap.data().username || "Student";*/

                // Load from STUDENTS collection
                const studentRef = firebase.firestore().collection("students").doc(user.uid);
                const studentSnap = await studentRef.get();

                if (!studentSnap.exists) {
                    showPopup("This account is not a student account.");
                    auth.signOut();
                    return;
                }

                const username = studentSnap.data().username || "Student";


                // Save username for dashboard
                localStorage.setItem("username", username);

                window.location.href = "student-dashboard.html";
            })

            .catch(error => {
                if (error.code === "auth/user-not-found") {
                    showPopup("No account found with this email.");
                }
                else if (error.code === "auth/wrong-password") {
                    showPopup("Incorrect password. Try again.");
                }
                else if (error.code === "auth/invalid-login-credentials") {
                    showPopup("Invalid email or password.");
                }
                else {
                    showPopup("Login failed. Please try again.");
                }
            });
    }

    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) loginBtn.addEventListener('click', login);

    viewPass.addEventListener("click", () => {
        viewPass.classList.add("hidden");
        hidePass.classList.remove("hidden");
        document.getElementById("password").type = "text";
    });
    hidePass.addEventListener("click", () => {
        viewPass.classList.remove("hidden");
        hidePass.classList.add("hidden");
        document.getElementById("password").type = "password";
    });
}


let registration = document.querySelector(".last-text a");
if (registration) {
    registration.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "student-registration.html";
    });
}

let loginPage = document.querySelector(".login-page a");
if (loginPage) {
    loginPage.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "student-login.html";
    });
};

function registerStudent() {
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const username = document.getElementById('reg-username').value;
    const confirm = document.getElementById('reg-confirm').value;

    if (!email || !password || !confirm || !username) {
        showPopup("Please fill all fields.");
        return;
    }
    if (password !== confirm) {
        showPopup("Passwords do not match.");
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then(async userCredential => {

            const user = userCredential.user;

            try {
                // Save username in Firestore
                await firebase.firestore().collection("students").doc(user.uid).set({
                    username: username,
                    email: email
                });


                // Save in localStorage
                localStorage.setItem("username", username);
                showPopup("Registration successful!");

                setTimeout(() => {
                    window.location.href = "student-login.html";
                }, 1500);

            } catch (error) {
                console.error("Firestore write failed:", error);
                showPopup("Registration failed. Try again.");
            }
        })
        .catch(error => {
            if (error.code === "auth/email-already-in-use") {
                showPopup("Email already used. Try logging in.");
            }
            else if (error.code === "auth/weak-password") {
                showPopup("Password should be at least 6 characters.");
            }
            else if (error.code === "auth/invalid-email") {
                showPopup("Invalid email format.");
            }
            else {
                showPopup("Registration failed. Try again.");
            }
        });

}
const home = document.querySelector(".home");
if (home) {
    home.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}

const registerBtn = document.getElementById("register-btn");
if (registerBtn) registerBtn.addEventListener("click", registerStudent);

function forgotPassword() {
    const email = document.getElementById("email").value;

    if (!email) {
        showPopup("Please enter your email first.");
        return;
    }

    auth.sendPasswordResetEmail(email)
        .then(() => {
            showPopup("Password reset email sent! Check your inbox.");
        })
        .catch(error => {
            if (error.code === "auth/user-not-found") {
                showPopup("No user found with this email.");
            } else if (error.code === "auth/invalid-email") {
                showPopup("Enter a valid email.");
            } else {
                showPopup("Failed to send reset email. Try again.");
            }
        });
}
const forgot = document.querySelector(".forgot");
if (forgot) {
    forgot.addEventListener("click", forgotPassword);
}


// --- Student Dashboard Username Loader ---
// Run this ONLY on student-dashboard.html
if (window.location.pathname.includes("student-dashboard.html")) {

    auth.onAuthStateChanged(async (user) => {
        if (!user) return;

        const doc = await firebase.firestore()
            .collection("students")
            .doc(user.uid)
            .get();

        if (doc.exists) {
            console.log("Loaded student doc:", doc.data());

            const username = doc.data().username;
            document.querySelector(".welcome p").innerHTML = "Welcome, " + username;
            localStorage.setItem("username", username);
        } else {
            console.log("No student data found for this user.");
        }
    });
}

let select = document.querySelectorAll(".selected");
let rightDown = document.querySelector(".right-down p");
let cancel = document.querySelector(".cancel");
select.forEach((s) => {
    s.addEventListener("click", () => {
        document.querySelectorAll(".teacher-card").forEach(card => {
            select.style.border = "";
        });
        let teacherName = s.parentElement.querySelector("p").innerText;
        s.parentElement.style.border = "2px solid #3b82f6";
        rightDown.innerHTML = `Schedule a meeting with, ${teacherName}`;
        document.querySelector(".right-down").classList.remove("hidden");

        cancel.addEventListener("click", () => {
            document.querySelector(".right-down").classList.add("hidden");
            s.parentElement.style.border = "";
        });
    });
});

let logout = document.querySelector(".logout");

if (logout) {
    logout.addEventListener("click", () => {
        firebase.auth().signOut()
            .then(() => {
                window.location.href = "student-login.html";
            })
            .catch(error => {
                console.error("Logout Error:", error);
            });
    });
};

let logoutTeacher = document.querySelector(".logout-teacher");

if (logoutTeacher) {
    logoutTeacher.addEventListener("click", () => {
        firebase.auth().signOut()
            .then(() => {
                window.location.href = "teacher-login.html";
            })
            .catch(error => {
                console.error("Logout Error:", error);
            });
    });
};



// --- Teacher Login Code ---
if (window.location.pathname.includes("teacher-login.html")) {

    function showPopup(message) {
        document.getElementById("popup-message").textContent = message;
        document.getElementById("popup").classList.remove("hidden");
    }

    const popupOk = document.getElementById("popup-ok");
    popupOk.addEventListener("click", () => {
        document.getElementById("popup").classList.add("hidden");
    });

    function loginTeacher() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            showPopup("Please enter both email and password.");
            return;
        }

        auth.signInWithEmailAndPassword(email, password)
            .then(async userCredential => {

                const user = userCredential.user;

                // Load teacher record
                const teacherRef = firebase.firestore().collection("teachers").doc(user.uid);
                const teacherSnap = await teacherRef.get();

                if (!teacherSnap.exists) {
                    showPopup("This account is not registered as a teacher.");
                    auth.signOut();
                    return;
                }

                const username = teacherSnap.data().username || "Teacher";

                localStorage.setItem("teacherName", username);

                window.location.href = "teacher-dashboard.html";
            })
            .catch(error => {
                if (error.code === "auth/user-not-found") {
                    showPopup("No account found with this email.");
                } else if (error.code === "auth/wrong-password") {
                    showPopup("Incorrect password. Try again.");
                } else {
                    showPopup("Login failed. Please try again.");
                }
                console.log(error);
            });
    }

    // Login button
    const loginBtn = document.getElementById('login-btn');
    loginBtn.addEventListener('click', loginTeacher);

    // Forgot password
    const forgot = document.querySelector(".forgot");
    forgot.addEventListener("click", () => {
        const email = document.getElementById("email").value;

        if (!email) {
            showPopup("Enter your email first.");
            return;
        }

        auth.sendPasswordResetEmail(email)
            .then(() => showPopup("Password reset email sent!"))
            .catch(() => showPopup("Could not send reset link."));
    });

    // Home button
    const home = document.querySelector(".home");
    home.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    viewPass.addEventListener("click", () => {
        viewPass.classList.add("hidden");
        hidePass.classList.remove("hidden");
        document.getElementById("password").type = "text";
    });
    hidePass.addEventListener("click", () => {
        viewPass.classList.remove("hidden");
        hidePass.classList.add("hidden");
        document.getElementById("password").type = "password";
    });

}

if (window.location.pathname.includes("teacher-dashboard.html")) {
    // Run this after page loads
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            // Fetch teacher doc
            const doc = await firebase.firestore().collection("teachers").doc(user.uid).get();

            if (doc.exists) {
                const teacherName = doc.data().name; // or .username if you saved it like that
                document.querySelector(".teacher-welcome").textContent = "Welcome, " + teacherName;
            } else {
                console.log("Teacher document not found");
            }
        } else {
            // Not logged in
            window.location.href = "teacher-login.html";
        }
    });

}


// --- Admin Login Code ---
if (window.location.pathname.includes("admin-login.html")) {

    function showPopup(message) {
        document.getElementById("popup-message").textContent = message;
        document.getElementById("popup").classList.remove("hidden");
    }

    const popupOk = document.getElementById("popup-ok");
    popupOk.addEventListener("click", () => {
        document.getElementById("popup").classList.add("hidden");
    });

    async function loginAdmin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            showPopup("Please enter both email and password.");
            return;
        }

        try {

            // Authenticate admin
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Check admin record
            const adminRef = firebase.firestore().collection("admin").doc(user.uid);
            const adminSnap = await adminRef.get();

            if (!adminSnap.exists) {
                showPopup("This account is not registered as an admin.");
                await auth.signOut();
                return;
            }

            // Ensure role: "admin" is present
            if (!adminSnap.data().role) {
                await adminRef.update({
                    role: "admin"
                });
            }

            // Save locally
            const adminName = adminSnap.data().username || "Admin";
            localStorage.setItem("adminName", adminName);

            window.location.href = "admin-dashboard.html";

        } catch (error) {
            if (error.code === "auth/user-not-found") {
                showPopup("No account found with this email.");
            }
            else if (error.code === "auth/wrong-password") {
                showPopup("Incorrect password. Try again.");
            }
            else {
                showPopup("Login failed. Try again.");
            }
            console.log(error);
        }
    }

    const loginBtn = document.getElementById("login-btn");
    loginBtn.addEventListener("click", loginAdmin);

    const forgot = document.querySelector(".forgot");
    forgot.addEventListener("click", () => {
        const email = document.getElementById("email").value;

        if (!email) {
            showPopup("Enter your email first.");
            return;
        }

        auth.sendPasswordResetEmail(email)
            .then(() => showPopup("Password reset email sent!"))
            .catch(() => showPopup("Could not send reset email."));
    });

    const home = document.querySelector(".home");
    home.addEventListener("click", () => {
        window.location.href = "index.html";
    });

        viewPass.addEventListener("click", () => {
        viewPass.classList.add("hidden");
        hidePass.classList.remove("hidden");
        document.getElementById("password").type = "text";
    });
    hidePass.addEventListener("click", () => {
        viewPass.classList.remove("hidden");
        hidePass.classList.add("hidden");
        document.getElementById("password").type = "password";
    });
}






//Admin dashboard

if (window.location.pathname.includes("admin-dashboard.html")) {

    const addBtn = document.querySelector(".add-teacher");
    const popup = document.querySelector(".teacher-details");
    const cancelBtn = document.querySelector("#cancel-add");
    const saveBtn = document.querySelector("#save-add");
    const tbody = document.querySelector("#teachers-body");
    const blur = document.querySelector(".blur-content");

    // OPEN POPUP
    addBtn.addEventListener("click", () => {
        popup.classList.remove("hidden");
        blur.classList.add("blur");
    });

    // CLOSE POPUP
    cancelBtn.addEventListener("click", () => {
        popup.classList.add("hidden");
        blur.classList.remove("blur");
    });

    // REAL-TIME LISTENER — ADMIN CAN SEE ALL TEACHERS
    firebase.firestore().collection("teachers")
        .orderBy("name")
        .onSnapshot((snapshot) => {

            const tbody = document.querySelector("#teachers-body");
            tbody.innerHTML = ""; // clear

            snapshot.forEach(doc => {
                const t = doc.data();

                tbody.innerHTML += `
                <tr>
                    <td>${t.name}</td>
                    <td>${t.email}<br>${t.phone}</td>
                    <td>${t.subject}</td>
                    <td>${t.joinDate}</td>
                    <td class="actions">
                        <i class="fa-solid fa-pen" style="color:#74C0FC;"></i>
                        <i class="fa-solid fa-trash delete-teacher" 
                           data-id="${doc.id}" 
                           style="color:#f00;"></i>
                    </td>
                </tr>
            `;
            });
        });



    // ADD TEACHER TO FIREBASE
    saveBtn.addEventListener("click", async () => {

        let name = document.getElementById("t-name").value;
        let email = document.getElementById("t-email").value;
        let phone = document.getElementById("t-phone").value;
        let subject = document.getElementById("t-subject").value;
        let join = document.getElementById("t-join").value;

        if (!name || !email || !phone || !subject || !join) {
            alert("Please fill all fields!");
            return;
        }

        // convert yyyy-mm-dd -> dd/mm/yyyy
        const d = join.split("-");
        let formattedDate = `${d[2]}/${d[1]}/${d[0]}`;

        // 1. Create Auth user
        firebase.auth().createUserWithEmailAndPassword(email, "teacher@123")
            .then((cred) => {
                const uid = cred.user.uid;

                // 2. Save to Firestore
                return firebase.firestore().collection("teachers").doc(uid).set({
                    name,
                    email,
                    phone,
                    subject,
                    joinDate: formattedDate,
                    role: "teacher"
                });
            })
            .then(() => {

                // RESET FIELDS
                document.getElementById("t-name").value = "";
                document.getElementById("t-email").value = "";
                document.getElementById("t-phone").value = "";
                document.getElementById("t-subject").value = "";
                document.getElementById("t-join").value = "";

                popup.classList.add("hidden");
                blur.classList.remove("blur");

                alert("Teacher added! Default password: teacher@123");
            })
            .catch((err) => alert(err.message));
    });
}










