// profile.js

document.addEventListener("DOMContentLoaded", () => {
  const profileForm = document.getElementById("profileForm");
  const photoInput = document.getElementById("photo");
  const previewImg = document.getElementById("photoPreview");

  // Preview the selected image before upload
  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        previewImg.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(profileForm);

    try {
      const response = await fetch("profile.php", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert("Profile updated successfully!");
        if (result.photo_url) {
          previewImg.src = result.photo_url;
        }
      } else {
        alert("Error: " + result.message);
      }
    } catch (err) {
      alert("Failed to update profile. Please try again.");
      console.error(err);
    }
  });
});
