document.addEventListener("DOMContentLoaded", function () {
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
   * Attaches an event listener to elements matching the specified selector.
   * @param events - A string containing one or more event types, separated by commas.
   * @param selector - A selector for the target elements.
   * @param callback - A function to be called when the event is triggered.
   */
  const attachEvent = (
    events: string,
    selector: string,
    callback: (event: Event) => void
  ): void => {
    // Split the events string into an array of events
    events
      .split(",")
      .map((event) => event.trim())
      .filter((event) => validEvents.includes(event))
      .forEach((event) => {
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

    /**
     * Constructor for the OTPInputHandler class.
     * @param selector - The CSS selector for OTP input fields.
     */
    constructor(selector: string) {
      this.selector = selector;
      this.inputIndex = 0;
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
      // Checks if the event is a KeyboardEvent and prevents the default action if
      // neither the Ctrl key nor the Meta key (Command key on Mac) is pressed,
      // indicating that it's not a Ctrl+C or Ctrl+V event.
      const keyboard = e as KeyboardEvent;
      if (!keyboard.ctrlKey && !keyboard.metaKey) {
        e.preventDefault();
      }

      // Get the index of the current input field
      this.inputIndex = this.getInputIndex(e.target as HTMLInputElement);
      const inputValue = this.inputs[this.inputIndex].value;

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
            /^\d$/.test(keyboard.key) && // Accepts only numeric characters
            !this.allFilled() &&
            !(this.inputIndex === this.inputs.length - 1 && inputValue !== "")
          ) {
            this.inputs[this.inputIndex].value = keyboard.key;
            this.moveFocusRight();
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
      const dataTransfer = clipboardEvent.clipboardData;
      if (dataTransfer) {
      
        const pasteData = dataTransfer.getData("text/plain")
          .slice(0, this.inputs.length - this.inputIndex) // Limits the pasted data length to the available input fields.
          .split("");

        if (pasteData) {
          // Checks if all pasted values are numeric.
          if (!pasteData.every((value) => /^\d$/.test(value))) {
            return;
          }

          // Populates the input fields with the pasted data.
          for (let i = 0; i < pasteData.length; i++) {
            if (this.inputIndex + i < this.inputs.length) {
              this.inputs[this.inputIndex + i].value = pasteData[i];
            }
          }
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
     * Moves the focus to the left input field.
     */
    public moveFocusLeft = () => {
      if (this.inputIndex !== 0) {
        this.inputs[this.inputIndex - 1].focus();
      }
    };

    /**
     * Moves the focus to the right input field.
     */
    public moveFocusRight = () => {
      if (this.inputIndex !== this.inputs.length - 1) {
        this.inputs[this.inputIndex + 1].focus();
      }
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
    public getInputIndex(input: HTMLInputElement): number {
      return Array.from(this.inputs).indexOf(input);
    }

    /**
     * Gets the OTP value from the input fields.
     * @returns The OTP value as a string.
     */
    public getOTP(): string {
      const otpValues = Array.from(this.inputs).map((input) => {
        return input.value;
      });

      return otpValues.join("");
    }
  }

  const otpHandler = new OTPInputHandler(".otp-input");

  attachEvent("keydown", ".otp-input", function (e: Event) {
    (document.getElementById("otpCode") as HTMLInputElement).value =
      otpHandler.getOTP();
  });
});
