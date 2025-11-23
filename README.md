# GreenyCredit

This project is a simple banking website built using HTML, CSS, and JavaScript, with PHP used only for sending email via SMTP. The website includes multiple pages such as Home, About, Loans, Deposits, and Contact.

# 📁 Project Structure
Bank Website/
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
├── about.html
├── contact.html
├── deposits.html
├── email-providers.md
├── index.html
├── loans.html
│
├── server.php        (SMTP Mail Sender)
├── start-server.bat  (Optional local server script)
│
└── README.md

# 🌐 Overview
This is a static website created for a banking-related platform.
Users can browse different financial services, view details, and submit messages through the contact form.

The Contact Form uses PHP SMTP to send emails to the admin mailbox.

# ✨ Features
✔️ Fully static website (HTML + CSS + JS)

✔️ Multiple pages: Home, About, Loans, Deposits, Contact

✔️ Clean and responsive UI

✔️ PHP-based mail sending functionality

✔️ No database used

✔️ Easy to host on shared hosting or cPanel

# 📬 Contact Form (SMTP Email)
The contact page uses server.php to send email via an SMTP provider (e.g., Gmail, Outlook, custom SMTP).

How It Works

User fills the contact form.

Form data is submitted to server.php via POST.

PHP script uses SMTP credentials to send an email.

User receives a success or failure message.

# ⚙️ Setup Instructions
# 1️⃣ Download or Clone the Project
git clone https://github.com/your-repo/bank-website.git

# 2️⃣ Place Project in Server Environment

Because PHP is used, you must run the website on a server:

XAMPP / WAMP / LAMP
Place the project in:

htdocs/Bank Website/


Or upload to cPanel / Shared Hosting

# 3️⃣ Configure SMTP Settings

Open server.php and edit SMTP configuration:

$mail->Host = "smtp.yourprovider.com";
$mail->Username = "your-email@example.com";
$mail->Password = "yourpassword";
$mail->Port = 587; // or 465

# ▶️ Run the Website
✔️ On Localhost

Start Apache server using XAMPP and visit:

http://localhost/Bank Website/index.html

✔️ On Live Hosting

Upload all files and access via domain:

https://yourdomain.com

# 📦 Files Explained
File/Folder--->	Description
index.html--->	Homepage of the website
about.html--->	About the organization
loans.html--->	Loan information page
deposits.html	--->Deposit schemes page
contact.html--->	Contact form
server.php	--->PHP SMTP email handler
css/style.css--->	Website styling
js/script.js--->	Frontend JavaScript
email-providers.md--->	Notes about SMTP providers
start-server.bat	--->Optional local server launcher

# 📄 License

This project is for educational and demonstration purposes.
Modify and use freely as needed.
