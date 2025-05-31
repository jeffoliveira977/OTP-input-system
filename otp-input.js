/*
Copyright (c) 2023-2025 Jeff Oliveira
OTP Input Field
Version 3.0
https://github.com/jeffoliveira977/OTP-input-system
*/

/**
 * OTPInputHandler class manages OTP (One-Time Password) input fields and provides event handling.
 * It allows for user interaction and validation of input in OTP input fields.
 */
class OTPInputHandler {
  /**
   * Constructor for the OTPInputHandler class.
   * @param {string} selector - The CSS selector for OTP input fields.
   */
  constructor(selector) {
    if (selector) {
      this.selector = selector;
      this.inputs = document.querySelectorAll(selector);
      if (this.inputs.length) {
        this.inputIndex = 0;
        this.numericPattern = /^[0-9]$/;
        this.attachEventHandlers();
      } else {
        console.error("No elements found for the provided selector!");
      }
    }
  }

  /**
   * Attaches event handlers for OTP input fields.
   */
  attachEventHandlers() {
    this.inputs.forEach((input) => {
      input.addEventListener("keydown", this.handleKeyDown.bind(this));
      input.addEventListener("paste", this.handlePaste.bind(this));
    });
  }

  /**
   * Handles keydown events for OTP input fields.
   * @param {KeyboardEvent} e - The keyboard event
   */
  handleKeyDown(e) {
    if (e.ctrlKey || e.metaKey) {
      // If Ctrl or Meta are pressed, return immediately.
      return;
    } else {
      // If neither Ctrl nor Meta are pressed, prevent the default behavior.
      e.preventDefault();
    }

    // Get the index of the current input field.
    this.inputIndex = this.getInputIndex(e.target);

    switch (e.key) {
      case "ArrowLeft":
        this.moveFocusLeft();
        break;
      case "ArrowRight":
        this.moveFocusRight();
        break;
      case "Backspace":
      case "Delete":
        this.inputs[this.inputIndex].value = "";
        if (e.key === "Backspace") {
          this.moveFocusLeft();
        }
        break;
      case "Home":
        this.moveFocus(-this.inputIndex);
        break;
      case "End":
        this.moveFocus(this.inputs.length - this.inputIndex - 1);
        break;
      default:
        if (
          !this.allFilled() &&
          this.numericPattern.test(e.key) // Only accept numbers.
        ) {
          if (this.isEmptyInput(this.inputIndex)) {
            this.inputs[this.inputIndex].value = e.key;
          }

          // The focus can only move if the next input field is empty.
          if (this.isEmptyInput(this.inputIndex + 1)) {
            this.moveFocusRight();
          }
        }
        break;
    }
  }

  /**
   * Handles paste events for OTP input fields.
   * @param {ClipboardEvent} e - The clipboard event
   */
  handlePaste(e) {
    e.preventDefault();

    // Get the index of the current input field.
    this.inputIndex = this.getInputIndex(e.target);

    // Extracts text data from the clipboard and processes it for input.
    const pasteData = e.clipboardData
      .getData("text/plain")
      .slice(0, this.inputs.length - this.inputIndex) // Limits the pasted data length to the available input fields.
      .split("");

    if (pasteData) {
      // Checks if all pasted values are numeric
      if (!pasteData.every((value) => this.numericPattern.test(value))) {
        return;
      }

      // Populates the input fields with the pasted data.
      pasteData.forEach((value, i) => {
        const targetIndex = this.inputIndex + i;
        if (targetIndex < this.inputs.length) {
          this.setInputValue(targetIndex, value);
        }
      });
    }
  }

  /**
   * Updates the list of input fields based on the current selector.
   * This function should be called if new input fields are added dynamically using AJAX or other means.
   */
  updateInputs() {
    this.inputs = document.querySelectorAll(this.selector);
  }

  /**
   * Checks if the input field at the specified index is empty.
   * @param {number} inputIndex - The index of the input field to check.
   * @returns {boolean} TRUE if the input field is empty, otherwise FALSE.
   */
  isEmptyInput(inputIndex) {
    return (
      inputIndex < this.inputs.length && this.inputs[inputIndex].value === ""
    );
  }

  /**
   * Sets the value of the input field at the current index.
   * @param {number} inputIndex - The index of the input field to check.
   * @param {string} value - The value to set.
   */
  setInputValue(inputIndex, value) {
    if (inputIndex >= 0 && inputIndex < this.inputs.length) {
      this.inputs[inputIndex].value = value;
    }
  }

  /**
   * Moves the focus between inputs based on the direction parameter.
   * @param {number} direction - The direction to set the focus movement. Positive value for moving to the right, negative value for moving to the left.
   */
  moveFocus(direction) {
    const nextIndex = Math.min(
      Math.max(this.inputIndex + direction, 0),
      this.inputs.length - 1
    );
    this.inputs[nextIndex].focus();
    this.inputs[nextIndex].select();
  }

  /**
   * Moves the focus to the left input field.
   */
  moveFocusLeft() {
    this.moveFocus(-1);
  }

  /**
   * Moves the focus to the right input field.
   */
  moveFocusRight() {
    this.moveFocus(1);
  }

  /**
   * Checks if all OTP input fields have values.
   * @returns {boolean} True if all fields are filled, otherwise false.
   */
  allFilled() {
    return Array.from(this.inputs).every((input) => input.value !== "");
  }

  /**
   * Gets the index of the current input field.
   * @param {HTMLInputElement} input - The current input field element.
   * @returns {number} The index of the input field in the list.
   */
  getInputIndex(input) {
    return Array.from(this.inputs).indexOf(input);
  }

  /**
   * Gets the OTP value from the input fields.
   * @returns {string} The OTP value as a string.
   */
  getOTP() {
    return Array.from(this.inputs)
      .map((input) => input.value)
      .join("");
  }

  /**
   * Registers a callback to be executed on event listener (keydown and paste).
   * @param {Function} callback - Function to be called with the current OTP value.
   */
  onInputEvent(callback) {
    if (!this.selector) {
      console.error("Selector is not defined!");
      return;
    }

    this.inputs.forEach((input) => {
      input.addEventListener("keydown", () => callback(this.getOTP()));
      input.addEventListener("paste", () => callback(this.getOTP()));
    });
  }
}