# 🎫 Serverless QR Ticket Scanner (Google Sheets Architecture)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Google Apps Script](https://img.shields.io/badge/Google_Apps_Script-4285F4?style=for-the-badge&logo=google&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=GitHub-Pages&logoColor=white)

A lightweight, fully serverless QR code scanning and event attendance system. This project utilizes a static HTML/JS frontend hosted on GitHub Pages and a Google Sheets backend powered by Google Apps Script, functioning as a RESTful API. 

This tool is designed to be completely free to host, highly accessible, and perfect for managing check-ins across multiple days or sub-events using a multi-sheet database structure.

---

## 🏗️ System Architecture

This project is divided into two primary micro-components that communicate over HTTP:

### 1. The Frontend (`index.html`)
The client-side interface is a lightweight static webpage that handles the user experience and hardware interaction.
* **Camera API Integration:** Requests camera permissions and continuously scans the video feed for QR code matrices.
* **Data Processing:** Once a QR code is decoded, the JavaScript extracts the ticket identifier.
* **Asynchronous Communication:** Uses the `Fetch API` to send asynchronous HTTP GET/POST requests to the Google Apps Script endpoint.
* **UI Feedback:** Dynamically updates the DOM to display success (green screen/checkmark), duplicate scan warnings, or invalid ticket errors without reloading the page.

### 2. The Backend (`Attendance_sheet_DB` & Google Apps Script)
Instead of a traditional SQL database, this project turns a Google Spreadsheet into a cloud database.
* **Data Storage:** The spreadsheet acts as the database. It can handle multiple sheets (tabs) for different event days or parallel sessions.
* **Google Apps Script (The API):** A `.gs` script acts as the middleware. It receives the HTTP requests from the frontend, searches the spreadsheet for the matching QR string, marks the user as "Present" (along with a timestamp), and returns a JSON response back to the frontend dictating the success or failure of the operation.

---

## ✨ Key Features
* **Zero-Cost Hosting:** Runs entirely on GitHub Pages and Google Workspace.
* **Real-Time Synchronization:** Check-ins are instantly visible in the Google Sheet, allowing event managers to monitor attendance live.
* **Cross-Platform:** Works on any device with a web browser and a camera (Android, iOS, Laptops) without requiring app store installation.
* **Multi-Sheet Support:** Easily adaptable for complex events with multiple check-in points or distinct days.

---

## 🚀 How to Set Up and Deploy Your Own Instance

Follow these steps to deploy this scanner for your own event.

### Step 1: Configure the Google Sheet Backend
1. Create a new Google Sheet. This will be your `Attendance_sheet_DB`.
2. Set up your columns (e.g., `Name`, `Ticket_ID`, `Status`, `Check-in Time`).
3. In the Google Sheets menu, click on **Extensions > Apps Script**.
4. Delete the default code and paste the backend scripts provided in this repository (Code.gs, menu.gs, IndexDB.html, JavaScript.html, CSS.html, QrReaderJS.html, Form.html).
5. Save the project.

### Step 2: Deploy the Apps Script as a Web App
This step generates the API URL that your frontend will talk to.
1. In the Apps Script editor, click the **Deploy** button (top right) and select **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. **Configuration:**
   * **Execute as:** `Me` (your Google account).
   * **Who has access:** `Anyone` *(Crucial: If you do not set this to "Anyone", the frontend will get blocked by CORS errors).*
4. Click **Deploy**. Authorize the permissions when prompted.
5. Copy the generated **Web app URL** (it ends in `/exec`).

### Step 3: Connect the Frontend
1. Fork this repository or download the `index.html` file to your local machine.
2. Open `index.html` in your preferred code editor.
3. Locate the JavaScript variable that stores the API URL (usually named something like `const API_URL = "YOUR_LINK_HERE";`).
4. Replace the placeholder string with the **Web app URL** you copied in Step 2.
5. Save the file.

### Step 4: Host on GitHub Pages
1. Push your updated `index.html` to your GitHub repository.
2. Go to your repository **Settings**.
3. On the left sidebar, click on **Pages**.
4. Under **Build and deployment**, select the `main` branch (or whichever branch holds your `index.html`) and click **Save**.
5. Wait 1-2 minutes. GitHub will provide you with a live link (e.g., `https://yourusername.github.io/your-repo-name`).

### Step 5: Start Scanning!
Open the GitHub Pages link on your mobile phone, grant camera permissions, and point it at a generated QR code. You will see the spreadsheet update in real-time!

---

## 🛠️ Customization & Extensibility
* **Styling:** The `index.html` can be easily themed using standard CSS to match your event's branding.
* **Data Fields:** If you add more columns to your Google Sheet, simply update the Apps Script backend to read/write to those new column indexes.

---

## Want a preview of the Scanner? click the link below
Link: https://georgeboukoubalas.github.io/event-qr-scanner/

## General Purpose of how to use the scanner for ESNers
Πώς σκανάρουμε τα καρτελάκια;

Γεια σας παιδιά! Εδώ είναι ένας γρήγορος οδηγός για το πώς θα κάνουμε το check-in γρήγορα και εύκολα. Δεν χρειάζεται καμία τεχνική γνώση, όλα γίνονται αυτόματα!

Πώς χρησιμοποιούμε το Scanner στο κινητό

1.Ανοίγουμε το Link: Yours github page link
Πατήστε το link του scanner που έχουμε στο group. Όταν ο browser σας ζητήσει πρόσβαση στην κάμερα, πατήστε «Επιτρέπεται» (Allow) για να ανοίξει η κάμερα.
2.Διαλέγουμε Μέρα και Session:
Από τα δύο μενού, επιλέξτε τη σωστή μέρα (π.χ. Day 1) και το τρέχον session (π.χ. Main Workshop). Αυτό χρειάζεται να το κάνετε μόνο μία φορά στην αρχή της βάρδιας σας! Το σύστημα θα κρατήσει τις επιλογές σας για όλους τους επόμενους.
3.Σκανάρουμε:
Κεντράρετε το QR code του συμμετέχοντα στην οθόνη. Μόλις η κάμερα το πιάσει, θα εμφανιστεί το όνομά του στο κουτάκι από κάτω και το κουμπί θα ενεργοποιηθεί.
4.Ολοκλήρωση Check-in:
Πατήστε το μπλε κουμπί Check In Attendee. Μόλις δείτε το πράσινο μήνυμα στην οθόνη ότι αποθηκεύτηκε, η κάμερα είναι ξανά έτοιμη να σκανάρει το επόμενο άτομο.

Πώς τσεκάρουμε το Google Sheet (Αν χρειαστεί)
Αν θέλετε να σιγουρευτείτε ότι το σκανάρισμα πέρασε κανονικά στο σύστημα, κάνουμε το εξής: (xexexe oxi toso eukola)
Βρίσκουμε τη σωστή μέρα: Ανοίγουμε το link του Google Sheet και πάμε στα tabs (καρτέλες) κάτω-κάτω. Πατάμε στη μέρα που βρισκόμαστε (π.χ. Day 1).
Ελέγχουμε τις τελευταίες εγγραφές: Σκρολάρουμε στο τέλος της λίστας.
Επιβεβαίωση: Η τελευταία γραμμή θα πρέπει να γράφει την ακριβή ώρα που μόλις κάνατε το scan, το Session που δηλώσατε και το όνομα του ατόμου. Αν τα βλέπετε, όλα έχουν δουλέψει ρολόι!
Καλή βάρδια και πάμε δυνατά!

## 📄 License
This project is open-source and available under the [MIT License](LICENSE). Feel free to fork, modify, and use it for your own events!

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
