/*
Copyright (c) 2023-2024 Jeff Oliveira
OTP Input Field
Version 2.0
https://github.com/jeffoliveira977/OTP-input-system
*/

// List of valid event types
const validEvents: string[] = [
  /* Keyboard Events */
  "keydown",
  "keyup",
  "keypress",

  /* Form Events */
  "submit",
  "input",
  "change",
  "focus",
  "blur",

  /* Clipboard Events */
  "cut",
  "copy",
  "paste",

  /* Mouse Events */
  "click",
  "mousedown",
  "mouseup",
  "mousemove",
  "mouseenter",
  "mouseleave"
];

/**
 * Attaches event listeners to elements matching the specified selector.
 *
 * @param events - A string containing one or more event types separated by commas,
 *                 or an array of event-function pairs.
 * @param selector - A selector for the target elements.
 * @param callbackOrFunctions - A function to be called when the event is triggered,
 *                             or an array of functions for each event type.
 */

export const attachEvent = (
  events: string | [string, Function][],
  selector: string,
  callback: Function | Function[]
): void => {
  // Handle different event and callback formats
  let eventsList: [string, Function][];
  if (typeof events === "string") {
    eventsList = events
      .split(",")
      .map((event) => event.trim())
      .filter((event) => validEvents.includes(event))
      .map((event) => [event, callback as Function]);
  } else if (Array.isArray(events) && events.length > 0) {
    eventsList = events.map(([event, callback]) => {
      if (!validEvents.includes(event) || !typeof callback === "function") {
        throw new Error("Invalid event or callback provided.");
      }
      return [event, callback];
    });
  } else {
    throw new Error(
      "Invalid events format. Expected string or array of event-function pairs."
    );
  }

  // Attach event listeners for each event
  eventsList.forEach(([event, callback]) => {
    document.addEventListener(event, (e) => {
      const target = e.target as HTMLElement;
      if (target.closest(selector)) {
        // Call the callback function, setting `this` to the target
        callback.call(target, e);
      }
    });
  });
};

/**
 * OTPInputHandler class manages OTP (One-Time Password) input fields and provides event handling.
 * It allows for user interaction and validation of input in OTP input fields.
 */
class OTPInputHandler {
  // The selector for OTP input fields
  private selector: string;

  // List of input fields
  private inputs: NodeListOf<HTMLInputElement>;

  // Index of the current input field
  private inputIndex: number;

  private alphaNumericPattern: string;

  /**
   * Constructor for the OTPInputHandler class.
   * @param selector - The CSS selector for OTP input fields.
   */
  constructor(selector: string) {
    this.selector = selector;
    this.inputIndex = 0;
    this.alphaNumericPattern = /^[a-zA-Z0-9]$/;
    this.inputs = document.querySelectorAll<HTMLInputElement>(this.selector);
    this.attachEventHandlers();
  }

  /**
   * Attaches event handlers for OTP input fields.
   */
  private attachEventHandlers() {
    attachEvent("keydown", this.selector, this.handleKeyDown);
    attachEvent("paste", this.selector, this.handlePaste);
  }

  /**
   * Handles keydown events for OTP input fields.
   */
  private handleKeyDown = (e: Event) => {
    const keyboard = e as KeyboardEvent;

    if (keyboard.ctrlKey || keyboard.metaKey) {
      // If Ctrl or Meta are pressed, return immediately
      return;
    } else {
      // If neither Ctrl nor Meta are pressed, prevent the default behavior
      e.preventDefault();
    }

    // Get the index of the current input field
    this.inputIndex = this.getInputIndex(e.target as HTMLInputElement);
    switch (keyboard.key) {
      case "Backspace":
        this.inputs[this.inputIndex].value = "";
        this.moveFocusLeft();
        break;
      case "Delete":
        this.inputs[this.inputIndex].value = "";
        break;
      case "ArrowLeft":
        this.moveFocusLeft();
        break;
      case "ArrowRight":
        this.moveFocusRight();
        break;
      default:
        if (
          !this.allFilled() &&
          this.alphaNumericPattern.test(keyboard.key) // Only accept alphanumeric characters.
        ) {
          if (this.isEmptyInput(this.inputIndex)) {
            this.inputs[this.inputIndex].value = keyboard.key;
          }

          // The focus can only move if the next input field is empty.
          if (this.isEmptyInput(this.inputIndex + 1)) {
            this.moveFocusRight();
          }
        }
        break;
    }
  };

  /**
   * Handles paste events for OTP input fields.
   */
  private handlePaste = (e: Event) => {
    e.preventDefault();

    // Get the index of the current input field
    this.inputIndex = this.getInputIndex(e.target as HTMLInputElement);

    const clipboardEvent = e as ClipboardEvent;

    // Extracts text data from the clipboard and processes it for input.
    const pasteData = clipboardEvent.clipboardData
      .getData("text/plain")
      .slice(0, this.inputs.length - this.inputIndex) // Limits the pasted data length to the available input fields.
      .split("");

    if (pasteData) {
      // Checks if all pasted values are alphanumeric.
      if (!pasteData.every((value) => this.alphaNumericPattern.test(value))) {
        return;
      }

      // Populates the input fields with the pasted data.
      for (var i = 0; i < pasteData.length; i++) {
        this.setInputValue(this.inputIndex + i, pasteData[i]);
      }
    }
  };

  /**
   * Updates the list of input fields based on the current selector.
   * This function should be called if new input fields are added dynamically using AJAX or other means.
   */
  public updateInputs() {
    this.inputs = document.querySelectorAll<HTMLInputElement>(this.selector);
  }

  /**
   * Checks if it is the last input field.
   * @returns TRUE if it is the last field, otherwise false.
   */
  public isLastInput(): boolean {
    return this.inputIndex === this.inputs.length - 1;
  }

  /**
   * Checks if the input field at the specified index is empty.
   * @param inputIndex The index of the input field to check.
   * @returns TRUE if the input field is empty, otherwise FALSE.
   */
  public isEmptyInput(inputIndex: number): boolean {
    return (
      inputIndex < this.inputs.length && this.inputs[inputIndex].value === ""
    );
  }

  /**
   * Sets the value of the input field at the current index.
   * @param inputIndex The index of the input field to check.
   * @param value The value to set.
   */
  public setInputValue(inputIndex: number, value: string) {
    if (inputIndex >= 0 && inputIndex < this.inputs.length) {
      this.inputs[inputIndex].value = value;
    }
  }

  /**
   * Moves the focus between inputs based on the direction parameter.
   * @param direction: The direction to set the focus movement. Positive value for moving to the right, negative value for moving to the left.
   */
  private moveFocus = (direction: number) => {
    const nextIndex = this.inputIndex + direction;

    if (nextIndex >= 0 && nextIndex < this.inputs.length) {
      this.inputs[nextIndex].focus();
    }
  };

  /**
   * Moves the focus to the left input field.
   */
  public moveFocusLeft = () => {
    this.moveFocus(-1);
  };

  /**
   * Moves the focus to the right input field.
   */
  public moveFocusRight = () => {
    this.moveFocus(1);
  };

  /**
   * Checks if all OTP input fields have values.
   * @returns True if all fields are filled, otherwise false.
   */
  public allFilled(): boolean {
    return Array.from(this.inputs).every((input) => input.value !== "");
  }

  /**
   * Gets the index of the current input field.
   * @param input - The current input field element.
   * @returns The index of the input field in the list.
   */
  private getInputIndex(input: HTMLInputElement): number {
    return Array.from(this.inputs).indexOf(input);
  }

  /**
   * Gets the OTP value from the input fields.
   * @returns The OTP value as a string.
   */
  public getOTP(): string {
    const otpValues = Array.from(this.inputs).map((input) => input.value);

    return otpValues.join("");
  }
}

window.onload = () => {
  const otpHandler = new OTPInputHandler(".otp-input");

  // Single callback for multiple events:
  attachEvent("keydown, paste", ".otp-input", function (e: Event) {
    (document.getElementById(
      "otpCode"
    ) as HTMLInputElement).value = otpHandler.getOTP();
  });
};
