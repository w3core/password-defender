PasswordDefender
================

[PasswordDefender](https://w3core.github.io/password-defender "PasswordDefender mobile version") is the tiny
bookmark script which allows to create unique strong one-side password for each
unique site by using your master password 

![PasswordDefender widget](https://rawgit.com/w3core/password-defender/master/src/site/img/controls.png "PasswordDefender widget elements")

Features
--------
+ A unique one-way password for each site by using your single master password
+ The generated password is extra strong and long independently by length of
  master password
+ Does not require any registration, storage and any extentions
+ Cross browser support (Note: The mobile version can be found [here](https://w3core.github.io/password-defender "PasswordDefender mobile version"))
+ Offline mode support
+ Extra simple for usage

Installation
------------
1. Create new bookmark in most visible space of your browser 
   ![Installation](https://rawgit.com/w3core/password-defender/master/src/site/img/install-step-0.png)
   ![Installation](https://rawgit.com/w3core/password-defender/master/src/site/img/install-step-1.png)
2. Set name of the bookmark as "Password" or somthing like that
3. Copy to the clipboard content of [bookmark.js](https://github.com/w3core/password-defender/blob/master/bookmark.js) file
4. Set location URL of the bookmark (paste from clipboard)
   ![Installation](https://rawgit.com/w3core/password-defender/master/src/site/img/install-step-2.png)

Usage
-----
1. Open the site on which you want to "sign-in" or "sign-up"
2. Tap to the "Password" bookmark
   ![Usage](https://rawgit.com/w3core/password-defender/master/src/site/img/usage-step-0.png)
3. You can see the "Password" widget in left-top side of page
4. Enter your master password to the password field of the widget
   ![Usage](https://rawgit.com/w3core/password-defender/master/src/site/img/usage-step-1.png)
5. Tap to the password field on "sign-in" or "sign-up" form of the page
   ![Usage](https://rawgit.com/w3core/password-defender/master/src/site/img/usage-step-2.png)
6. Tap to the [▸] button on the widget
   (encrypted password will be inserted to the password field)
   ![Usage](https://rawgit.com/w3core/password-defender/master/src/site/img/usage-step-3.png)

Also you can see or copy your encrypted password if you need
![Usage](https://rawgit.com/w3core/password-defender/master/src/site/img/usage-view-password.png)

How to use it on mobile gadget?
-------------------------------
Unfortunately, at now mobile gadgets does not provides full functionality of bookmarks. 
So for mobile gadgets, you can use the following solution.

1. Open the site on which you want to "sign-in" or "sign-up" and copy the URL to the clipboard
   ![Usage on mobile](https://rawgit.com/w3core/password-defender/master/src/site/img/m/mobile-step-0.png)
2. Open the ["PasswordDefender for Mobile"](https://w3core.github.io/password-defender "PasswordDefender mobile version") website
   ![Usage on mobile](https://rawgit.com/w3core/password-defender/master/src/site/img/m/mobile-step-1.png)
3. Paste the copied to clipboard site URL to the "Enter site URL" field
   ![Usage on mobile](https://rawgit.com/w3core/password-defender/master/src/site/img/m/mobile-step-2.png)
4. Enter your master password to the password field and tap to the below button
   ![Usage on mobile](https://rawgit.com/w3core/password-defender/master/src/site/img/m/mobile-step-3.png)
5. Select the content of generated password from the opened popup and then copy to the clipboard
   ![Usage on mobile](https://rawgit.com/w3core/password-defender/master/src/site/img/m/mobile-step-4.png)
6. Return back to the website, paste the generated password to the password 
   field (3) and then tap to submit button (4)
   ![Usage on mobile](https://rawgit.com/w3core/password-defender/master/src/site/img/m/mobile-step-5.png)

Building (optional)
-------------------
1. Minify "src/script.js"
2. Encode minified script by using URI scheme
3. Wrap minified and encoded script "javascript:void(SOURCE)"
4. Save as "bookmark.js"
