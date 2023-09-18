

# OTP Input System

The OTP Input System is a JavaScript library that simplifies the implementation of One-Time Password (OTP) input fields in your web applications. With this library, you can create highly interactive and user-friendly OTP input fields, allowing users to efficiently and securely enter OTP codes.

## Key Features

- **User-Friendly Interaction:** Enables users to input OTP codes with ease, providing support for keyboard navigation, pasting codes from the clipboard, and more.

- **Input Validation:** Ensures that only numeric characters are accepted as input, enhancing security and usability.

- **Automatic Focus Movement:** Facilitates navigation between OTP input fields, allowing users to easily move forward and backward.

- **Highly Customizable:** Customize the behavior and appearance of OTP input fields according to your project's needs.

## Quick Start

1. **Installation:** Include the JavaScript library in your web page.

2. **Initialization:** Create instances of the `OTPInputHandler` class for the OTP input fields you wish to use.

3. **Easy Integration:** Seamlessly integrate OTP input fields into your website or app, providing users with a secure and convenient input experience.


Example

```javascript
// Create an instance of the OTPInputHandler class
const otpHandler = new OTPInputHandler(".otp-input");

// Update the OTP code field with the entered OTP value
const otpCodeField = document.getElementById("otpCode");
otpCodeField.value = otpHandler.getOTP();
