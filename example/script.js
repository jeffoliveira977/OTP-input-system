window.onload = () => {
  const otpModal = document.getElementById("otpModal");
  const copyCodeBtn = document.getElementById("copyCodeBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const submitBtn =  document.querySelector(".otp-form").querySelector("button[type='submit']");

  document.querySelector(".glass-card").style.animation =
    "floating 3s ease-in-out infinite";

  const otpInput = new OTPInputHandler(".otp-input");

  const copyOtpCode = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        const originalText = otpInput.getOTP();
        modalOtpCode.textContent = "Copied!";
        modalOtpCode.classList.add("text-green-600");

        setTimeout(() => {
          modalOtpCode.textContent = originalText;
          modalOtpCode.classList.remove("text-green-600");
        }, 1000);
      })
      .catch(() => {
        alert("Error copying code");
      });
  };

  const showModal = (otpCode) => {
    modalOtpCode.textContent = otpCode;
    otpModal.classList.remove("opacity-0", "invisible");
    otpModal.classList.add("opacity-100", "visible");

    setTimeout(() => {
      modalContent.classList.remove("scale-75");
      modalContent.classList.add("scale-100");
    }, 50);
  };

  const closeModal = () => {
    modalContent.classList.remove("scale-100");
    modalContent.classList.add("scale-75");

    setTimeout(() => {
      otpModal.classList.remove("opacity-100", "visible");
      otpModal.classList.add("opacity-0", "invisible");
    }, 200);
  };

  otpModal.addEventListener("click", (e) => {
    if (e.target === otpModal) {
      closeModal();
    }
  });

  closeModalBtn.addEventListener("click", (e) => {
    closeModal();
  });

  copyCodeBtn.addEventListener("click", (e) => {
    const code = otpInput.getOTP();
    copyOtpCode(code);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && otpModal.classList.contains("visible")) {
      closeModal();
    }
  });

  otpInput.onInputEvent((otpCode) => {
    submitBtn.disabled = !otpInput.allFilled();
  });

  document.querySelector(".otp-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const code = otpInput.getOTP();

    if (code.length === 6) {
      document.getElementById("success-code").classList.remove("hidden");
      showModal(code);
    }
  });
};
