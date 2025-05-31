

# OTP Input System

The OTP Input System is a JavaScript library that simplifies the implementation of One-Time Password (OTP) input fields in your web applications.

## Demo

[![View on CodePen](https://img.shields.io/badge/View%20on-CodePen-blue?style=for-the-badge&logo=codepen)](https://codepen.io/Ton-Miles/pen/GRPMqGN)
![Demo (opcional)](example.gif)

## Key Features

- **User-Friendly Interaction:** Enables users to input OTP codes with ease, providing support for keyboard navigation, pasting codes from the clipboard, and more.

- **Input Validation:** Ensures that only numeric characters are accepted as input, enhancing security and usability.

- **Automatic Focus Movement:** Facilitates navigation between OTP input fields, allowing users to easily move forward and backward.

- **Highly Customizable:** Customize the behavior and appearance of OTP input fields according to your project's needs.

## Quick Start

- **HTML Structure** Include the js file in your <body> or <head>.
- **JavaScript Initialization** In your script.js file, initialize the OTPInputHandler and register a callback to react to OTP changes.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Input Example</title>
    
    <link href="styles.css" rel="stylesheet">
    <script src="otp-input.js"></script> 
    <script src="script.js" defer></script> 
</head>
<body>
    <div class="otp">
        <div class="otp-input">
        </div>
        <div class="otp-input">
        </div>
        <div class="otp-input">
        </div>
        <div class="otp-input">
        </div>
        <div class="otp-input">
        </div>
        <div class="otp-input">
        </div>
    </div>
</body>
</html>
```

```javascript
// Create an instance of the OTPInputHandler
const otpInput = new OTPInputHandler(".otp-input");

// Update the OTP code field with the entered OTP value
otpInput.onInputEvent((otpCode) => {
    console.log("Current OTP Code:", otpCode);
    
    // Update the value of your OTP code field
    if (otpCodeField) {
        otpCodeField.value = otpCode;
    }
});
```

### Class Functions

| Function | Description |
|--------|-------------|
| `updateInputs` | This function should be called if you dynamically add or remove OTP input fields from the DOM (e.g., via AJAX) |
| `allFilled` | Checks if all OTP input fields have values. Returns true if all fields are filled, otherwise false |
| `getOTP` | Retrieves the complete OTP value by concatenating the values from all input fields. It returns the OTP as a single string |
| `onInputEvent` | Registers a callback function to be executed whenever there's an input event (keypress or paste) in any of the OTP fields |