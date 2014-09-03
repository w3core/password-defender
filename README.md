CryptoPass
==========

CryptoPass is the tiny bookmark script which allows to create unique strong one-side password for each unique site by using your master password

Installation:
-------------
1. Create new bookmark in most visible space of your browser
2. Set name of the bookmark as "Password"
3. Copy to the clipboard content of "bookmark.js" file.
4. Set location URL of the bookmark (paste from clipboard)

Usage:
------
1. Open "sign-in" or "sign-up" page of any site
2. Tap to the "Password" bookmark
3. You can see the "Password" widget in left-top side of page
4. Enter your master password to the password field of the widget
5. Tap to the password field on "sign-in" or "sign-up" form of the page
6. Tap to the "&rtrif;" button on the widget 
   (encrypted password will be inserted to the password field)

Building (optional):
--------------------
1. Minify "src/script.js"
2. Encode minified script by using URI scheme
3. Wrap minified and encoded script "javascript:void(SOURCE)"
4. Save as "bookmark.js"