# ISDF_Exp1
Name: Aryan Divekar <br>
Roll no: 16030726007 <br>
Subject: CSL2 (ISDF)<br>
College: K.J Somaiya College of Engineering, Vidyavihar. <br><br>
This contains:<br> 1. Password Strength analysis,<br> 2. Password Security (Hashing &amp; Salting),<br>  3. CAPTCHA generation<br><br>
Aim: Implementation of Various Security features.<br>

Objeective:<br> 1) Implementation of CAPTCHA<br>
            2) Implementation of password strength checking<br>
            3) Implementation of password hashing and use of salting

### 1) How to Implement CAPTCHA

I have implemented CAPTCHA using **HTML, CSS, and JavaScript**. To run the project, directly open the required HTML file using **Live Server** in Visual Studio Code. This will open the CAPTCHA landing page in the web browser.

I have created **three different HTML files for three different types of CAPTCHA**. Each file implements a different CAPTCHA approach, allowing the user to test and compare the different CAPTCHA mechanisms.

### 2) How to Implement Password Strength Analysis

I have implemented password strength analysis using **HTML and JavaScript**. The project consists of an HTML file along with JavaScript code that analyzes the strength of the entered password.

To run the project, simply open the HTML file using **Live Server** in Visual Studio Code. The Live Server will open the application's landing page in the browser.

Once the landing page is opened, the user can enter a password and easily check its strength. The JavaScript analyzes different characteristics of the password, such as its length, use of uppercase and lowercase letters, numbers, and special characters, and then determines whether the password is **Weak, Medium, or Strong**.

### 3) How to Implement Password Hashing and Use of Salting:

I have implemented password hashing and salting using **Node.js**. First, I open the project directory in the terminal and navigate to the folder containing the `server.js` file. Then, I run the following command:

```bash
node server.js
```

This starts the Node.js server. After the server starts successfully, the application can be accessed through the browser. The basic URL `http://localhost:3000` is not sufficient to open the registration page directly. Therefore, the registration page is accessed using:

```text
http://localhost:3000/register.html
```

This page allows users to register with a username and password. During registration, a unique random **salt** is generated for each password, and the password is hashed using **PBKDF2 with SHA-512** before being stored in the SQLite database. The original password is never stored directly.

The generated salt and password hash are stored in the SQLite database and are later used during login to verify whether the entered password is correct. This provides better security compared to storing plain-text passwords.

### Conclusion

Through this experiment, I got a better understanding of how different security measures actually work in a real application. By implementing CAPTCHA, I learned how it can help prevent bots from accessing a website, while the password strength checker showed me how simple rules can encourage users to create stronger passwords.

I also understood why storing passwords directly in a database is not safe. Working with hashing and salting helped me see how passwords can be stored more securely without keeping the original password. Implementing these concepts myself made the difference between plain-text passwords and properly protected passwords much clearer to me.

Overall, this experiment helped me connect the security concepts I learned in theory with their practical implementation. It also gave me a better idea of how CAPTCHA, password strength checking, hashing, and salting can be used together to make an application more secure.

